using System.Linq.Expressions;
using TaskShifter.BusinessLogic.Models.Columns.Errors;
using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataAccess.Repositories.Abstractions;
using TaskShifter.DataLayer.Abstractions.Repositories;
using TaskShifter.Shared.Extensions;
using TaskShifter.Shared.Results;

namespace TaskShifter.DataAccess.Repositories;

internal sealed class ColumnRepository(ApplicationDbContext dbContext) : BaseRepository<ColumnEntity>(dbContext), IColumnRepository
{
    public async Task<Result<ColumnEntity>> GetFirstByFilterAsync(Expression<Func<ColumnEntity, bool>> predicate, string[]? includeOptions = null, CancellationToken ct = default)
    {
        var targetResult = await FindOneAsync(predicate, ColumnErrors.NotFound, includeOptions, ct);
        if (targetResult.IsFailure) return targetResult.Error;

        return targetResult.Value;
    }

    public async  Task<Result<IEnumerable<ColumnEntity>>> GetManyByFilterAsync(Expression<Func<ColumnEntity, bool>> predicate, string[]? includeOptions = null, CancellationToken ct = default)
    {
        var targetResult = await FindManyAsync(predicate, includeOptions, ct);
        if (targetResult.IsFailure) return targetResult.Error;

        return targetResult.Value.AsResult();
    }

    public async Task<Result<ColumnEntity>> AddAsync(ColumnEntity entity, CancellationToken ct = default)
    {
        Result addResult = await AddOneAsync(entity, ct);
        if (addResult.IsFailure) return addResult.Error;

        return entity;
    }

    public async Task<Result> UpdateAsync(ColumnEntity entity, CancellationToken ct = default)
    {
        return await UpdateAsync(entity, ColumnErrors.NotFound, ct);
    }

    public async Task<Result> DeleteByIdAsync(Guid entityId, CancellationToken ct = default)
    {
        return await DeleteOneByIdAsync(entityId, ColumnErrors.NotFound, ct);
    }
}
