using TaskShifter.Shared.Results;

namespace TaskShifter.BusinessLogic.Models.Users.Errors;

public static class UserErrors
{
    public static class Codes
    {
        public const string UserNotFound = "USER_NOT_FOUND";
        public const string UserAlreadyExists = "USER_ALREADY_EXISTS";
        public const string InvalidCredentials = "INVALID_CREDENTIALS";
        public const string InvalidCurrentPassword = "INVALID_CURRENT_PASSWORD";
    }

    public static Error NotFound => new(
        Codes.UserNotFound,
        "User has not been found");

    public static Error UserAlreadyExists => new(
        Codes.UserAlreadyExists,
        "The user with provided credentials already exists");

    public static Error InvalidCredentials => new(
        Codes.InvalidCredentials,
        "The provided credentials are invalid");

    public static Error InvalidCurrentPassword => new(
        Codes.InvalidCurrentPassword,
        "The provided current password is invalid");
}
