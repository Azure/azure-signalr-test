// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Microsoft.Azure.SignalR.Test.Server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthorization(option =>
            {
                option.AddPolicy("ClaimBasedAuth", policy =>
                {
                    policy.RequireClaim(ClaimTypes.NameIdentifier);
                });
                option.AddPolicy("PolicyBasedAuth", policy => policy.Requirements.Add(new PolicyBasedAuthRequirement()));
            });

            services.AddSingleton<IAuthorizationHandler, PolicyBasedAuthHandler>();

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie();

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

            services.AddMvc();
            services.AddSignalR()
                .AddAzureSignalR(options =>
                {
                    options.ClaimsProvider = context =>
                    {
                        if (context.Request.Query["username"].Count != 0)
                        {
                            return new[]
                            {
                                new Claim(ClaimTypes.NameIdentifier, context.Request.Query["username"])
                            };
                        }

                        return new Claim[] { };
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
            app.UseAzureSignalR(routes =>
            {
                routes.MapHub<Chat>("/chat");
                routes.MapHub<ChatJwt>("/chatjwt");
                routes.MapHub<ChatCookie>("/chatcookie");
                routes.MapHub<GenericChat<IChat>>("/genericchat");
                routes.MapHub<LongNameChatLongNameChatLongNameChatLongNameChatLongNameChatLongNameChatLongNameChatLongNameChatLongNameChatLongNameChatLongName>("/longnamechat");
            });
        }
    }
}
