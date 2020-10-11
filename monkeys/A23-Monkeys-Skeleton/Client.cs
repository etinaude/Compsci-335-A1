namespace Client {
    using Carter;
    using Microsoft.AspNetCore.Http;
    using Carter.ModelBinding;
    using Carter.Request;
    using Carter.Response;
    using System.Linq;
    using System.Collections.Generic;
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text.Json;
    using static System.Console;
    
    public class HomeModule : CarterModule {
        public HomeModule () {
            Post ("/top", async (req, res) => {
                var t = await req.Bind<Top> ();
                WriteLine ($"..... POST /top {t.score}");
                WriteLine ($"{t.genome}");
                WriteLine ($"");
                return;
            });
        }
        
        public static async void PostTarget (Target t) {
            var client = new HttpClient ();
            
            client.BaseAddress = new Uri ("http://localhost:8091/");
            client.DefaultRequestHeaders.Accept.Clear ();
            client.DefaultRequestHeaders.Accept.Add (
                new MediaTypeWithQualityHeaderValue ("application/json"));
                
            var hrm = await client.PostAsJsonAsync ("/target", t);
            hrm.EnsureSuccessStatusCode ();
            return;
        }

        public static async void PostTry (Try t) {
            var client = new HttpClient ();
            
            client.BaseAddress = new Uri ("http://localhost:8081/");
            client.DefaultRequestHeaders.Accept.Clear ();
            client.DefaultRequestHeaders.Accept.Add (
                new MediaTypeWithQualityHeaderValue ("application/json"));
                
            var hrm = await client.PostAsJsonAsync ("/try", t);
            hrm.EnsureSuccessStatusCode ();
            return;
        }

        static HomeModule () {
            var line1 = Console.ReadLine();
            var line2 = Console.ReadLine();
            
            var targetjson = string.IsNullOrEmpty (line1?.Trim())? "{\"parallel\":true, \"target\": \"abc\"}": line1;
            var tryjson = string.IsNullOrEmpty (line2?.Trim())? "{\"parallel\": true, \"monkeys\": 10, \"length\": 3, \"crossover\": 80, \"mutation\": 20 }": line2;
                            
            var target = JsonSerializer.Deserialize<Target> (targetjson);
            var trie = JsonSerializer.Deserialize<Try> (tryjson);
            
            Console.WriteLine ($"..... target: {target}");
            Console.WriteLine ($"..... try: {trie}");
            
            PostTarget (target);
            PostTry (trie);
        }    
    }
    
    public class Target {
        public bool parallel { get; set; }
        public string target { get; set; }
        public override string ToString () {
            return $"{{{parallel}, {target}}}";
        }  
    }    
    
    public class Try {
        public bool parallel { get; set; }
        public int monkeys { get; set; }
        public int length { get; set; }
        public int crossover { get; set; }
        public int mutation { get; set; }
        public override string ToString () {
            return $"{{{parallel}, {monkeys}, {length}, {crossover}, {mutation}}}";
        }
    }
    
    public class Top {
        public int score { get; set; }
        public string genome { get; set; }
        public override string ToString () {
            return $"{{{score}, {genome}}}";
        }  
    }    
}

namespace Client {
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

namespace Client {
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;

    public class Program {
        public static void Main (string[] args) {
//          var host = Host.CreateDefaultBuilder (args)
//              .ConfigureWebHostDefaults (webBuilder => webBuilder.UseStartup<Startup>())

            var urls = new[] {"http://localhost:8101"};
            
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

