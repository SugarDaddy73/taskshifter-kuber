using Microsoft.Extensions.Configuration;

namespace TaskShifter.Shared.Extensions;

public static class ConfigurationExtensions
{
    public static TOptions GetOptions<TOptions>(this IConfiguration configuration, string path)
        where TOptions : class
    {
        TOptions? options = configuration.GetSection(path).Get<TOptions>();
        if (options is null)
        {
            throw new InvalidOperationException($"Configuration section '{path}' is not found or cannot be mapped to {typeof(TOptions).Name}");
        }

        return options;
    }
}
