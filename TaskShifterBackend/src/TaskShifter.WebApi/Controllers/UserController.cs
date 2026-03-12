using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskShifter.BusinessLogic.Models.Users;
using TaskShifter.BusinessLogic.Models.Users.Request;
using TaskShifter.BusinessLogic.Services.Users.Abstractions;
using TaskShifter.WebApi.Shared.Extensions;

namespace TaskShifter.WebApi.Controllers;

[ApiController]
[Authorize]
[Route("users")]
public sealed class UserController(IUserService userService) : ControllerBase
{
    /// <summary>
    /// Gets the profile of the currently authenticated user.
    /// </summary>
    [HttpGet("profile")]
    public async Task<ActionResult<UserPublicModel>> GetAccountInfo(CancellationToken ct)
    {
        UserPublicModel userProfile = await userService
            .GetAccountInfoAsync(this.GetIssuerContext(), ct)
            .UnwrapOrThrow();

        return Ok(userProfile);
    }

    /// <summary>
    /// Gets the profile of a user by their ID.
    /// </summary>
    [HttpGet("profile/{id:guid}")]
    public async Task<ActionResult<UserPublicModel>> GetAccountInfo(Guid id, CancellationToken ct)
    {
        UserPublicModel userProfile = await userService
            .GetAccountInfoAsync(this.GetIssuerContext(), new RequestToGetUserInfo(id), ct)
            .UnwrapOrThrow();

        return Ok(userProfile);
    }

    /// <summary>
    /// Updates the profile of the currently authenticated user.
    /// </summary>
    [HttpPut("profile")]
    public async Task<ActionResult> UpdateProfile(RequestToUpdateProfile request, CancellationToken ct)
    {
        (await userService.UpdateProfileAsync(this.GetIssuerContext(), request, ct)).UnwrapOrThrow();

        return Ok();
    }

    /// <summary>
    /// Updates the password of the currently authenticated user.
    /// </summary>
    [HttpPut("password")]
    public async Task<ActionResult> UpdatePassword(RequestToUpdatePassword request, CancellationToken ct)
    {
        (await userService.UpdatePasswordAsync(this.GetIssuerContext(), request, ct)).UnwrapOrThrow();

        return Ok();
    }
}
