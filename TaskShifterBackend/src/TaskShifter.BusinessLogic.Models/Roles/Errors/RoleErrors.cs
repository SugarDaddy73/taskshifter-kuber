using TaskShifter.Shared.Results;

namespace TaskShifter.BusinessLogic.Models.Roles.Errors;

public static class RoleErrors
{
    public static class Codes
    {
        public const string UserNotFound = "ROLE_NOT_FOUND";
    }

    public static Error NotFound => new(
        Codes.UserNotFound,
        "Role has not been found");
}
