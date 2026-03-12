using System.Linq.Expressions;
using TaskShifter.BusinessLogic.Models.Projects.Errors;
using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataAccess.Repositories.Abstractions;
using TaskShifter.DataLayer.Abstractions.Repositories;
using TaskShifter.Shared.Extensions;
using TaskShifter.Shared.Results;

namespace TaskShifter.DataAccess.Repositories;

internal sealed class ProjectRepository(ApplicationDbContext dbContext): BaseRepository<ProjectEntity>(dbContext), IProjectRepository
{
    public async Task<Result<ProjectEntity>> GetFirstByFilterAsync(Expression<Func<ProjectEntity, bool>> predicate, string[]? includeOptions = null, CancellationToken ct = default)
    {
        var targetResult = await FindOneAsync(predicate, ProjectErrors.NotFound, includeOptions, ct);
        if (targetResult.IsFailure) return targetResult.Error;

        return targetResult.Value;
    }

    public async Task<Result<IEnumerable<ProjectEntity>>> GetManyByFilterAsync(Expression<Func<ProjectEntity, bool>> predicate, string[]? includeOptions = null, CancellationToken ct = default)
    {
        var targetResult = await FindManyAsync(predicate, includeOptions, ct);
        if (targetResult.IsFailure) return targetResult.Error;

        return targetResult.Value.AsResult();
    }

    public async Task<Result<ProjectEntity>> AddAsync(ProjectEntity entity, CancellationToken ct = default)
    {
        ProjectEntity entityToAdd = entity;

        Result addResult = await AddOneAsync(entityToAdd, ct);
        if (addResult.IsFailure) return addResult.Error;

        return entityToAdd;
    }

    public async Task<Result> UpdateAsync(ProjectEntity entity, CancellationToken ct = default)
    {
        ProjectEntity entityToUpdate = entity;

        return await UpdateAsync(entityToUpdate, ProjectErrors.NotFound, ct);
    }

    public async Task<Result> DeleteByIdAsync(Guid entityId, CancellationToken ct = default)
    {
        return await DeleteOneByIdAsync(entityId, ProjectErrors.NotFound, ct);
    }
}
