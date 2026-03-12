using TaskShifter.BusinessLogic.Models.Comments;
using TaskShifter.BusinessLogic.Models.Comments.Request;
using TaskShifter.BusinessLogic.Models.Users;
using TaskShifter.Shared.Results;

namespace TaskShifter.BusinessLogic.Services.Comments.Abstractions;

public interface ICommentService
{
    Task<Result<CommentModel>> CreateCommentAsync(
        IssuerContext issuerContext,
        RequestToCreateComment request,
        CancellationToken ct = default);

    Task<Result> UpdateCommentAsync(
        IssuerContext issuerContext,
        RequestToUpdateComment request,
        CancellationToken ct = default);

    Task<Result> DeleteCommentAsync(
        IssuerContext issuerContext,
        RequestToDeleteComment request,
        CancellationToken ct = default);
}
