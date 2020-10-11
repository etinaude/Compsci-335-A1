using System;

namespace project
{
    class Program
    {
        private static Random random = new Random();
        static void Main(string[] args)
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -=+\"';:.,<>/\\?!@#$%^&*()_`~[]{}|";
            String a = "aaa";
            var b = new char[a.Length];
            int count = 0;
            for (int i = 0; i < a.Length; i++)
            {
                b[i] = chars[random.Next(chars.Length)];
                if(a[i]==b[i]){
                    Console.WriteLine("match");
                }else{
                    Console.WriteLine(b[i]);
                    count++;
                }
            }
            var fin = new String(b);
            Console.WriteLine(count);
        }
    }
}
