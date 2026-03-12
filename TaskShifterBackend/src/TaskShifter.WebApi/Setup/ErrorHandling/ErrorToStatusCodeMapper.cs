
using TaskShifter.Shared.Results;

namespace TaskShifter.WebApi.Setup.ErrorHandling;

public static class ErrorToStatusCodeMapper
{
    private const int DefaultStatusCode = StatusCodes.Status400BadRequest;

    private static readonly Dictionary<string, int> MappedErrors = new()
    {
    };

    public static int Map(Error error)
    {
        return MappedErrors.GetValueOrDefault(error.Code, DefaultStatusCode);
    }
}
