using TaskShifter.BusinessLogic.Models.Projects;
using TaskShifter.BusinessLogic.Models.Projects.Errors;
using TaskShifter.BusinessLogic.Models.Projects.Request;
using TaskShifter.BusinessLogic.Models.Roles.Errors;
using TaskShifter.BusinessLogic.Models.Users;
using TaskShifter.BusinessLogic.Services.Projects.Abstractions;
using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataAccess.Entities.Entities.Enums;
using TaskShifter.DataLayer.Abstractions;
using TaskShifter.Shared.Extensions;
using TaskShifter.Shared.Results;

namespace TaskShifter.BusinessLogic.Services.Projects;

public sealed class ProjectService(IUnitOfWork unitOfWork) : IProjectService
{
    /// <summary>
    /// Retrieves all projects associated with the user in the given context.
    /// </summary>
    public async Task<Result<IEnumerable<ProjectCompactModel>>> GetAssociatedProjectsAsync(IssuerContext context,
        CancellationToken ct = default)
    {
        Result<IEnumerable<ProjectEntity>> projectsResult = await unitOfWork
            .ProjectRepository
            .GetManyByFilterAsync(p => p.Members.Any(m => m.Id == context.IssuerId),
                [nameof(ProjectEntity.Members)], ct);

        if (projectsResult.IsFailure) return projectsResult.Error;

        IEnumerable<ProjectCompactModel> projects = projectsResult.Value.Select(ProjectCompactModel.From).ToList();

        foreach (ProjectCompactModel project in projects)
        {
            Result mapRolesResult = await MapRolesAsync(project, ct);
            if (mapRolesResult.IsFailure) return mapRolesResult.Error;
        }

        return projects.AsResult();
    }

    public async Task<Result<ProjectModel>> GetProjectByIdAsync(IssuerContext context, RequestToGetProjectById request, CancellationToken ct = default)
    {
        Result<ProjectEntity> projectResult = await unitOfWork
            .ProjectRepository
            .GetFirstByFilterAsync(p => p.Id == request.ProjectId && p.Members.Any(m => m.Id == context.IssuerId),
                [
                    nameof(ProjectEntity.Members),
                    nameof(ProjectEntity.Columns),
                    nameof(ProjectEntity.Tasks),
                    $"{nameof(ProjectEntity.Tasks)}.{nameof(TaskEntity.Comments)}"],
                ct);

        if (projectResult.IsFailure) return projectResult.Error;

        ProjectModel project = ProjectModel.From(projectResult.Value);

        Result mapRolesResult = await MapRolesAsync(project, ct);
        if (mapRolesResult.IsFailure) return mapRolesResult.Error;

        return project;
    }

    /// <summary>
    /// Creates a new project based on the provided request and context.
    /// </summary>
    public async Task<Result<ProjectModel>> CreateProjectAsync(IssuerContext context, RequestToCreateProject request, CancellationToken ct = default)
    {
        Result<UserEntity> issuerResult = await unitOfWork.UserRepository.GetFirstByFilterAsync(u => u.Id == context.IssuerId, ct: ct);
        if (issuerResult.IsFailure) return issuerResult.Error;

        ProjectEntity newProject = new()
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
        };

        Result<ProjectEntity> addProjectResult = await unitOfWork.ProjectRepository.AddAsync(newProject, ct);
        if (addProjectResult.IsFailure) return addProjectResult.Error;

        Result assignRoleResult = await unitOfWork.RoleRepository.AssignRoleAsync(newProject.Id, issuerResult.Value.Id, Role.Owner, ct);
        if (assignRoleResult.IsFailure) return assignRoleResult.Error;

        await unitOfWork.SaveChangesAsync(ct);

        ProjectModel project = ProjectModel.From(addProjectResult.Value);

        Result mapRolesResult = await MapRolesAsync(project, ct);
        if (mapRolesResult.IsFailure) return mapRolesResult.Error;

