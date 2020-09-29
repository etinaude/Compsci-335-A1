//#define STATIC
//#define SINGLETON

namespace MyCarterApp {
    using Carter;
    using Microsoft.AspNetCore.Http;
    using static System.Console;

    public class HomeModule : CarterModule {
        #if STATIC
        private static int counter;
        
        public HomeModule () {
            Get("/", async (req, res) => {
                counter += 1;
                WriteLine ($"..... STATIC {counter}");
                await res.WriteAsync ($"[STATIC {counter}] Hello from Carter!");
            });
        }

        #elif SINGLETON
        public HomeModule (MySingleton mys) {
            Get("/", async (req, res) => {
                mys.Counter += 1;
                WriteLine ($"..... SINGLETON {mys.Counter}");
                await res.WriteAsync ($"[SINGLETON {mys.Counter}] Hello from Carter!");
            });
        }

        #else 
        private int counter;
    
        public HomeModule () {
            Get("/", async (req, res) => {
                counter += 1;
                WriteLine ($"..... LOCAL {counter}");
                await res.WriteAsync ($"[LOCAL {counter}] Hello from Carter!");
            });
        }
        #endif
    }
}

namespace MyCarterApp {
    public class MySingleton {
        public int Counter { get; set; }
    }
}

namespace MyCarterApp {
    using Carter;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.Extensions.DependencyInjection;

    public class Startup {
        public void ConfigureServices(IServiceCollection services) {
            services.AddCarter();
            
            #if SINGLETON
            services.AddSingleton (new MySingleton ());  // !!!
            #endif
        }

        public void Configure(IApplicationBuilder app) {
            app.UseRouting();
            app.UseEndpoints(builder => builder.MapCarter());
        }
    }
}

namespace MyCarterApp {
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;

    public class Program {
        public static void Main (string[] args) {
//          var host = Host.CreateDefaultBuilder (args)
//              .ConfigureWebHostDefaults (webBuilder => webBuilder.UseStartup<Startup>())

            var urls = new[] {"http://localhost:8081", "https://localhost:8082"};
            
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
