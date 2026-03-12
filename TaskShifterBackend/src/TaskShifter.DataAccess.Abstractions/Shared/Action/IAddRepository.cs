using TaskShifter.Shared.Results;

namespace TaskShifter.DataLayer.Abstractions.Shared.Action;

public interface IAddRepository<TEntity> : IRepository
{
    Task<Result<TEntity>> AddAsync(
        TEntity entity,
        CancellationToken ct = default);
}