        return project;
    }

    /// <summary>
    /// Updates an existing project based on the provided request and context.
    /// </summary>
    public async Task<Result> UpdateProjectAsync(IssuerContext context, RequestToUpdateProject request, CancellationToken ct = default)
    {
        Result<ProjectEntity> projectResult = await unitOfWork.ProjectRepository.GetFirstByFilterAsync(p => p.Id == request.ProjectId, ct: ct);
        if (projectResult.IsFailure) return projectResult.Error;

        Result<Role> issuerRoleResult = await unitOfWork.RoleRepository.GetUserRoleAsync(request.ProjectId, context.IssuerId, ct);
        if (issuerRoleResult.IsFailure) return issuerRoleResult.Error;

        // Verify that the user is the Owner to update the project
        if (issuerRoleResult.Value < Role.Owner) return ProjectErrors.NotEnoughPermissions;

        ProjectEntity project = projectResult.Value;
        project.Name = request.Name;

        Result updateResult = await unitOfWork.ProjectRepository.UpdateAsync(project, ct);
        if (updateResult.IsFailure) return updateResult.Error;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }

    /// <summary>
    /// Adds a member to a project based on the provided request and context.
    /// </summary>
    public async Task<Result> AddMemberAsync(IssuerContext context, RequestToAddProjectMember request, CancellationToken ct = default)
    {
        Result<ProjectEntity> projectResult = await unitOfWork.ProjectRepository.GetFirstByFilterAsync(p => p.Id == request.ProjectId,
            [nameof(ProjectEntity.Members)],
            ct: ct);
        if (projectResult.IsFailure) return projectResult.Error;

        Result<Role> issuerRoleResult = await unitOfWork.RoleRepository.GetUserRoleAsync(request.ProjectId, context.IssuerId, ct);
        if (issuerRoleResult.IsFailure && issuerRoleResult.Error.Code == RoleErrors.NotFound.Code) return ProjectErrors.NotFound;
        else if (issuerRoleResult.IsFailure) return issuerRoleResult.Error;

        // Verify that the user is an Owner to add members to the project
        if (issuerRoleResult.Value < Role.Admin) return ProjectErrors.NotEnoughPermissions;

        Result<UserEntity> userResult = await unitOfWork.UserRepository.GetFirstByFilterAsync(u => u.Email == request.Email, ct: ct);
        if (userResult.IsFailure) return userResult.Error;

        ProjectEntity project = projectResult.Value;
        UserEntity user = userResult.Value;

        if (project.Members.Any(m => m.Id == user.Id))
        {
            return ProjectErrors.UserAlreadyMember;
        }

        Result assignRoleResult = await unitOfWork.RoleRepository.AssignRoleAsync(project.Id, user.Id, Role.Member, ct);
        if (assignRoleResult.IsFailure) return assignRoleResult.Error;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }

    /// <summary>
    /// Removes a member from a project based on the provided request and context.
    /// </summary>
    public async Task<Result> RemoveMemberAsync(IssuerContext context, RequestToRemoveProjectMember request, CancellationToken ct = default)
    {
        if (request.UserId == context.IssuerId) return ProjectErrors.CannotRemoveSelf;

        Result<ProjectEntity> projectResult = await unitOfWork.ProjectRepository.GetFirstByFilterAsync(p => p.Id == request.ProjectId,
            [nameof(ProjectEntity.Members)],
            ct: ct);
        if (projectResult.IsFailure) return projectResult.Error;

        Result<Role> issuerRoleResult = await unitOfWork.RoleRepository.GetUserRoleAsync(request.ProjectId, context.IssuerId, ct);
        if (issuerRoleResult.IsFailure) return issuerRoleResult.Error;

        Result<Role> userToKickRoleResult = await unitOfWork.RoleRepository.GetUserRoleAsync(request.ProjectId, request.UserId, ct);
        if (userToKickRoleResult.IsFailure) return userToKickRoleResult.Error;

        // Verify that the user is at least an Admin to remove members from the project
        if (issuerRoleResult.Value < Role.Admin) return ProjectErrors.NotEnoughPermissions;

        // Verify that the user is not trying to remove a user that has a role equal or higher than theirs
        if (userToKickRoleResult.Value >= issuerRoleResult.Value) return ProjectErrors.NotEnoughPermissions;

        Result<UserEntity> userResult = await unitOfWork.UserRepository.GetFirstByFilterAsync(u => u.Id == request.UserId, ct: ct);
        if (userResult.IsFailure) return userResult.Error;

        ProjectEntity project = projectResult.Value;
        UserEntity user = userResult.Value;

        if (project.Members.All(m => m.Id != user.Id))
        {
            return ProjectErrors.UserNotMember;
        }

        project.Members.Remove(user);

        Result removeMemberResult = await unitOfWork.RoleRepository.RemoveAssociationAsync(project.Id, user.Id, ct);
        if (removeMemberResult.IsFailure) return removeMemberResult.Error;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }

    /// <summary>
    /// Updates a member's role in a project based on the provided request and context.
    /// </summary>
    public async Task<Result> UpdateMemberRoleAsync(IssuerContext context, RequestToUpdateProjectMemberRole request,
        CancellationToken ct = default)
    {
        Result<ProjectEntity> projectResult = await unitOfWork.ProjectRepository.GetFirstByFilterAsync(p => p.Id == request.ProjectId,
            [nameof(ProjectEntity.Members)],
            ct: ct);
        if (projectResult.IsFailure) return projectResult.Error;

        Result<Role> roleResult = await unitOfWork.RoleRepository.GetUserRoleAsync(request.ProjectId, context.IssuerId, ct);
        if (roleResult.IsFailure) return roleResult.Error;

        // Verify that the user is an Owner to update member roles in the project
        if (roleResult.Value < Role.Owner) return ProjectErrors.NotEnoughPermissions;

        // Verify that the new role is not Owner (only one Owner allowed at the project)
        if (request.NewRole == Role.Owner) return ProjectErrors.CannotAssignOwnerRole;

        Result<UserEntity> userResult = await unitOfWork.UserRepository.GetFirstByFilterAsync(u => u.Id == request.UserId, ct: ct);
        if (userResult.IsFailure) return userResult.Error;

        ProjectEntity project = projectResult.Value;
        UserEntity user = userResult.Value;

        if (project.Members.All(m => m.Id != user.Id))
        {
            return ProjectErrors.UserNotMember;
        }

        Result assignRoleResult = await unitOfWork.RoleRepository.AssignRoleAsync(project.Id, user.Id, request.NewRole, ct);
        if (assignRoleResult.IsFailure) return assignRoleResult.Error;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }

    /// <summary>
    /// Allows the issuer to leave a project based on the provided request and context.
    /// </summary>
    public async Task<Result> LeaveProjectAsync(IssuerContext context, RequestToLeaveProject request, CancellationToken ct = default)
    {
        Result<ProjectEntity> projectResult = await unitOfWork.ProjectRepository.GetFirstByFilterAsync(p => p.Id == request.ProjectId,
            [nameof(ProjectEntity.Members)],
            ct: ct);
        if (projectResult.IsFailure) return projectResult.Error;

        Result<Role> issuerRoleResult = await unitOfWork.RoleRepository.GetUserRoleAsync(request.ProjectId, context.IssuerId, ct);
        if (issuerRoleResult.IsFailure && issuerRoleResult.Error.Code == RoleErrors.NotFound.Code) return ProjectErrors.NotFound;
        else if (issuerRoleResult.IsFailure) return issuerRoleResult.Error;

        // Verify that the user is not the Owner to leave the project
        if (issuerRoleResult.Value == Role.Owner) return ProjectErrors.OwnerCannotLeave;

        ProjectEntity project = projectResult.Value;

        Result<UserEntity> userResult = await unitOfWork.UserRepository.GetFirstByFilterAsync(u => u.Id == context.IssuerId, ct: ct);
        if (userResult.IsFailure) return userResult.Error;

        UserEntity user = userResult.Value;

        if (project.Members.All(m => m.Id != user.Id))
        {
            return ProjectErrors.UserNotMember;
        }

        project.Members.Remove(user);

        Result removeAssociationResult = await unitOfWork.RoleRepository.RemoveAssociationAsync(project.Id, user.Id, ct);
        if (removeAssociationResult.IsFailure) return removeAssociationResult.Error;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }

    /// <summary>
    /// Deletes a project based on the provided request and context.
    /// </summary>
    public async Task<Result> DeleteProjectAsync(IssuerContext context, RequestToDeleteProject request, CancellationToken ct = default)
    {
        Result<ProjectEntity> projectResult = await unitOfWork.ProjectRepository.GetFirstByFilterAsync(p => p.Id == request.ProjectId, ct: ct);
        if (projectResult.IsFailure) return projectResult.Error;

        Result<Role> roleResult = await unitOfWork.RoleRepository.GetUserRoleAsync(request.ProjectId, context.IssuerId, ct);
        if (roleResult.IsFailure) return roleResult.Error;

        // Verify that the user is an Owner to delete the project
        if (roleResult.Value < Role.Owner) return ProjectErrors.NotEnoughPermissions;

        Result deleteResult = await unitOfWork.ProjectRepository.DeleteByIdAsync(request.ProjectId, ct);
        if (deleteResult.IsFailure) return deleteResult.Error;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }

    private async Task<Result> MapRolesAsync(ProjectModel projectModel, CancellationToken ct = default)
    {
        foreach (UserProjectModel projectModelMember in projectModel.Members)
        {
            var roleResult = await unitOfWork.RoleRepository.GetUserRoleAsync(projectModel.Id, projectModelMember.Id, ct);
            if (roleResult.IsFailure) return roleResult.Error;

            projectModelMember.Role = roleResult.Value;
        }

        return Result.Success;
    }

    private async Task<Result> MapRolesAsync(ProjectCompactModel projectModel, CancellationToken ct = default)
    {
        foreach (UserProjectModel projectModelMember in projectModel.Members)
        {
            var roleResult = await unitOfWork.RoleRepository.GetUserRoleAsync(projectModel.Id, projectModelMember.Id, ct);
            if (roleResult.IsFailure) return roleResult.Error;

            projectModelMember.Role = roleResult.Value;
        }

        return Result.Success;
    }
}
