namespace Monkeys { 
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
    using System.Text.Json;

    public class HomeModule : CarterModule {
        //string Sbase="hi";
        HttpClient client = new HttpClient();
        
        private Random _random = new Random (1);


        public HomeModule () {
            Random random = new Random();
            Get ("/", async (req, res) => {
                WriteLine (" GET /");
                await res.WriteAsync ("Hello from Carter!");
            });
            

             Post ("/try", async (req, res) => { 
                var client = new HttpClient();
                var re = await req.Bind<TryRequest> ();

                var length = re.length;
                var parallel = re.parallel;
                var monkeys = re.monkeys;
                var crossover = re.crossover;
                var limit = re.limit;
                var id = re.id;
                List<string> post = new List<string>(new string[]{ "a", "3", "7" });
                /*
                 * create genome
                 *
                 *
                 * 
                 */
                
                WriteLine ($"..... POST length {length}");
 
                
                var content = new StringContent(JsonSerializer.Serialize(post), System.Text.Encoding.UTF8, "application/json");
                var response = await client.PostAsync("http://localhost:8091/assess", content);

                var ress  = await response.Content.ReadAsAsync <List<int>> ();
                WriteLine ($" POST res {ress[0]}");
                
                await res.AsJson ("WORKING!");
                return;
            });
        }
        
        private double NextDouble () {
            lock (this) {
                return _random.NextDouble ();
            }
        }
        
        private int NextInt (int a, int b) {
            lock (this) {
                return _random.Next (a, b);
            }
        }

        string target = "";  // simplified Fitness stuff, shouldn't be here
        
        async Task<AssessResponse> PostFitnessAssess (AssessRequest areq) {
            // fake Fitness post request&response
            // replace this code by actual POST /assess request&response
            // var client = new HttpClient (); 
            // ...
            
            await Task .Delay (0);
            
            var scores = areq .genomes .Select ( g => {
                var len = Math.Min (target.Length, g.Length);
                var h = Enumerable .Range (0, len)  
                    .Sum (i => Convert.ToInt32 (target[i] != g[i]));
                h = h + Math.Max (target.Length, g.Length) - len;
                return h;
            }) .ToList ();
            
            return new AssessResponse { id = areq.id, scores = scores };
        }
        
        async Task PostClientTop (TopRequest top) {
            // replace this by actual POST /top request
            // var client = new HttpClient (); 
            // ...
            Post ("/top", async (req, res) => { 
                var client = new HttpClient();
                var re = await req.Bind<TopRequest> ();

                var id = re.id;
                var loop = re.loop;
                var score = re.score;
                var genome = re.genome;


                WriteLine ($"..... POST top ");
                
                //WriteLine ($" POST res {ress[0]}");
                
                await res.AsJson ("WORKING!");
                return;
            });
            
            await Task .Delay (0);
            
            WriteLine ($"===== {top.loop} {top.score}\r\n{top.genome}");
        }
        
        int ProportionalRandom (int[] weights, int sum) {
            var val = NextDouble () * sum;
            
            for (var i = 0; i < weights.Length; i ++) {
                if (val < weights[i]) return i;
                
                val -= weights[i];
            }
            
            WriteLine ($"***** Unexpected ProportionalRandom Error");
            return 0;
        }
        
        async Task ProportionalRandomTest () {
            WriteLine ($"..... ProportionalRandomTest");
            await Task.Delay (0);
            
            var weights = new[] { 1, 6, 1, 3, };
            var histo = new int[weights.Length];
            var sum = weights .Sum ();
            
            var n = 10000;
            for (var k = 0; k < n; k ++) {
                var p = ProportionalRandom (weights, sum);
                histo[p] += 1;
            }                
            
            var sum2 = (double) sum;
            var n2 = (double) n;
            
            var weights2 = weights.Select (w => (w/sum2).ToString("F2"));
            var histo2 = histo.Select (h => (h/n2).ToString("F2"));
            
            WriteLine ($"..... w: {string.Join(", ", weights)}");
            WriteLine ($"..... h: {string.Join(", ", histo)}");
            WriteLine ($"..... w: {string.Join(", ", weights2)}");
            WriteLine ($"..... w: {string.Join(", ", histo2)}");
         }
        
