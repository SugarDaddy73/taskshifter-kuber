namespace TaskShifter.WebApi.Setup.Cors;

internal sealed class CorsRegistrar : WebApiRegistrar
{
    public override IServiceCollection Register(IServiceCollection services, IConfiguration configuration)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAllPolicy",
                builder =>
                {
                    builder
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .SetIsOriginAllowed(_ => true)
                        .AllowCredentials();
                });
        });

        return services;
    }

    public override IApplicationBuilder PostConfigure(IApplicationBuilder app)
    {
        app.UseCors("AllowAllPolicy");

        return app;
    }
}
