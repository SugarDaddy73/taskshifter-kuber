using TaskShifter.BusinessLogic.Models.Users;
using TaskShifter.BusinessLogic.Models.Users.Request;
using TaskShifter.BusinessLogic.Services.Tokens.Models;
using TaskShifter.Shared.Results;

namespace TaskShifter.BusinessLogic.Services.Users.Abstractions;

public interface IUserService
{
    Task<Result<TokenBundle>> LoginAsync(
        RequestToLogin request,
        CancellationToken ct = default);

    Task<Result<TokenBundle>> RegisterAsync(
        RequestToRegisterUser request,
        CancellationToken ct = default);

    Task<Result<UserPublicModel>> GetAccountInfoAsync(
        IssuerContext context,
        CancellationToken ct = default);

    Task<Result<UserPublicModel>> GetAccountInfoAsync(
        IssuerContext context,
        RequestToGetUserInfo request,
        CancellationToken ct = default);

    Task<Result> UpdateProfileAsync(
        IssuerContext context,
        RequestToUpdateProfile request,
        CancellationToken ct = default);

    Task<Result> UpdatePasswordAsync(
        IssuerContext context,
        RequestToUpdatePassword request,
        CancellationToken ct = default);
}
