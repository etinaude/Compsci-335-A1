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
    using System.Net;
    using System.Text;
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

                var ress = await response.Content.ReadAsStringAsync();
                WriteLine ($" POST res {ress}");
                await res.AsJson (ress);
                return;
            });



            /*
            Post ("/genome", async (req, res) => {
                var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -=+\"';:.,<>/\\?!@#$%^&*()_`~[]{}|";
                var size = await req.Bind<int> ();
                char[] comp =  new char[size];
                WriteLine ($" POST req {size}");
                int count = 0;
                for (int i = 0; i < size; i++)
                    comp[i] = chars[random.Next(chars.Length)];

                var values = new Dictionary<string, string>
                {
                    {new string(comp),""}
                };
                //WriteLine(values["val"]);
                var content = new FormUrlEncodedContent(values);
                var response = await client.PostAsync("http://localhost:8081/genome", content);
                var ress = await response.Content.ReadAsStringAsync();
                WriteLine ($" POST res {ress}");


                

                await res.AsJson (count);
                return;
            });*/
        }

        /*
        static async Task<HttpResponseMessage> PostAsync (HttpClient client, string url, object post) {
            Console.WriteLine ();
            var hrm = await client.PostAsJsonAsync (url, post);
            hrm.EnsureSuccessStatusCode ();
            Console.WriteLine (hrm);
            return hrm;
        }*/


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

