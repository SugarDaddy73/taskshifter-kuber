using System.Linq.Expressions;
using TaskShifter.Shared.Results;

namespace TaskShifter.DataLayer.Abstractions.Shared.Action;

public interface IFirstByFilterRepository<TEntity> : IRepository
{
    Task<Result<TEntity>> GetFirstByFilterAsync(
        Expression<Func<TEntity, bool>> predicate,
        string[]? includeOptions = null,
        CancellationToken ct = default);
}
