using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using TaskShifter.DataAccess.Entities.Entities.Abstractions;
using TaskShifter.DataAccess.Shared.Extensions;
using TaskShifter.Shared.Extensions;
using TaskShifter.Shared.Results;

namespace TaskShifter.DataAccess.Repositories.Abstractions;

internal abstract class BaseRepository<TEntity>(ApplicationDbContext dbContext) where TEntity : class, IEntity, IHasId
{
    protected async Task<Result> AddOneAsync(
        TEntity entity,
        CancellationToken ct = default)
    {
        await dbContext.AddAsync(entity, ct);
        return Result.Success;
    }

    protected async Task<Result<TEntity>> FindOneAsync(
        Expression<Func<TEntity, bool>> predicate,
        Error notFoundError,
        string[]? includeOptions = null,
        CancellationToken ct = default)
    {
        TEntity? entity = await dbContext
            .Set<TEntity>()
            .AsSplitQuery()
            .ApplyIncludes(includeOptions)
            .FirstOrDefaultAsync(predicate, ct);

        return entity.AsResultOrNull() ?? notFoundError;
    }

    protected async Task<Result<IEnumerable<TEntity>>> FindManyAsync(
        Expression<Func<TEntity, bool>> predicate,
        string[]? includeOptions = null,
        CancellationToken ct = default)
    {
        return await dbContext
            .Set<TEntity>()
            .AsSplitQuery()
            .Where(predicate)
            .ApplyIncludes(includeOptions)
            .ToListAsync(ct);
    }

    protected async Task<Result> UpdateAsync(
        TEntity entity,
        Error notFoundError,
        CancellationToken ct = default)
    {
        TEntity? originalEntity = await dbContext
            .Set<TEntity>()
            .FirstOrDefaultAsync(e => e.Id == entity.Id, ct);

        if (originalEntity is null)
        {
            return notFoundError;
        }

        dbContext.Entry(originalEntity).State = EntityState.Detached;
        dbContext.Entry(entity).State = EntityState.Modified;

        return Result.Success;
    }

    protected async Task<Result> DeleteOneByIdAsync(
        Guid id,
        Error notFoundError,
        CancellationToken ct = default)
    {
        TEntity? originalEntity = await dbContext
            .Set<TEntity>()
            .FirstOrDefaultAsync(e => e.Id == id, ct);

        if (originalEntity is null)
        {
            return notFoundError;
        }

        dbContext.Remove(originalEntity);
        return Result.Success;
    }
}
