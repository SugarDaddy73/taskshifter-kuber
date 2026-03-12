using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using TaskShifter.WebApi.Abstractions;
using TaskShifter.WebApi.Shared.Errors;

namespace TaskShifter.WebApi.Setup.Validation;

internal sealed class ValidationFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            Dictionary<string, string?[]> errors = context.ModelState
                .Where(e => e.Value?.Errors.Count > 0)
                .GroupBy(e => e.Key)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(x => x.Value?
                        .Errors.First().ErrorMessage).ToArray()
                );

            FailureDetails failure = new(
                StatusCodes.Status400BadRequest,
                ApiErrors.ValidationError.Code,
                ApiErrors.ValidationError.Message,
                errors!
            );

            context.Result = new JsonResult(failure)
            {
                StatusCode = StatusCodes.Status400BadRequest,
            };
        }
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }
}
