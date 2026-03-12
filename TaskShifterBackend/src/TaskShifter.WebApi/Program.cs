using TaskShifter.BusinessLogic.Setup;
using TaskShifter.DataAccess.Setup;
using TaskShifter.WebApi.Setup;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder
    .AddDataAccess()
    .AddBusinessLogic()
    .AddWebApi();

WebApplication app = builder.Build();

// TODO: Refactor this into a middleware
app.Use(async (context, next) =>
{
    if (!context.Response.Headers.ContainsKey("Access-Control-Allow-Origin"))
    {
        context.Response.Headers["Access-Control-Allow-Origin"] = context.Request.Headers["Origin"];
    }

    context.Response.Headers["Access-Control-Allow-Credentials"] = "true";
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
        context.Response.StatusCode = 200;
        return;
    }
    await next();
});

app.UseDataAccess()
   .UseBusinessLogic()
   .UseWebApi();

await app.RunAsync();
