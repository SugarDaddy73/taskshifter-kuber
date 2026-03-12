using TaskShifter.BusinessLogic.Models.Users;
using TaskShifter.BusinessLogic.Models.Users.Errors;
using TaskShifter.BusinessLogic.Models.Users.Request;
using TaskShifter.BusinessLogic.Services.Tokens.Abstractions;
using TaskShifter.BusinessLogic.Services.Tokens.Models;
using TaskShifter.BusinessLogic.Services.Users.Abstractions;
using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataLayer.Abstractions;
using TaskShifter.Shared.Extensions;
using TaskShifter.Shared.Results;

namespace TaskShifter.BusinessLogic.Services.Users;

public sealed class UserService(IUnitOfWork unitOfWork, ITokenService tokenService) : IUserService
{
    /// <summary>
    /// Authenticates a user and returns an access token.
    /// </summary>
    public async Task<Result<TokenBundle>> LoginAsync(RequestToLogin request, CancellationToken ct = default)
    {
        Result<UserEntity> userResult = await unitOfWork
            .UserRepository
            .GetFirstByFilterAsync(u => u.Email == request.Email, ct: ct);

        if (userResult.IsFailure)
        {
            return UserErrors.InvalidCredentials;
        }

        UserDetailedModel user = UserDetailedModel.From(userResult.Value);
        if (user.PasswordHash != request.Password.ToSha256())
        {
            return UserErrors.InvalidCredentials;
        }

        return tokenService.GenerateAccessToken(user);
    }

    /// <summary>
    /// Registers a user and returns an access token.
    /// </summary>
    public async Task<Result<TokenBundle>> RegisterAsync(RequestToRegisterUser request, CancellationToken ct = default)
    {
        Result<UserEntity> existingUser = await unitOfWork
            .UserRepository
            .GetFirstByFilterAsync(u => u.Email == request.Email || u.Username == request.Username, ct: ct);

        if (existingUser.IsSuccess)
        {
            return UserErrors.UserAlreadyExists;
        }

        UserDetailedModel newUser = new(
            Guid.NewGuid(),
            request.Email,
            request.Username,
            request.FullName,
            request.Password.ToSha256(),
            []);

        Result<UserEntity> addUserResult = await unitOfWork.UserRepository.AddAsync(newUser.ToEntity(), ct);
        if (addUserResult.IsFailure) return addUserResult.Error;

        await unitOfWork.SaveChangesAsync(ct);

        return tokenService.GenerateAccessToken(UserDetailedModel.From(addUserResult.Value));
    }

    /// <summary>
    /// Retrieves public account information for a user.
    /// </summary>
    public async Task<Result<UserPublicModel>> GetAccountInfoAsync(IssuerContext context, CancellationToken ct = default)
    {
        Result<UserEntity> userResult = await unitOfWork
            .UserRepository
            .GetFirstByFilterAsync(u => u.Id == context.IssuerId, ct: ct);

        if (userResult.IsFailure) return userResult.Error;

        return UserPublicModel.From(userResult.Value);
    }

    /// <summary>
    /// Retrieves public account information for a user based on a request.
    /// </summary>
    public async Task<Result<UserPublicModel>> GetAccountInfoAsync(IssuerContext context, RequestToGetUserInfo request, CancellationToken ct = default)
    {
        Result<UserEntity> userResult = await unitOfWork
            .UserRepository
            .GetFirstByFilterAsync(u => u.Id == request.UserId, ct: ct);

        if (userResult.IsFailure) return userResult.Error;

        return UserPublicModel.From(userResult.Value);
    }

    /// <summary>
    /// Updates a user's profile information.
    /// </summary>
    public async Task<Result> UpdateProfileAsync(IssuerContext context, RequestToUpdateProfile request, CancellationToken ct = default)
    {
        Result<UserEntity> userResult = await unitOfWork
            .UserRepository
            .GetFirstByFilterAsync(u => u.Id == context.IssuerId, ct: ct);

        if (userResult.IsFailure) return userResult.Error;

        UserEntity user = userResult.Value;

        user.FullName = request.FullName;
        user.Username = request.Username;
        user.Email = request.Email;

        Result updateResult = await unitOfWork.UserRepository.UpdateAsync(user, ct);
        if (updateResult.IsFailure) return updateResult.Error;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }

    /// <summary>
    /// Updates a user's password.
    /// </summary>
    public async Task<Result> UpdatePasswordAsync(IssuerContext context, RequestToUpdatePassword request, CancellationToken ct = default)
    {
        Result<UserEntity> userResult = await unitOfWork
            .UserRepository
            .GetFirstByFilterAsync(u => u.Id == context.IssuerId, ct: ct);

        if (userResult.IsFailure) return userResult.Error;

        UserEntity user = userResult.Value;

        if (user.PasswordHash != request.CurrentPassword.ToSha256())
        {
            return UserErrors.InvalidCurrentPassword;
        }

        user.PasswordHash = request.NewPassword.ToSha256();

        Result updateResult = await unitOfWork.UserRepository.UpdateAsync(user, ct);
        if (updateResult.IsFailure) return updateResult.Error;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }
}
