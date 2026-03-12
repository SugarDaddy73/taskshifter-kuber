using TaskShifter.BusinessLogic.Models.Users;
using TaskShifter.BusinessLogic.Services.Tokens.Models;

namespace TaskShifter.BusinessLogic.Services.Tokens.Abstractions;

public interface ITokenService
{
    TokenBundle GenerateAccessToken(UserDetailedModel user);
}
