using System.Linq.Expressions;
using TaskShifter.BusinessLogic.Models.Tasks.Errors;
using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataAccess.Repositories.Abstractions;
using TaskShifter.DataLayer.Abstractions.Repositories;
using TaskShifter.Shared.Extensions;
using TaskShifter.Shared.Results;

namespace TaskShifter.DataAccess.Repositories;

internal sealed class TaskRepository(ApplicationDbContext dbContext) : BaseRepository<TaskEntity>(dbContext), ITaskRepository
{
    public async Task<Result<TaskEntity>> GetFirstByFilterAsync(Expression<Func<TaskEntity, bool>> predicate, string[]? includeOptions = null, CancellationToken ct = default)
    {
        var targetResult = await FindOneAsync(predicate, TaskErrors.NotFound, includeOptions, ct);
        if (targetResult.IsFailure) return targetResult.Error;

        return targetResult.Value;
    }

    public async Task<Result<IEnumerable<TaskEntity>>> GetManyByFilterAsync(Expression<Func<TaskEntity, bool>> predicate, string[]? includeOptions = null, CancellationToken ct = default)
    {
        var targetResult = await FindManyAsync(predicate, includeOptions, ct);
        if (targetResult.IsFailure) return targetResult.Error;

        return targetResult.Value.AsResult();
    }

    public async Task<Result<TaskEntity>> AddAsync(TaskEntity entity, CancellationToken ct = default)
    {
        Result addResult = await AddOneAsync(entity, ct);
        if (addResult.IsFailure) return addResult.Error;

        return entity;
    }

    public async Task<Result> UpdateAsync(TaskEntity entity, CancellationToken ct = default)
    {
        return await UpdateAsync(entity, TaskErrors.NotFound, ct);
    }

    public async Task<Result> DeleteByIdAsync(Guid entityId, CancellationToken ct = default)
    {
        return await DeleteOneByIdAsync(entityId, TaskErrors.NotFound, ct);
    }
}
