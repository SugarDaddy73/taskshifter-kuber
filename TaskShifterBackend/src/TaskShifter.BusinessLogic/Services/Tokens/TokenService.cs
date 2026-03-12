using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TaskShifter.BusinessLogic.Models.Users;
using TaskShifter.BusinessLogic.Options;
using TaskShifter.BusinessLogic.Services.Tokens.Abstractions;
using TaskShifter.BusinessLogic.Services.Tokens.Models;

namespace TaskShifter.BusinessLogic.Services.Tokens;

internal sealed class TokenService(TokenOptions tokenOptions) : ITokenService
{
    public TokenBundle GenerateAccessToken(UserDetailedModel user)
    {
        List<Claim> claims =
        [
            new("Id", user.Id.ToString()),
            new("Username", user.Username),
            new("Email", user.Email),
        ];

        return IssueAccessToken(claims);
    }

    private TokenBundle IssueAccessToken(IEnumerable<Claim> claims)
    {
        SymmetricSecurityKey signingKey = new(Encoding.UTF8.GetBytes(tokenOptions.AccessTokenSigningKey));

        JwtSecurityToken token = new(
            claims: claims,
            expires: DateTime.UtcNow.AddSeconds(tokenOptions.AccessTokenExpiryInSeconds),
            signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256));

        string accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        return new TokenBundle(
            accessToken,
            tokenOptions.AccessTokenExpiryInSeconds
        );
    }
}
