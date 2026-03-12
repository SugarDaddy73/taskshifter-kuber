using TaskShifter.BusinessLogic.Models.Projects;
using TaskShifter.BusinessLogic.Models.Projects.Request;
using TaskShifter.BusinessLogic.Models.Users;
using TaskShifter.Shared.Results;

namespace TaskShifter.BusinessLogic.Services.Projects.Abstractions;

public interface IProjectService
{
    Task<Result<IEnumerable<ProjectCompactModel>>> GetAssociatedProjectsAsync(
        IssuerContext context,
        CancellationToken ct = default);

    Task<Result<ProjectModel>> GetProjectByIdAsync(
        IssuerContext context,
        RequestToGetProjectById request,
        CancellationToken ct = default);

    Task<Result<ProjectModel>> CreateProjectAsync(
        IssuerContext context,
        RequestToCreateProject request,
        CancellationToken ct = default);

    Task<Result> UpdateProjectAsync(
        IssuerContext context,
        RequestToUpdateProject request,
        CancellationToken ct = default);

    Task<Result> AddMemberAsync(
        IssuerContext context,
        RequestToAddProjectMember request,
        CancellationToken ct = default);

    Task<Result> RemoveMemberAsync(
        IssuerContext context,
        RequestToRemoveProjectMember request,
        CancellationToken ct = default);

    Task<Result> UpdateMemberRoleAsync(
        IssuerContext context,
        RequestToUpdateProjectMemberRole request,
        CancellationToken ct = default);

    Task<Result> LeaveProjectAsync(
        IssuerContext context,
        RequestToLeaveProject request,
        CancellationToken ct = default);

    Task<Result> DeleteProjectAsync(
        IssuerContext context,
        RequestToDeleteProject request,
        CancellationToken ct = default);
}
