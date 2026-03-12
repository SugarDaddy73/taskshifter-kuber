using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace TaskShifter.BusinessLogic.Setup.Authorization;

public sealed class AuthorizationRegistrar : BusinessLogicRegistrar
{
    public override IServiceCollection Register(IServiceCollection services, IConfiguration configuration)
    {
        return services.AddAuthorization();
    }

    public override IApplicationBuilder PostConfigure(IApplicationBuilder app)
    {
        return app.UseAuthorization();
    }
}
