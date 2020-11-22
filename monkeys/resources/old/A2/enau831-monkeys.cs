namespace MyCarterApp {
    using Carter;
    using Microsoft.AspNetCore.Http;
    using Carter.ModelBinding;
    using Carter.Request;
    using Carter.Response;
    using System;
    using System.Linq;
    using System.Collections.Generic;
    using static System.Console;
    using System.Text;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;
    
    public class HomeModule : CarterModule {
        //string Sbase="hi";
        HttpClient client = new HttpClient();
        public HomeModule () {
            Random random = new Random();
            Get ("/", async (req, res) => {
                WriteLine (" GET /");
                await res.WriteAsync ("Hello from Carter!");
            });
            



             Post ("/try", async (req, res) => {
                var cli = await req.Bind<Dictionary<string,string>> ();
                //WriteLine ($" POST req {cli}");
                WriteLine ($" POST req {cli["text"]}");
                //var client = new HttpClient();
                var content = new StringContent($"{{\"text\":\"{cli["text"]}\"}}", Encoding.UTF8, "application/json");
                var response = await client.PostAsync("http://localhost:8081/assess", content);

                jso ress  = await response.Content.ReadAsAsync <jso> ();
                WriteLine ($" POST res {ress}");
                
                //var finres = ress["number"];
                //var pts = new jso {number = ress };
                //var ff = new StringContent(finres, Encoding.UTF8, "application/json");
                await res.AsJson (ress);
                return;
            });

        }

    }

    public class jso {
        public int number { get; set; }
        public override string ToString () {
            return $"({number})";
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
            var urls = new[] {"http://localhost:8091", "https://localhost:8092"};
            
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

