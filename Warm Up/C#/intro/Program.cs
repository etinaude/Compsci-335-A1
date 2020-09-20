﻿using System;
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
                String[] text = tIn.ReadToEnd().Trim().Split();
                var spaces = from i in text where ! (i.Trim()=="") select i.Trim();
                var even = from item in spaces where int.Parse(item)%2==0 select int.Parse(item)/2;
                var odd = from item in spaces where int.Parse(item)%2==1 select int.Parse(item);
                even = even.Union(odd);
                Console.WriteLine(even.Sum());
            }
            catch (System.FormatException)
            {
                Console.WriteLine("*** Input string was not in a correct format.");
            }
            catch(System.OverflowException)
            {
                Console.WriteLine("*** Value was either too large or too small for an Int32.");
            }
        }
    }
}
