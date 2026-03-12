namespace TaskShifter.WebApi.Abstractions;

internal sealed record FailureDetails(
    int StatusCode,
    string Code,
    string Message,
    IDictionary<string, string[]>? Errors = null);
