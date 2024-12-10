// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System;
using System.Security.Claims;

using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Microsoft.Azure.SignalR.Test.Server;

public class Startup(IConfiguration configuration)
{
    public IConfiguration Configuration { get; } = configuration;

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddAuthorizationBuilder()
            .AddPolicy("ClaimBasedAuth", policy =>
            {
                policy.RequireClaim(ClaimTypes.NameIdentifier);
            })
            .AddPolicy("PolicyBasedAuth", policy => policy.Requirements.Add(new PolicyBasedAuthRequirement()));

        services.AddSingleton<IAuthorizationHandler, PolicyBasedAuthHandler>();

        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie();

        var serverAad = Environment.GetEnvironmentVariable("SERVER_AAD");

        if (!string.IsNullOrEmpty(serverAad))
        {
            services.AddAuthentication()
            .AddJwtBearer(option =>
            {
                var tenantId = Environment.GetEnvironmentVariable("tenantId") ?? throw new ArgumentNullException();
                option.Authority = $"https://login.microsoftonline.com/{tenantId}";

                option.TokenValidationParameters = new TokenValidationParameters();
            });
        }
        else
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(option =>
            {
                option.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = JwtController.Issuer,
                    ValidAudience = JwtController.Audience,
                    IssuerSigningKey = JwtController.SigningCreds.Key
                };
            });
        }

        services.AddMvc();
        services.AddSignalR()
            .AddAzureSignalR(options =>
            {
                options.InitialHubServerConnectionCount = 2;

                options.ClaimsProvider = context =>
                {
                    if (context.Request.Query["username"].Count != 0)
                    {
                        return
                        [
                            new Claim(ClaimTypes.NameIdentifier, context.Request.Query["username"])
                        ];
                    }

                    return [];
                };
            });
        services.AddCors();
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseAuthentication();
        app.UseMvc();
        app.UseCors(builder =>
            builder.WithOrigins("http://localhost")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());
        app.UseFileServer();
        app.UseEndpoints(routes =>
        {
            routes.MapHub<Chat>("/chat");
            routes.MapHub<ChatJwt>("/chatjwt");
            routes.MapHub<ChatCookie>("/chatcookie");
            routes.MapHub<GenericChat<IChat>>("/genericchat");
            routes.MapHub<LongNameChatLongNameChatLongNameChatLongNameChatLongNameChatLongNameChatLongNameChatLongNameChatLongNameChatLongNameChatLongName>("/longnamechat");
        });
    }
}
