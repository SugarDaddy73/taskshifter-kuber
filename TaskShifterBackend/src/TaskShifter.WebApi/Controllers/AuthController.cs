using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskShifter.BusinessLogic.Models.Users.Request;
using TaskShifter.BusinessLogic.Services.Tokens.Models;
using TaskShifter.BusinessLogic.Services.Users.Abstractions;
using TaskShifter.WebApi.Shared.Extensions;

namespace TaskShifter.WebApi.Controllers;

[ApiController]
[AllowAnonymous]
[Route("[controller]/[action]")]
public sealed class AuthController(IUserService userService) : ControllerBase
{
    /// <summary>
    /// Authenticates a user and returns an access token (JWT).
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TokenBundle>> Login(RequestToLogin request, CancellationToken ct)
    {
        TokenBundle tokenBundle = await userService
            .LoginAsync(request, ct)
            .UnwrapOrThrow();

        return Ok(tokenBundle);
    }

    /// <summary>
    /// Registers a user and returns an access token (JWT).
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TokenBundle>> Register(RequestToRegisterUser request, CancellationToken ct)
    {
        TokenBundle tokenBundle = await userService
            .RegisterAsync(request, ct)
            .UnwrapOrThrow();

        return Ok(tokenBundle);
    }
}
