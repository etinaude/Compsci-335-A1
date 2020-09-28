namespace MyCarterApp {
    using Carter;
    using Microsoft.AspNetCore.Http;

    public class HomeModule : CarterModule {
        public HomeModule () {
            Get("/", async (req, res) => 
                await res.WriteAsync ("Hello from Carter!"));
            Get("/hi", async (req, res) => 
                await res.WriteAsync ("Hello from Carter222!"));
            Post("/post", async (req, res) => 
            {
                var body = req.Bind<X>();
                await res.WriteAsync (body);
            
            });
        }
    }
}