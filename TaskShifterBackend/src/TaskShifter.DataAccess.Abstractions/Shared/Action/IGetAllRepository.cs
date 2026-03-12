using TaskShifter.Shared.Results;

namespace TaskShifter.DataLayer.Abstractions.Shared.Action;

public interface IGetAllRepository<TEntity> : IRepository
{
    Task<Result<IEnumerable<TEntity>>> GetAllAsync(
        string[]? includeOptions = null,
        CancellationToken ct = default);
}
