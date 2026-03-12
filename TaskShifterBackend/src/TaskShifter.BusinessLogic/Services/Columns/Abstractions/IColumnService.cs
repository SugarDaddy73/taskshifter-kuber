using TaskShifter.BusinessLogic.Models.Columns;
using TaskShifter.BusinessLogic.Models.Columns.Request;
using TaskShifter.BusinessLogic.Models.Users;
using TaskShifter.Shared.Results;

namespace TaskShifter.BusinessLogic.Services.Columns.Abstractions;

public interface IColumnService
{
    Task<Result> CreateDefaultColumnsAsync(
        RequestToCreateDefaultColumns request,
        CancellationToken ct = default);

    Task<Result<ColumnModel>> CreateColumnAsync(
        IssuerContext context,
        RequestToCreateColumn request,
        CancellationToken ct = default);

    Task<Result> UpdateColumnAsync(
        IssuerContext context,
        RequestToUpdateColumn request,
        CancellationToken ct = default);

    Task<Result> MoveColumnLeftAsync(
        IssuerContext context,
        RequestToMoveColumnLeft request,
        CancellationToken ct = default);

    Task<Result> MoveColumnRightAsync(
        IssuerContext context,
        RequestToMoveColumnRight request,
        CancellationToken ct = default);

    Task<Result> DeleteColumnAsync(
        IssuerContext context,
        RequestToDeleteColumn request,
        CancellationToken ct = default);
}
