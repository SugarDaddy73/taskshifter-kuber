namespace TaskShifter.WebApi.Setup.Controllers;

public class CamelCaseRouteTransformer : IOutboundParameterTransformer
{
    public string? TransformOutbound(object? value)
    {
        if (value == null) return null;

        string input = value.ToString()!;
        if (string.IsNullOrEmpty(input)) return input;

        return char.ToLowerInvariant(input[0]) + input.Substring(1);
    }
}
