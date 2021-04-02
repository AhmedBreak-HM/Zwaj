using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ZwajApp.API.Data;

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


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // app.UseHsts();
            }

            // app.UseHttpsRedirection();
            // add Corss MidllWare 
            app.UseCors( x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            // add Corss MidllWare

            app.UseMvc();
        }
    }
}
