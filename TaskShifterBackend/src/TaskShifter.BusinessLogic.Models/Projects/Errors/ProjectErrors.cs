using TaskShifter.Shared.Results;

namespace TaskShifter.BusinessLogic.Models.Projects.Errors;

public static class ProjectErrors
{
    public static class Codes
    {
        public const string ProjectNotFound = "PROJECT_NOT_FOUND";
        public const string NotEnoughPermissions = "NOT_ENOUGH_PERMISSIONS";
        public const string UserAlreadyMember = "USER_ALREADY_MEMBER";
        public const string UserNotMember = "USER_NOT_MEMBER";
        public const string CannotAssignOwnerRole = "CANNOT_ASSIGN_OWNER_ROLE";
        public const string CannotRemoveSelf = "CANNOT_REMOVE_SELF";
        public const string OwnerCannotLeave = "OWNER_CANNOT_LEAVE";
    }

    public static Error NotFound => new(
        Codes.ProjectNotFound,
        "Project has not been found");

    public static Error NotEnoughPermissions => new(
        Codes.NotEnoughPermissions,
        "You do not have enough permissions to perform this action");

    public static Error UserAlreadyMember => new(
        Codes.UserAlreadyMember,
        "User is already a member of this project");

    public static Error UserNotMember => new(
        Codes.UserNotMember,
        "User is not a member of this project");

    public static Error CannotAssignOwnerRole => new(
        Codes.CannotAssignOwnerRole,
        "Cannot assign owner role to a project member");

    public static Error CannotRemoveSelf => new(
        Codes.CannotRemoveSelf,
        "You cannot remove yourself from the project");

    public static Error OwnerCannotLeave => new(
        Codes.OwnerCannotLeave,
        "Project owner cannot leave the project");
}
