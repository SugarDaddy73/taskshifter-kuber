using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskShifter.BusinessLogic.Models.Projects;
using TaskShifter.BusinessLogic.Models.Projects.Request;
using TaskShifter.BusinessLogic.Services.Projects.Abstractions;
using TaskShifter.WebApi.Shared.Extensions;

namespace TaskShifter.WebApi.Controllers;

[ApiController]
[Authorize]
[Route("projects")]
public sealed class ProjectController(IProjectService projectService) : ControllerBase
{
    /// <summary>
    /// Retrieves all projects associated with the authenticated user.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult> GetAssociatedProjects(CancellationToken ct)
    {
        IEnumerable<ProjectCompactModel> projects = await projectService
            .GetAssociatedProjectsAsync(this.GetIssuerContext(), ct)
            .UnwrapOrThrow();

        return Ok(projects);
    }

    /// <summary>
    /// Retrieves a specific project by its ID.
    /// </summary>
    [HttpGet("{projectId:guid}")]
    public async Task<ActionResult> GetProjectById([FromRoute] Guid projectId, CancellationToken ct)
    {
        ProjectModel project = await projectService
            .GetProjectByIdAsync(this.GetIssuerContext(), new RequestToGetProjectById(projectId), ct)
            .UnwrapOrThrow();

        return Ok(project);
    }

    /// <summary>
    /// Creates a new project based on the provided request.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> CreateProject(RequestToCreateProject request, CancellationToken ct)
    {
        ProjectModel project = await projectService
            .CreateProjectAsync(this.GetIssuerContext(), request, ct)
            .UnwrapOrThrow();

        return Ok(project);
    }

    /// <summary>
    /// Updates an existing project based on the provided request.
    /// </summary>
    [HttpPut("{projectId:guid}")]
    public async Task<ActionResult> UpdateProject([FromRoute] Guid projectId, RequestToUpdateProject request, CancellationToken ct)
    {
        await projectService
            .UpdateProjectAsync(this.GetIssuerContext(), request with { ProjectId = projectId }, ct)
            .UnwrapOrThrow();

        return Ok();
    }

    /// <summary>
    /// Adds a member to a project based on the provided request.
    /// </summary>
    [HttpPost("{projectId:guid}/members")]
    public async Task<ActionResult> AddMember([FromRoute] Guid projectId, RequestToAddProjectMember request, CancellationToken ct)
    {
        await projectService
            .AddMemberAsync(this.GetIssuerContext(), request with { ProjectId = projectId }, ct)
            .UnwrapOrThrow();

        return Ok();
    }

    /// <summary>
    /// Removes a member from a project based on the provided project ID and user ID.
    /// </summary>
    [HttpDelete("{projectId:guid}/members/{userId:guid}")]
    public async Task<ActionResult> RemoveMember([FromRoute] Guid projectId, [FromRoute] Guid userId,
        CancellationToken ct)
    {
        await projectService
            .RemoveMemberAsync(this.GetIssuerContext(), new RequestToRemoveProjectMember(projectId, userId), ct)
            .UnwrapOrThrow();

        return Ok();
    }

    /// <summary>
    /// Updates a member's role in a project based on the provided request.
    /// </summary>
    [HttpPut("{projectId:guid}/members/{userId:guid}/role")]
    public async Task<ActionResult> UpdateMemberRole([FromRoute] Guid projectId, [FromRoute] Guid userId,
        RequestToUpdateProjectMemberRole request, CancellationToken ct)
    {
        await projectService
            .UpdateMemberRoleAsync(this.GetIssuerContext(),
                request with { ProjectId = projectId, UserId = userId }, ct)
            .UnwrapOrThrow();

        return Ok();
    }

    /// <summary>
    /// Allows the user to leave a project.
    /// </summary>
    [HttpPost("{projectId:guid}/leave")]
    public async Task<ActionResult> LeaveProject([FromRoute] Guid projectId, CancellationToken ct)
    {
        await projectService
            .LeaveProjectAsync(this.GetIssuerContext(), new RequestToLeaveProject(projectId), ct)
            .UnwrapOrThrow();

        return Ok();
    }

    /// <summary>
    /// Deletes a project by its ID.
    /// </summary>
    [HttpDelete("{projectId:guid}")]
    public async Task<ActionResult> DeleteProject([FromRoute] Guid projectId, CancellationToken ct)
    {
        await projectService
            .DeleteProjectAsync(this.GetIssuerContext(), new RequestToDeleteProject(projectId), ct)
            .UnwrapOrThrow();

        return Ok();
    }
}
