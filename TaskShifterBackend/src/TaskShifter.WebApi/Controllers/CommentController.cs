using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskShifter.BusinessLogic.Models.Comments;
using TaskShifter.BusinessLogic.Models.Comments.Request;
using TaskShifter.BusinessLogic.Services.Comments.Abstractions;
using TaskShifter.WebApi.Shared.Extensions;

namespace TaskShifter.WebApi.Controllers;

[ApiController]
[Authorize]
[Route("projects/{projectId:guid}/tasks/{taskId:guid}/comments")]
public sealed class CommentController(ICommentService commentService) : ControllerBase
{
    /// <summary>
    /// Creates a new comment for the specified task.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> CreateComment(
        [FromRoute] Guid projectId,
        [FromRoute] Guid taskId,
        RequestToCreateComment request,
        CancellationToken ct)
    {
        CommentModel comment = await commentService
            .CreateCommentAsync(this.GetIssuerContext(),
                request with { ProjectId = projectId, TaskId = taskId }, ct)
            .UnwrapOrThrow();

        return Ok(comment);
    }

    /// <summary>
    /// Updates an existing comment.
    /// </summary>
    [HttpPut("{commentId:guid}")]
    public async Task<ActionResult> UpdateComment(
        [FromRoute] Guid projectId,
        [FromRoute] Guid taskId,
        [FromRoute] Guid commentId,
        RequestToUpdateComment request,
        CancellationToken ct)
    {
        await commentService
            .UpdateCommentAsync(this.GetIssuerContext(),
                new RequestToUpdateComment(projectId, taskId, commentId, request.Content), ct)
            .UnwrapOrThrow();

        return Ok();
    }

    /// <summary>
    /// Deletes a comment.
    /// </summary>
    [HttpDelete("{commentId:guid}")]
    public async Task<ActionResult> DeleteComment(
        [FromRoute] Guid projectId,
        [FromRoute] Guid taskId,
        [FromRoute] Guid commentId,
        CancellationToken ct)
    {
        await commentService
            .DeleteCommentAsync(this.GetIssuerContext(),
                new RequestToDeleteComment(projectId, taskId, commentId), ct)
            .UnwrapOrThrow();

        return Ok();
    }
}
