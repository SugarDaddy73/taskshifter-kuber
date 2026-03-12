using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using TaskShifter.BusinessLogic.Options;
using TaskShifter.BusinessLogic.Services.Tokens;
using TaskShifter.BusinessLogic.Services.Tokens.Abstractions;
using TaskShifter.Shared.Extensions;

namespace TaskShifter.BusinessLogic.Setup.Authentication;

internal sealed class AuthenticationRegistrar : BusinessLogicRegistrar
{
    public override IServiceCollection Register(IServiceCollection services, IConfiguration configuration)
    {
        ConfigureTokenAuthentication(services, configuration);

        return services;
    }

    public override IApplicationBuilder PostConfigure(IApplicationBuilder app)
    {
        return app.UseAuthentication();
    }

    private static void ConfigureTokenAuthentication(IServiceCollection services, IConfiguration configuration)
    {
        services.RegisterOptions<TokenOptions>("Authentication:Tokens");
        TokenOptions tokenOptions = configuration.GetOptions<TokenOptions>("Authentication:Tokens");

        services.AddTransient<ITokenService, TokenService>();
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = false,
                    ValidateAudience = false,

                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenOptions.AccessTokenSigningKey)),
                };
            });
    }
}
