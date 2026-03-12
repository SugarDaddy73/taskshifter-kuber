using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using TaskShifter.DataAccess.Setup.Database;

namespace TaskShifter.DataAccess.Setup;

public static class DependencyInjection
{
    private static readonly IReadOnlyCollection<DataAccessRegistrar> Registrars =
    [
        new DatabaseRegistrar(),
    ];

    public static IHostApplicationBuilder AddDataAccess(this IHostApplicationBuilder builder)
    {
        foreach (DataAccessRegistrar registrar in Registrars)
        {
            registrar.Register(builder.Services, builder.Configuration);
        }

        return builder;
    }

    public static IApplicationBuilder UseDataAccess(this IApplicationBuilder app)
    {
        foreach (DataAccessRegistrar registrar in Registrars)
        {
            app = registrar.PostConfigure(app);
        }

        return app;
    }
}
