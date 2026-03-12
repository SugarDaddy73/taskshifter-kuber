using Microsoft.AspNetCore.Diagnostics;
using TaskShifter.Shared.Serializers;
using TaskShifter.WebApi.Abstractions;
using TaskShifter.WebApi.Shared.Errors;
using TaskShifter.WebApi.Shared.Exceptions;

namespace TaskShifter.WebApi.Setup.ErrorHandling;

internal sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken ct)
    {
        FailureDetails failureDetails = GetFailureDetails(exception);

        if (failureDetails.StatusCode == StatusCodes.Status500InternalServerError)
        {
            logger.LogError(exception, "An unhandled exception occurred: {Message}", exception.Message);
        }

        httpContext.Response.StatusCode = failureDetails.StatusCode;
        await httpContext.Response.WriteAsJsonAsync(
            failureDetails,
            JsonSerializerProfile.CamelCaseIgnoreNull, ct);

        return true;
    }

    private static FailureDetails GetFailureDetails(Exception exception)
    {
        return exception switch
        {
            FailedResultException failedResultException =>
                new FailureDetails(
                    ErrorToStatusCodeMapper.Map(failedResultException.Error),
                    failedResultException.Error.Code,
                    failedResultException.Error.Message),

            _ =>
                new FailureDetails(
                    StatusCodes.Status500InternalServerError,
                    ApiErrors.InternalServerError.Code,
                    ApiErrors.InternalServerError.Message),
        };
    }
}
