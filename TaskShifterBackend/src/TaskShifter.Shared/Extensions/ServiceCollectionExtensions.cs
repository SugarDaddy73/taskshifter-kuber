using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace TaskShifter.Shared.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection RegisterOptions<TOptions>(this IServiceCollection services, string path)
        where TOptions : class
    {
        services
            .AddOptionsWithValidateOnStart<TOptions>()
            .BindConfiguration(path)
            .ValidateDataAnnotations();

        services.AddSingleton<TOptions>(sp => sp.GetRequiredService<IOptions<TOptions>>().Value);

        return services;
    }
}
