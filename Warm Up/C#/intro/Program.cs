using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;

namespace intro
{
    class Program
    {
        static void Main(string[] args)
        {   
            TextReader tIn = Console.In;
            try
            {
                String[] text = tIn.ReadToEnd().Trim().Split ((char[])null, StringSplitOptions.RemoveEmptyEntries);
                //var spaces = from i in text where ! (i.Trim()=="") select i.Trim();
                var odd = from item in text where (int.Parse(item)%2==1 || int.Parse(item)%2==-1) select int.Parse(item)/1;
                var even = from item in text where int.Parse(item)%2==0 select int.Parse(item)/2;
                //Console.WriteLine(odd);
                Console.WriteLine((even.Union(odd)).Sum());
            }
            catch (Exception e)
            {
                Console.WriteLine($"*** {e.Message}" );
            }

        }
    }
}
