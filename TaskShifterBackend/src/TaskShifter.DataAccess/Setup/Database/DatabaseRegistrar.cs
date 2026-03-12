using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TaskShifter.DataAccess.Setup.Database.Options;
using TaskShifter.DataLayer.Abstractions;
using TaskShifter.Shared.Extensions;

namespace TaskShifter.DataAccess.Setup.Database;

internal sealed class DatabaseRegistrar : DataAccessRegistrar
{
    public override IServiceCollection Register(IServiceCollection services, IConfiguration configuration)
    {
        services.RegisterOptions<ConnectionStringsOptions>("ConnectionStrings");

        services.AddDbContext<ApplicationDbContext>((serviceProvider, o) =>
        {
            string connectionString = ProcessConnectionString(serviceProvider
                .GetRequiredService<ConnectionStringsOptions>().DefaultConnection);

            o.UseNpgsql(connectionString,
                options => options.EnableRetryOnFailure());
        });

        services.AddTransient<IUnitOfWork, UnitOfWork>();
        services.AddTransient<IStartupFilter, DatabaseConnectionStartupFilter>();

        return services;
    }

    /// <summary>
    /// Replaces placeholders with actual environment variables (for Docker support)
    /// </summary>
    private static string ProcessConnectionString(string connectionString)
    {
        string host = Environment.GetEnvironmentVariable("DB_HOST") ?? string.Empty;
        string dbName = Environment.GetEnvironmentVariable("DB_NAME") ?? string.Empty;
        string username = Environment.GetEnvironmentVariable("DB_USERNAME") ?? string.Empty;
        string password = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? string.Empty;

        return connectionString
            .Replace("{Host}", host)
            .Replace("{DbName}", dbName)
            .Replace("{DbUsername}", username)
            .Replace("{DbPassword}", password);
    }
}
