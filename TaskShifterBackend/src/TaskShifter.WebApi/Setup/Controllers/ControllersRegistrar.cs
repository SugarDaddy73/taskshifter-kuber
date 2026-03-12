using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using TaskShifter.WebApi.Setup.Validation;

namespace TaskShifter.WebApi.Setup.Controllers;

internal sealed class ControllersRegistrar : WebApiRegistrar
{
    public override IServiceCollection Register(IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<ApiBehaviorOptions>(options =>
        {
            options.SuppressModelStateInvalidFilter = true;
        });

        services.AddControllers(options =>
        {
            options.Filters.Add(new ValidationFilter());
            options.Conventions.Add(new RouteTokenTransformerConvention(
                new CamelCaseRouteTransformer()));
        }).AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        });

        return services;
    }

    public override IApplicationBuilder PostConfigure(IApplicationBuilder app)
    {
        ((WebApplication)app).MapControllerRoute("default", "{controller}/{action}/");

        return app;
    }
}
