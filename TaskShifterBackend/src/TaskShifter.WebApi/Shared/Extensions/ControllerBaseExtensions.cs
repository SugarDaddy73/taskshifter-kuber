using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskShifter.BusinessLogic.Models.Users;

namespace TaskShifter.WebApi.Shared.Extensions;

internal static class ControllerBaseExtensions
{
    /// <summary>
    /// Extension method to get the context of the issuer of the request
    /// Warning: Use ONLY with <see cref="AuthorizeAttribute"/> set on the action/controller
    /// </summary>
    public static IssuerContext GetIssuerContext(this ControllerBase controller)
    {
        return new IssuerContext(controller.GetIssuerId());
    }

    /// <summary>
    /// Extension method to get the id from the issuer of the request
    /// Warning: Use ONLY with <see cref="AuthorizeAttribute"/> set on the action/controller!
    /// </summary>
    public static Guid GetIssuerId(this ControllerBase controller)
    {
        return Guid.Parse(controller.HttpContext.User.Claims.First(c => c.Type == "Id").Value);
    }
}
