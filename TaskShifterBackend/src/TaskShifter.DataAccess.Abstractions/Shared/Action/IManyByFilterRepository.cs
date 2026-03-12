using System.Linq.Expressions;
using TaskShifter.Shared.Results;

namespace TaskShifter.DataLayer.Abstractions.Shared.Action;

public interface IManyByFilterRepository<TEntity> : IRepository
{
    Task<Result<IEnumerable<TEntity>>> GetManyByFilterAsync(
        Expression<Func<TEntity, bool>> predicate,
        string[]? includeOptions = null,
        CancellationToken ct = default);
}
