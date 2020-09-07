// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Microsoft.Azure.SignalR.Test.ServerAad
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
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(option =>
                {
                    var tenantId = Environment.GetEnvironmentVariable("tenantId") ?? "";
                    option.Authority = $"https://login.microsoftonline.com/{tenantId}";

                    option.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateAudience = false,
                    };
                });

            services.AddMvc();
            services.AddSignalR()
                .AddAzureSignalR(options =>
                {
                    options.ConnectionCount = 1;
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
                routes.MapHub<ChatAad>("/chat");
            });
        }
    }
}
