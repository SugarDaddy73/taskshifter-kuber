using TaskShifter.Shared.Results;

namespace TaskShifter.DataLayer.Abstractions.Shared.Action;

public interface IUpdateRepository<TEntity> : IRepository
{
    Task<Result> UpdateAsync(
        TEntity entity,
        CancellationToken ct = default);
}
