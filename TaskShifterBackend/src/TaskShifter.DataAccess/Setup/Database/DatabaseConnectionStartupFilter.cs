using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace TaskShifter.DataAccess.Setup.Database;

/// <summary>
/// Startup filter for testing database connectivity in the application
/// </summary>
internal class DatabaseConnectionStartupFilter : IStartupFilter
{
    public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
    {
        return app =>
        {
            using (IServiceScope scope = app.ApplicationServices.CreateScope())
            {
                ApplicationDbContext dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                if (!dbContext.Database.CanConnect())
                {
                    throw new InvalidOperationException(
                        "Database connection could not be established. " +
                        "Please check your connection string and database availability.");
                }

                dbContext.Database.Migrate();
            }

            next(app);
        };
    }
}
