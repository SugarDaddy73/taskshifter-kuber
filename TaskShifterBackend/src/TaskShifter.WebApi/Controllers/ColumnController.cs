using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskShifter.BusinessLogic.Models.Columns;
using TaskShifter.BusinessLogic.Models.Columns.Request;
using TaskShifter.BusinessLogic.Services.Columns.Abstractions;
using TaskShifter.WebApi.Shared.Extensions;

namespace TaskShifter.WebApi.Controllers;

[ApiController]
[Authorize]
[Route("projects/{projectId:guid}/columns")]
public sealed class ColumnController(IColumnService columnService) : ControllerBase
{
    /// <summary>
    /// Creates a new column in the specified project.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> CreateColumn(
        [FromRoute] Guid projectId,
        RequestToCreateColumn request,
        CancellationToken ct)
    {
        ColumnModel column = await columnService
            .CreateColumnAsync(this.GetIssuerContext(), request with { ProjectId = projectId }, ct)
            .UnwrapOrThrow();

        return Ok(column);
    }

    /// <summary>
    /// Updates an existing column in the specified project.
    /// </summary>
    [HttpPut("{columnId:guid}")]
    public async Task<ActionResult> UpdateColumn(
        [FromRoute] Guid projectId,
        [FromRoute] Guid columnId,
        RequestToUpdateColumn request,
        CancellationToken ct)
    {
        await columnService
            .UpdateColumnAsync(this.GetIssuerContext(),
                request with { ProjectId = projectId, ColumnId = columnId }, ct)
            .UnwrapOrThrow();

        return Ok();
    }

    /// <summary>
    /// Moves a column one position to the left within the project.
    /// </summary>
    [HttpPost("{columnId:guid}/move-left")]
    public async Task<ActionResult> MoveColumnLeft(
        [FromRoute] Guid projectId,
        [FromRoute] Guid columnId,
        CancellationToken ct)
    {
        await columnService
            .MoveColumnLeftAsync(this.GetIssuerContext(),
                new RequestToMoveColumnLeft(projectId, columnId), ct)
            .UnwrapOrThrow();

        return Ok();
    }

    /// <summary>
    /// Moves a column one position to the right within the project.
    /// </summary>
    [HttpPost("{columnId:guid}/move-right")]
    public async Task<ActionResult> MoveColumnRight(
        [FromRoute] Guid projectId,
        [FromRoute] Guid columnId,
        CancellationToken ct)
    {
        await columnService
            .MoveColumnRightAsync(this.GetIssuerContext(),
                new RequestToMoveColumnRight(projectId, columnId), ct)
            .UnwrapOrThrow();

        return Ok();
    }

    /// <summary>
    /// Deletes a column from the project.
    /// </summary>
    [HttpDelete("{columnId:guid}")]
    public async Task<ActionResult> DeleteColumn(
        [FromRoute] Guid projectId,
        [FromRoute] Guid columnId,
        CancellationToken ct)
    {
        await columnService
            .DeleteColumnAsync(this.GetIssuerContext(),
                new RequestToDeleteColumn(projectId, columnId), ct)
            .UnwrapOrThrow();

        return Ok();
    }
}
