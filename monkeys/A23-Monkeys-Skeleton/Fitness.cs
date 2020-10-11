namespace Fitness {
    using Carter;
    using Microsoft.AspNetCore.Http;
    using Carter.ModelBinding;
    using Carter.Request;
    using Carter.Response;
    using System.Linq;
    using System.Collections.Generic;
    using System;
    using static System.Console;
    
    public class HomeModule : CarterModule {
        static bool parallel = false;
        static string target = "";
    
        public HomeModule () {
            Post ("/target", async (req, res) => {
                var t = await req.Bind<Target> ();
                parallel = t.parallel;
                target = t.target;
                WriteLine ($"..... POST /target {parallel} {target}");
                return;
            });
            
            Post ("/assess", async (req, res) => {
                var genomes = await req.Bind<List<string>> ();
                WriteLine ($"..... POST /assess count={genomes.Count}");
                
                var scores = genomes .Select ( g => {
                    var len = Math.Min (target.Length, g.Length);
                    var h = Enumerable .Range (0, len)  
                        .Sum (i => Convert.ToInt32 (target[i] != g[i]));
                    h = h + Math.Max (target.Length, g.Length) - len;
                    return h;
                }) .ToList ();
                
                var min = scores .DefaultIfEmpty () .Min ();
                WriteLine ($"..... min={min}");
                
                await res.AsJson (scores);
                return;
            });
        }
    }
    
    public class Target {
        public bool parallel { get; set; }
        public string target { get; set; }
    }
    
    // Assess req = List<string>
    // Assess res = List<int>
}

namespace Fitness {
    using Carter;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.Extensions.DependencyInjection;

    public class Startup {
        public void ConfigureServices (IServiceCollection services) {
            services.AddCarter ();
        }

        public void Configure (IApplicationBuilder app) {
            app.UseRouting ();
            app.UseEndpoints( builder => builder.MapCarter ());
        }
    }
}

namespace Fitness {
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;

    public class Program {
        public static void Main (string[] args) {
//          var host = Host.CreateDefaultBuilder (args)
//              .ConfigureWebHostDefaults (webBuilder => webBuilder.UseStartup<Startup>())

            var urls = new[] {"http://localhost:8091"};
            
            var host = Host.CreateDefaultBuilder (args)
            
                .ConfigureLogging (logging => {
                    logging
                        .ClearProviders ()
                        .AddConsole ()
                        .AddFilter (level => level >= LogLevel.Warning);
                })
                
                .ConfigureWebHostDefaults (webBuilder => {
                    webBuilder.UseStartup<Startup> ();
                    webBuilder.UseUrls (urls);  // !!!
                })
                
                .Build ();
            
            System.Console.WriteLine ($"..... starting on {string.Join (", ", urls)}");            
            host.Run ();
        }
    }
}

