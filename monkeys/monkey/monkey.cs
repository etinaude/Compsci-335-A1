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
        
        HttpClient client = new HttpClient();
        private static Random _random = new Random (1);
        public static int best { get; set; } = 999999;
        public HomeModule () {
            Random random = new Random();
            Get ("/", async (req, res) => {
                WriteLine (" GET /");
                await res.WriteAsync ("Hello from Carter!");
            });
            
             Post ("/try", async (req, res) => { 
                var client = new HttpClient();
                var re = await req.Bind<TryRequest> ();
                GeneticAlgorithm(re);
                //await res.AsJson ("WORKING!");
                return;
            });
        }
        private double NextDouble () {
            lock (this) {
                return _random.NextDouble ();
            }
        }
         private string Nextstr (int length) {
            lock (this) {
                IEnumerable<char> chars = Enumerable.Range(0, length).Select(x => Convert.ToChar(NextInt(32, 126)));
                return new string(chars.ToArray());
            }
        }
        private int NextInt (int a, int b) {
            lock (this) {
                return _random.Next (a, b);
            }
        }
        string target = "";         
        int ProportionalRandom (int[] weights, int sum) {
            var max = 0;
            foreach (var e in weights)
            {
                if (e > max)
                {
                    max = e;
                }
            }
            var w = weights.Select(a => max-a+1).ToArray();
            sum = w.Sum();
            var val = NextDouble () * sum;
            for (var i = 0; i < w.Length; i ++) {
                if (val < w[i]) return i;
                
                val -= w[i];
            }
            
            WriteLine ($"***** Unexpected ProportionalRandom Error");
            return 0;
        }
        async void GeneticAlgorithm (TryRequest treq) {
            var length = treq.length;
            var monkeys = treq.monkeys;
            List<string> post = new List<string>();
            string bestStr = "";
            if (monkeys % 2 != 0) {monkeys += 1;}
            
            //discover length
            if (length == 0)
            {
                List<string> test = new List<string>() {""};
                var content = new StringContent(JsonSerializer.Serialize(test), System.Text.Encoding.UTF8,
                    "application/json");
                var response = await client.PostAsync("http://localhost:8091/assess", content);
                var l = await response.Content.ReadAsAsync<List<int>>();
                length = l[0];
            }
            
            //create start genome

            IEnumerable<string> strings =
                Enumerable.Repeat(
                   Nextstr(length) , monkeys);

            post = strings.ToList();

            
            
            WriteLine ($"..... POST length {length}");
            for(var count =0; count < treq.limit; count++)
            {
                //Send content
                var content = new StringContent(JsonSerializer.Serialize(post), System.Text.Encoding.UTF8,
                    "application/json");
                var response = await client.PostAsync("http://localhost:8091/assess", content);

                var ress = await response.Content.ReadAsAsync<List<int>>();
                
               //find best
                var min = ress.Min();
                var tempBestString = post[ress.IndexOf(min)];
                var tempBest = min;


                if (0 == tempBest)
                {
                    best = tempBest;
                    bestStr = tempBestString;
                    var top = new TopRequest(8081,count,best, bestStr);
                    var topcont = new StringContent(JsonSerializer.Serialize(top), System.Text.Encoding.UTF8,
                        "application/json");
                    var resp = await client.PostAsync($"http://localhost:{treq.id}/top", topcont);
                    WriteLine($" DONE {tempBestString}");
                    return;
                }
                if (tempBest < best)
                {
                    best = tempBest;
                    bestStr = tempBestString;
                    WriteLine($" BEST {tempBestString}");
                    var top = new TopRequest(8081,count,best, bestStr);
                    var topcont = new StringContent(JsonSerializer.Serialize(top), System.Text.Encoding.UTF8,
                        "application/json");
                    var resp = await client.PostAsync("http://localhost:8101/top", topcont);


                }



                //if its parallel
                if (treq.parallel)
                {
                    post = ParallelEnumerable.Range(1, monkeys / 2)
                        .SelectMany<int, string>(i =>
                        {

                            var p1 = post[ProportionalRandom(ress.ToArray(), ress.Sum())];
                            var p2 = post[ProportionalRandom(ress.ToArray(), ress.Sum())];
                            var c1 = "";
                            var c2 = "";
                            //cross over chance
                            if (NextInt(0, 100) < treq.crossover)
                            {
                                var Index = NextInt(0, p1.Length - 1);
                                c1 = p1.Substring(0, Index) + p2.Substring(Index, p2.Length - Index);
                                c2 = p2.Substring(0, Index) + p1.Substring(Index, p1.Length - Index);
                            }
                            else
                            {
                                c1 = p1;
                                c2 = p2;
                            }

                            if (NextInt(0, 100) < treq.mutation)
                            {
                                var item = NextInt(0, c1.Length);
                                StringBuilder strBuilder = new System.Text.StringBuilder(c1);
                                strBuilder[item] = Convert.ToChar(NextInt(32, 126));
                                ;
                                c1 = strBuilder.ToString();
                            }

                            if (NextInt(0, 100) < treq.mutation)
                            {
                                var item = NextInt(0, c2.Length);
                                StringBuilder strBuilder = new System.Text.StringBuilder(c2);
                                strBuilder[item] = Convert.ToChar(NextInt(32, 126));
                                ;
                                c2 = strBuilder.ToString();
                            }

                            return new[] {c1, c2};
                        }).ToList();
                }
                else
                {
                    post = Enumerable.Range(1, monkeys / 2)
                        .SelectMany<int, string>(i =>
                        {

                            var p1 = post[ProportionalRandom(ress.ToArray(), ress.Sum())];
                            var p2 = post[ProportionalRandom(ress.ToArray(), ress.Sum())];
                            var c1 = "";
                            var c2 = "";
                            //cross over chance
                            if (NextInt(0, 100) < treq.crossover)
                            {
                                var Index = NextInt(0, p1.Length - 1);
                                c1 = p1.Substring(0, Index) + p2.Substring(Index, p2.Length - Index);
                                c2 = p2.Substring(0, Index) + p1.Substring(Index, p1.Length - Index);
                            }
                            else
                            {
                                c1 = p1;
                                c2 = p2;
                            }

                            if (NextInt(0, 100) < treq.mutation)
                            {
                                var item = NextInt(0, c1.Length);
                                StringBuilder strBuilder = new System.Text.StringBuilder(c1);
                                strBuilder[item] = Convert.ToChar(NextInt(32, 126));
                                ;
                                c1 = strBuilder.ToString();
                            }

                            if (NextInt(0, 100) < treq.mutation)
                            {
                                var item = NextInt(0, c2.Length);
                                StringBuilder strBuilder = new System.Text.StringBuilder(c2);
                                strBuilder[item] = Convert.ToChar(NextInt(32, 126));
                                ;
                                c2 = strBuilder.ToString();
                            }

                            return new[] {c1, c2};
                        }).ToList();
                }
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
        public TopRequest(int ID, int Loop, int Score, string Genome)
        {
            id = ID;
            loop = Loop;
            score = Score;
            genome = Genome;
        }
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
