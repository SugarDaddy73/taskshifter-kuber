using TaskShifter.WebApi.Setup.Controllers;
using TaskShifter.WebApi.Setup.Cors;
using TaskShifter.WebApi.Setup.ErrorHandling;
using TaskShifter.WebApi.Setup.Swagger;

namespace TaskShifter.WebApi.Setup;

public static class DependencyInjection
{
    private static readonly IReadOnlyCollection<WebApiRegistrar> Registrars =
    [
        new ControllersRegistrar(),
        new CorsRegistrar(),
        new SwaggerRegistrar(),
        new ErrorHandlingRegistrar(),
    ];

    public static IHostApplicationBuilder AddWebApi(this IHostApplicationBuilder builder)
    {
        foreach (WebApiRegistrar registrar in Registrars)
        {
            registrar.Register(builder.Services, builder.Configuration);
        }

        return builder;
    }

    public static IApplicationBuilder UseWebApi(this IApplicationBuilder app)
    {
        foreach (WebApiRegistrar registrar in Registrars)
        {
            app = registrar.PostConfigure(app);
        }

        return app;
    }
}
