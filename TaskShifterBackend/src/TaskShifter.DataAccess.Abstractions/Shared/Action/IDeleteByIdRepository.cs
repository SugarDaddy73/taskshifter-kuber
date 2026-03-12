using TaskShifter.Shared.Results;

namespace TaskShifter.DataLayer.Abstractions.Shared.Action;

public interface IDeleteByIdRepository : IRepository
{
    Task<Result> DeleteByIdAsync(
        Guid entityId,
        CancellationToken ct = default);
}
