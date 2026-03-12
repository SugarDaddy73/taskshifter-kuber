namespace TaskShifter.WebApi.Setup.ErrorHandling;

internal sealed class ErrorHandlingRegistrar : WebApiRegistrar
{
    public override IServiceCollection Register(IServiceCollection services, IConfiguration configuration)
    {
        return services
            .AddProblemDetails()
            .AddExceptionHandler<GlobalExceptionHandler>();
    }

    public override IApplicationBuilder PostConfigure(IApplicationBuilder app)
    {
        app.UseExceptionHandler()
           .UseMiddleware<DefaultErrorResponseMiddleware>();

        return app;
    }
}
