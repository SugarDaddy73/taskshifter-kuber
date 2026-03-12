using TaskShifter.Shared.Results;

namespace TaskShifter.WebApi.Shared.Errors;

internal static class ApiErrors
{
    public static class Codes
    {
        public const string ValidationError = "VALIDATION_ERROR";
        public const string NotFound = "NOT_FOUND";
        public const string Unauthorized = "UNAUTHORIZED";
        public const string Forbidden = "FORBIDDEN";
        public const string InternalServerError = "INTERNAL_SERVER_ERROR";
    }

    public static Error ValidationError => new(
        Codes.ValidationError,
        "One or more validation errors occurred");

    public static Error NotFound => new(
        Codes.NotFound,
        "The requested resource was not found");

    public static Error Unauthorized => new(
        Codes.Unauthorized,
        "You are not authorized to access this resource");

    public static Error Forbidden => new(
        Codes.Forbidden,
        "You do not have permission to access this resource");

    public static Error InternalServerError => new(
        Codes.InternalServerError,
        "An internal unhandled error occurred");
}
