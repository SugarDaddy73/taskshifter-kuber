using System.Linq.Expressions;
using TaskShifter.BusinessLogic.Models.Comments.Errors;
using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataAccess.Repositories.Abstractions;
using TaskShifter.DataLayer.Abstractions.Repositories;
using TaskShifter.Shared.Extensions;
using TaskShifter.Shared.Results;

namespace TaskShifter.DataAccess.Repositories;

internal sealed class CommentRepository(ApplicationDbContext dbContext) : BaseRepository<CommentEntity>(dbContext), ICommentRepository
{
    public async Task<Result<CommentEntity>> GetFirstByFilterAsync(Expression<Func<CommentEntity, bool>> predicate, string[]? includeOptions = null, CancellationToken ct = default)
    {
        var targetResult = await FindOneAsync(predicate, CommentErrors.NotFound, includeOptions, ct);
        if (targetResult.IsFailure) return targetResult.Error;

        return targetResult.Value;
    }

    public async Task<Result<IEnumerable<CommentEntity>>> GetManyByFilterAsync(Expression<Func<CommentEntity, bool>> predicate, string[]? includeOptions = null, CancellationToken ct = default)
    {
        var targetResult = await FindManyAsync(predicate, includeOptions, ct);
        if (targetResult.IsFailure) return targetResult.Error;

        return targetResult.Value.AsResult();
    }

    public async Task<Result<CommentEntity>> AddAsync(CommentEntity entity, CancellationToken ct = default)
    {
        Result addResult = await AddOneAsync(entity, ct);
        if (addResult.IsFailure) return addResult.Error;

        return entity;
    }

    public async Task<Result> UpdateAsync(CommentEntity entity, CancellationToken ct = default)
    {
        return await UpdateAsync(entity, CommentErrors.NotFound, ct);
    }

    public async Task<Result> DeleteByIdAsync(Guid entityId, CancellationToken ct = default)
    {
        return await DeleteOneByIdAsync(entityId, CommentErrors.NotFound, ct);
    }
}
