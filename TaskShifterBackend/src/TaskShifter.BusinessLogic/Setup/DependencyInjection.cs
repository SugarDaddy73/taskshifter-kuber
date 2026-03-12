using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using TaskShifter.BusinessLogic.Setup.Authentication;
using TaskShifter.BusinessLogic.Setup.Authorization;
using TaskShifter.BusinessLogic.Setup.Services;

namespace TaskShifter.BusinessLogic.Setup;

public static class DependencyInjection
{
    private static readonly IReadOnlyCollection<BusinessLogicRegistrar> Registrars =
    [
        new AuthenticationRegistrar(),
        new AuthorizationRegistrar(),
        new ServicesRegistrar(),
    ];

    public static IHostApplicationBuilder AddBusinessLogic(this IHostApplicationBuilder builder)
    {
        foreach (BusinessLogicRegistrar registrar in Registrars)
        {
            registrar.Register(builder.Services, builder.Configuration);
        }

        return builder;
    }

    public static IApplicationBuilder UseBusinessLogic(this IApplicationBuilder app)
    {
        foreach (BusinessLogicRegistrar registrar in Registrars)
        {
            app = registrar.PostConfigure(app);
        }

        return app;
    }
}
