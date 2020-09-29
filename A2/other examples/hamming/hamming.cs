namespace MyCarterApp {
    using Carter;
    using Microsoft.AspNetCore.Http;
    using Carter.ModelBinding;
    using Carter.Request;
    using Carter.Response;
    using System.Linq;
    using System.Collections.Generic;
    using static System.Console;
    
    public class HomeModule : CarterModule {
        public string Sbase = "hi";
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
                meth(await req.Bind<string> ());
                WriteLine ($" POST /Base -- {Sbase}");
                await res.AsJson (Sbase);
                return;
            });
            


            Post ("/genome", async (req, res) => {
                WriteLine(Sbase);
                //var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -=+\"';:.,<>/\\?!@#$%^&*()_`~[]{}|";
                var raw = await req.Bind<Dictionary<string,string>> ();
                var comp = "asd";
                //WriteLine(raw["a"].Length);

                foreach(KeyValuePair<string, string> kvp in raw)
                                WriteLine("Key: {0}, Value: {1}", kvp.Key, kvp.Value);

                //comp = "hie";
                WriteLine ($" POST /one {comp}");
                int count = 0;
                for (int i = 0; i < Sbase.Length; i++)
                {
                    //comp[i] = chars[random.Next(chars.Length)];
                    if(Sbase[i]==comp[i]){
                        WriteLine("match");
                    }else{
                        WriteLine(comp[i]);
                        count++;
                    }
                }
                //var fin = new String();
                WriteLine(count);
                await res.AsJson (count);
                return;
            });


            /*Post ("/array", async (req, res) => {
                var points = await req.Bind<Points> (); 
                WriteLine ($"..... POST /array {points}");
                var xys = points.XYs.Select (p => new Point {X = p.X + 1, Y = p.Y + 2, });
                var points2 = new Points {XYs = xys.ToList()};
                WriteLine ($"..... POST /array {string.Join ("", "", points2)}");
                await res.AsJson (points2);
                return;
            });*/
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

