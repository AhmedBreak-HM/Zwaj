using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ZwajApp.API.Data;
using ZwajApp.API.Helper;

namespace ZwajApp.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // add data context

            services.AddDbContext<DataContext>(option => option.UseSqlite(Configuration.GetConnectionString("SqliteCon")));

            // add data context

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // add Corss services
            services.AddCors();
            // add Corss services

            // add Auto Mapper
            services.AddAutoMapper();

            // add Auth Repo to Genreate new  instance
            services.AddScoped<IAuthRepository, AuthRepository>();
            // add Auth Repo to Genreate new  instance

            // Add Trial Data service
            services.AddTransient<TrialData>();

            // Add Zwaj Repo
            services.AddScoped<IZwajRepository, ZwajRepository>();
            // add bind between Class CloudinarySettings and Settings Section CloudinarySettings
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));

            // Add Action Filter Services LogUseActivity To save laste Active
            services.AddScoped<LogUseActivity>();

            // Add SignalR Services
            services.AddSignalR();

            // add Authentication services
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(option =>
            {
                option.TokenValidationParameters = new TokenValidationParameters
                {
                    // matching between servier and clint key
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });





        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, TrialData trialData)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // Add Golable ExceptionHandler in Prodaction mode
                app.UseExceptionHandler(BuilderExtensions => BuilderExtensions.Run(async context =>
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    var error = context.Features.Get<IExceptionHandlerFeature>();
                    if (error != null)
                    {
                        context.Response.AddApplicationError(error.Error.Message);
                        await context.Response.WriteAsync(error.Error.Message);
                        await context.Response.WriteAsync(error.Error.StackTrace);

                    }

                })
                );


                // app.UseHsts();
            }

            // app.UseHttpsRedirection();
            // trialData.TrialUsers();
            // add Corss MidllWare 
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader().AllowCredentials());
            // add Corss MidllWare

            // Add SignalR Mdillware
            app.UseSignalR(routes => {
                routes.MapHub<ChatHub>("/chat");
            });

            // add authentication Midllware
            app.UseAuthentication();

            app.UseMvc();
        }
    }
}