        async void GeneticAlgorithm (TryRequest treq) {
            WriteLine ($"..... GeneticAlgorithm {treq}");
            await Task.Delay (0);
            
            // just an ad-hoc PR test - you will remove this
            // await ProportionalRandomTest ();
            
            // YOU CODE GOES HERE
            // FOLLOW THE GIVEN PSEUDOCODE
            
            var id = treq.id;
            var monkeys = treq.monkeys;
            if (monkeys % 2 != 0) monkeys += 1;
            var length = treq.length;
            var crossover = treq.crossover / 100.0 ;
            var mutation = treq.mutation / 100.0;
            var limit = treq.limit;
            if (limit == 0) limit = 1000;

            var topscore = int.MaxValue;
            
            // ...
                        
            for (int loop = 0; loop < limit; loop ++) {
                // ...
            }
        }
        
        async Task ReceiveClientTarget (TargetRequest t) {  // Simulate the POST /target function -- Fitness stuff, shouldn't remain here
            WriteLine ($"..... receive target {t}");
            await Task.Delay (0);

            target = t.target;
            return;  // emphatic empty return
        }
        
        async Task ReceiveClientTry (TryRequest t) {  // Simulate the POST /try function
            WriteLine ($"..... receive try {t}");
            await Task.Delay (0);
            
            GeneticAlgorithm (t);
            
            return;  // emphatic empty return
        }
        
       public static async Task Start (int port) {  // Client-like stuff, shouldn't remain here
            await Task.Delay (1000);
            
            var line1 = Console.ReadLine() ?.Trim();
            var line2 = Console.ReadLine() ?.Trim();
            
            var targetjson = string.IsNullOrEmpty (line1)? "{\"id\":0, \"target\": \"abcd\"}": line1;
            var tryjson = string.IsNullOrEmpty (line2)? "{\"id\": 0, \"parallel\": true, \"monkeys\": 20, \"length\": 4, \"crossover\": 90, \"mutation\": 20 }": line2;
                            
            var target = JsonSerializer.Deserialize<TargetRequest> (targetjson);
            var trie = JsonSerializer.Deserialize<TryRequest> (tryjson);
            
            target.id = port;
            trie.id = port;
            
            //Console.WriteLine ($"..... target: {target}");
            //Console.WriteLine ($"..... try: {trie}");
            
            var self = new HomeModule ();
            
            await self .ReceiveClientTarget (target);  // Fitness stuff, shouldn't remain here
            await self .ReceiveClientTry (trie);
        }            

       
    }
    
    public class TargetRequest {
        public int id { get; set; }
        public bool parallel { get; set; }
        public string target { get; set; }
        public override string ToString () {
            return $"{{{id}, {parallel}, \"{target}\"}}";
        }  
    }    

    public class TryRequest {
        public int id { get; set; }
        public bool parallel { get; set; }
        public int monkeys { get; set; }
        public int length { get; set; }
        public int crossover { get; set; }
        public int mutation { get; set; }
        public int limit { get; set; }
        public override string ToString () {
            return $"{{{id}, {parallel}, {monkeys}, {length}, {crossover}, {mutation}, {limit}}}";
        }
    }
    
    public class TopRequest {
        public int id { get; set; }
        public int loop { get; set; }
        public int score { get; set; }
        public string genome { get; set; }
        public override string ToString () {
            return $"{{{id}, {loop}, {score}, {genome}}}";
        }  
    }    
    
    public class AssessRequest {
        public int id { get; set; }
        public List<string> genomes { get; set; }
        public override string ToString () {
            return $"{{{id}, {genomes.Count}}}";
        }  
    }
    
    public class AssessResponse {
        public int id { get; set; }
        public List<int> scores { get; set; }
        public override string ToString () {
            return $"{{{id}, {scores.Count}}}";
        }  
    }

    public class jso {
        public int number { get; set; }
        public override string ToString () {
            return $"({number})";
        }
    }
}

namespace Monkeys {
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

namespace Monkeys {
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;

    public class Program {
        public static void Main (string[] args) {
            var urls = new[] {"http://localhost:8081", "https://localhost:8092"};
            
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
