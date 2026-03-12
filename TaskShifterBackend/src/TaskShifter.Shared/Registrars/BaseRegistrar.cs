using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace TaskShifter.Shared.Registrars;

public abstract class BaseRegistrar
{
    public virtual IServiceCollection Register(IServiceCollection services, IConfiguration configuration) => services;

    public virtual IApplicationBuilder PostConfigure(IApplicationBuilder app) => app;
}
