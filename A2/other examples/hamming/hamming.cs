namespace MyCarterApp {
    using Carter;
    using Microsoft.AspNetCore.Http;
    using Carter.ModelBinding;
    using Carter.Request;
    using Carter.Response;
    using System.Linq;
    using System.Collections.Generic;
    using static System.Console;
    using System.Net;
    using System.Text;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;
    
    public class HomeModule : CarterModule {
        public static string Sbase;
        public void meth(string comp) 
        {
          Sbase = comp;
        }
        public HomeModule () {
            Get ("/", async (req, res) => {
                WriteLine (" GET /");
                await res.WriteAsync ("Hello from Carter!");
            });
            
            Post ("/target", async (req, res) => {
                var raw = await req.Bind<Dictionary<string,string>> ();
                Sbase = raw["text"];
                WriteLine ($" POST /Base -- {Sbase}");
                await res.AsJson (Sbase);
                return;
            });
            


            Post ("/assess", async (req, res) => {
                WriteLine($"base - {Sbase}");
                var raw = await req.Bind<Dictionary<string,string>> ();
                //WriteLine ($" POST req {raw}");
                var comp = raw["text"];
                var l = Sbase.Length;
                if(l==0){
                    await res.AsJson ($"{{\"number\":{l}}}");
                    return;
                }
                int count = 0;
                if(Sbase.Length>comp.Length){
                    l = comp.Length;
                    count = Sbase.Length-comp.Length;
                }else{
                    count = comp.Length-Sbase.Length;
                }                

                WriteLine ($" POST /one {comp}");
                for (int i = 0; i < l; i++)
                {
                    if(Sbase[i]==comp[i]){
                        Write(".");
                    }else{
                        Write(comp[i]);
                        count++;
                    }
                }
                //var fin = new String();
                WriteLine("");
                WriteLine(count);
                //var finres = new StringContent($"{{\"number\":{count}}}", Encoding.UTF8, "application/json");
                await res.AsJson (count);
                return;
            });

        }
    }
    

    
}

namespace MyCarterApp {
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

