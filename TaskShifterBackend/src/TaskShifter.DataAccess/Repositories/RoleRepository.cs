using Microsoft.EntityFrameworkCore;
using TaskShifter.BusinessLogic.Models.Roles.Errors;
using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataAccess.Entities.Entities.Enums;
using TaskShifter.DataLayer.Abstractions.Repositories;
using TaskShifter.Shared.Results;

namespace TaskShifter.DataAccess.Repositories;

internal sealed class RoleRepository(ApplicationDbContext dbContext) : IRoleRepository
{
    public async Task<Result> AssignRoleAsync(Guid projectId, Guid userId, Role role, CancellationToken ct = default)
    {
        UserToProjectEntity? userProjectAssociation = await dbContext
            .UsersToProjects
            .FirstOrDefaultAsync(r => r.ProjectId == projectId && r.UserId == userId, ct);

        if (userProjectAssociation is not null)
        {
            userProjectAssociation.Role = role;

            dbContext.UsersToProjects.Update(userProjectAssociation);

            return Result.Success;
        }
        else
        {
            UserToProjectEntity newAssociation = new()
            {
                ProjectId = projectId,
                UserId = userId,
                Role = role,
            };

            await dbContext.UsersToProjects.AddAsync(newAssociation, ct);

            return Result.Success;
        }
    }

    public async Task<Result> RemoveAssociationAsync(Guid projectId, Guid userId, CancellationToken ct = default)
    {
        UserToProjectEntity? userProjectAssociation = await dbContext
            .UsersToProjects
            .FirstOrDefaultAsync(r => r.ProjectId == projectId && r.UserId == userId, ct);

        if (userProjectAssociation is null)
        {
            return RoleErrors.NotFound;
        }

        dbContext.UsersToProjects.Remove(userProjectAssociation);

        return Result.Success;
    }

    public async Task<Result<Role>> GetUserRoleAsync(Guid projectId, Guid userId, CancellationToken ct = default)
    {
        UserToProjectEntity? userProjectAssociation = await dbContext
            .UsersToProjects
            .FirstOrDefaultAsync(r => r.ProjectId == projectId && r.UserId == userId, ct);

        if (userProjectAssociation is null)
        {
            return RoleErrors.NotFound;
        }

        return userProjectAssociation.Role;
    }
}
