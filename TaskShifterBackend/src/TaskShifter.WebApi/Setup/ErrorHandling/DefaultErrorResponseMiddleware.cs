using System.Text.Json;
using TaskShifter.Shared.Results;
using TaskShifter.Shared.Serializers;
using TaskShifter.WebApi.Abstractions;
using TaskShifter.WebApi.Shared.Errors;

namespace TaskShifter.WebApi.Setup.ErrorHandling;

internal sealed class DefaultErrorResponseMiddleware(RequestDelegate next)
{
    private static readonly Dictionary<int, Error> _errorMappings = new()
    {
        { StatusCodes.Status401Unauthorized, ApiErrors.Unauthorized },
        { StatusCodes.Status403Forbidden, ApiErrors.Forbidden },
        { StatusCodes.Status404NotFound, ApiErrors.NotFound },
    };

    public async Task InvokeAsync(HttpContext context)
    {
        await next(context);

        if (_errorMappings.TryGetValue(context.Response.StatusCode, out Error? apiError) &&
            !context.Response.HasStarted)
        {
            context.Response.ContentType = "application/json";

            FailureDetails failure = new(
                context.Response.StatusCode,
                apiError.Code,
                apiError.Message
            );

            string json = JsonSerializer.Serialize(failure, JsonSerializerProfile.CamelCaseIgnoreNull);
            await context.Response.WriteAsync(json);
        }
    }
}
