using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskShifter.BusinessLogic.Models.Tasks;
using TaskShifter.BusinessLogic.Models.Tasks.Request;
using TaskShifter.BusinessLogic.Services.Tasks.Abstractions;
using TaskShifter.WebApi.Shared.Extensions;

namespace TaskShifter.WebApi.Controllers;

[ApiController]
[Authorize]
[Route("projects/{projectId:guid}/tasks")]
public sealed class TaskController(ITaskService taskService) : ControllerBase
{
    /// <summary>
    /// Creates a new task in the specified project.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> CreateTask(
        [FromRoute] Guid projectId,
        RequestToCreateTask request,
        CancellationToken ct)
    {
        TaskModel task = await taskService
            .CreateTaskAsync(this.GetIssuerContext(), request with { ProjectId = projectId }, ct)
            .UnwrapOrThrow();

        return Ok(task);
    }

    /// <summary>
    /// Updates an existing task in the specified project.
    /// </summary>
    [HttpPut("{taskId:guid}")]
    public async Task<ActionResult> UpdateTask(
        [FromRoute] Guid projectId,
        [FromRoute] Guid taskId,
        RequestToUpdateTask request,
        CancellationToken ct)
    {
        await taskService
            .UpdateTaskAsync(this.GetIssuerContext(),
                request with { ProjectId = projectId, TaskId = taskId }, ct)
            .UnwrapOrThrow();

        return Ok();
    }

    /// <summary>
    /// Deletes a task from the project.
    /// </summary>
    [HttpDelete("{taskId:guid}")]
    public async Task<ActionResult> DeleteTask(
        [FromRoute] Guid projectId,
        [FromRoute] Guid taskId,
        CancellationToken ct)
    {
        await taskService
            .DeleteTaskAsync(this.GetIssuerContext(), new RequestToDeleteTask(projectId, taskId), ct)
            .UnwrapOrThrow();

        return Ok();
    }
}
