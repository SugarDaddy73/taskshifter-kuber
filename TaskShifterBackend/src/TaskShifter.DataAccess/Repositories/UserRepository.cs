using System.Linq.Expressions;
using TaskShifter.BusinessLogic.Models.Users.Errors;
using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataAccess.Repositories.Abstractions;
using TaskShifter.DataLayer.Abstractions.Repositories;
using TaskShifter.Shared.Results;

namespace TaskShifter.DataAccess.Repositories;

internal sealed class UserRepository(ApplicationDbContext dbContext) : BaseRepository<UserEntity>(dbContext), IUserRepository
{
    public async Task<Result<UserEntity>> GetFirstByFilterAsync(Expression<Func<UserEntity, bool>> predicate, string[]? includeOptions = null, CancellationToken ct = default)
    {
        var targetResult = await FindOneAsync(predicate, UserErrors.NotFound, includeOptions, ct);
        if (targetResult.IsFailure) return targetResult.Error;

        return targetResult.Value;
    }

    public async Task<Result<UserEntity>> AddAsync(UserEntity entity, CancellationToken ct = default)
    {
        Result addResult = await AddOneAsync(entity, ct);
        if (addResult.IsFailure) return addResult.Error;

        return entity;
    }

    public async Task<Result> UpdateAsync(UserEntity entity, CancellationToken ct = default)
    {
        return await UpdateAsync(entity, UserErrors.NotFound, ct);
    }
}
