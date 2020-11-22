//<PackageReference Include="Microsoft.AspNet.WebApi.Client" Version="5.2.7" />
namespace MyCarterAppClient {
    
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;

    class Program {
        static async Task Main (string[] args) {
            await NetHttp ();
        }
        
        static async Task NetHttp () {
            var client = new HttpClient ();
            
            client.BaseAddress = new Uri ("http://localhost:8081/");
            client.DefaultRequestHeaders.Accept.Clear ();
            client.DefaultRequestHeaders.Accept.Add (
                new MediaTypeWithQualityHeaderValue ("application/json"));
            
            var XYs = new List<Point> {new Point {X=10, Y=20,}, new Point {X=30, Y=40,}};
            
            {
                var hrm = await PostAsync (client, "/one", new Point { X = 10, Y = 20, });
                Point p2 = await hrm.Content.ReadAsAsync <Point> ();
                Console.WriteLine ($"... res: [{string.Join (", ", p2)}]");
            }

            {
                var hrm = await PostAsync (client, "/array", new Points { XYs = XYs, });
                Points p2 = await hrm.Content.ReadAsAsync <Points> ();
                Console.WriteLine ($"... res: [{string.Join (", ", p2.XYs)}]");
            }

            {
                var hrm = await PostAsync (client, "/just-array", XYs .ToArray ());
                IEnumerable<Point> p2 = await hrm.Content.ReadAsAsync <Point[]> ();
                Console.WriteLine ($"... res: [{string.Join (", ", p2)}]");
            }
        }
        
        static async Task<HttpResponseMessage> PostAsync (HttpClient client, string url, object post) {
            Console.WriteLine ();
            var hrm = await client.PostAsJsonAsync (url, post);
            hrm.EnsureSuccessStatusCode ();
            Console.WriteLine (hrm);
            return hrm;
        }            
    }

    public class Point {
        public int X { get; set; }
        public int Y { get; set; }
        public override string ToString () {
            return $"({X}, {Y})";
        }
    }
    
    public class Points {
        public List<Point> XYs { get; set; }
        public override string ToString () {
            var xys = string.Join (", ", XYs);
            return $"{xys}";
        }
    }
}

