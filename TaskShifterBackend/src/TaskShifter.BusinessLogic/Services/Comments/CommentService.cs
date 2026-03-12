using TaskShifter.BusinessLogic.Models.Comments;
using TaskShifter.BusinessLogic.Models.Comments.Errors;
using TaskShifter.BusinessLogic.Models.Comments.Request;
using TaskShifter.BusinessLogic.Models.Projects.Errors;
using TaskShifter.BusinessLogic.Models.Roles.Errors;
using TaskShifter.BusinessLogic.Models.Tasks.Errors;
using TaskShifter.BusinessLogic.Models.Users;
using TaskShifter.BusinessLogic.Services.Comments.Abstractions;
using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataAccess.Entities.Entities.Enums;
using TaskShifter.DataLayer.Abstractions;
using TaskShifter.Shared.Results;

namespace TaskShifter.BusinessLogic.Services.Comments;

public sealed class CommentService(IUnitOfWork unitOfWork) : ICommentService
{
    /// <summary>
    /// Creates a new comment on a specified task within a project.
    /// </summary>
    public async Task<Result<CommentModel>> CreateCommentAsync(IssuerContext issuerContext, RequestToCreateComment request, CancellationToken ct = default)
    {
        Result verifyResult = await VerifyUserIsMemberOfProject(issuerContext, request.ProjectId, ct);
        if (verifyResult.IsFailure) return verifyResult.Error;

        // Verify task exists and belongs to the project
        Result<TaskEntity> taskResult = await unitOfWork.TaskRepository
            .GetFirstByFilterAsync(t => t.Id == request.TaskId && t.ProjectId == request.ProjectId, ct: ct);

        if (taskResult.IsFailure) return TaskErrors.NotFound;

        CommentEntity comment = new()
        {
            Id = Guid.NewGuid(),
            AuthorId = issuerContext.IssuerId,
            TaskId = request.TaskId,
            Content = request.Content,
            CreationDate = DateTime.UtcNow,
        };

        Result<CommentEntity> addResult = await unitOfWork.CommentRepository.AddAsync(comment, ct);
        if (addResult.IsFailure) return addResult.Error;

        await unitOfWork.SaveChangesAsync(ct);

        return CommentModel.From(addResult.Value);
    }

    /// <summary>
    /// Updates an existing comment on a specified task within a project.
    /// </summary>
    public async Task<Result> UpdateCommentAsync(IssuerContext issuerContext, RequestToUpdateComment request, CancellationToken ct = default)
    {
        Result verifyResult = await VerifyUserIsMemberOfProject(issuerContext, request.ProjectId, ct);
        if (verifyResult.IsFailure) return verifyResult.Error;

        // Verify task exists and belongs to the project
        Result<TaskEntity> taskResult = await unitOfWork.TaskRepository
            .GetFirstByFilterAsync(t => t.Id == request.TaskId && t.ProjectId == request.ProjectId, ct: ct);

        if (taskResult.IsFailure) return TaskErrors.NotFound;

        // Get the comment and verify ownership
        Result<CommentEntity> commentResult = await unitOfWork.CommentRepository
            .GetFirstByFilterAsync(c => c.Id == request.CommentId && c.TaskId == request.TaskId, ct: ct);

        if (commentResult.IsFailure) return commentResult.Error;

        CommentEntity comment = commentResult.Value;
        if (comment.AuthorId != issuerContext.IssuerId)
        {
            return CommentErrors.YouAreNotAuthor;
        }

        comment.Content = request.Content;
        comment.UpdateDate = DateTime.UtcNow;

        Result updateResult = await unitOfWork.CommentRepository.UpdateAsync(comment, ct);
        if (updateResult.IsFailure) return updateResult.Error;

        await unitOfWork.SaveChangesAsync(ct);
        return Result.Success;
    }

    /// <summary>
    /// Deletes an existing comment on a specified task within a project.
    /// </summary>
    public async Task<Result> DeleteCommentAsync(IssuerContext issuerContext, RequestToDeleteComment request, CancellationToken ct = default)
    {
        Result verifyResult = await VerifyUserIsMemberOfProject(issuerContext, request.ProjectId, ct);
        if (verifyResult.IsFailure) return verifyResult.Error;

        // Verify task exists and belongs to the project
        Result<TaskEntity> taskResult = await unitOfWork.TaskRepository
            .GetFirstByFilterAsync(t => t.Id == request.TaskId && t.ProjectId == request.ProjectId, ct: ct);

        if (taskResult.IsFailure) return TaskErrors.NotFound;

        // Get the comment and verify ownership
        Result<CommentEntity> commentResult = await unitOfWork.CommentRepository
            .GetFirstByFilterAsync(c => c.Id == request.CommentId && c.TaskId == request.TaskId, ct: ct);

        if (commentResult.IsFailure) return commentResult.Error;

        if (commentResult.Value.AuthorId != issuerContext.IssuerId)
        {
            return CommentErrors.YouAreNotAuthor;
        }

        Result deleteResult = await unitOfWork.CommentRepository.DeleteByIdAsync(request.CommentId, ct);
        if (deleteResult.IsFailure) return deleteResult.Error;

        await unitOfWork.SaveChangesAsync(ct);
        return Result.Success;
    }

    private async Task<Result> VerifyUserIsMemberOfProject(IssuerContext context, Guid projectId, CancellationToken ct)
    {
        Result<Role> roleResult = await unitOfWork.RoleRepository.GetUserRoleAsync(projectId, context.IssuerId, ct);
        if (roleResult.IsFailure && roleResult.Error.Code == RoleErrors.NotFound.Code) return ProjectErrors.NotFound;
        else if (roleResult.IsFailure) return roleResult.Error;

        return Result.Success;
    }
}
