using System;
using System.Linq;

namespace intro
{
    class Program
    {
        static void Main(string[] args)
        {   
            int total =0;
            string[] text = Console.ReadLine().Split(" ");
            int[] array =new int[text.Length];
            int [] no = new int [text.Length];
            for (int i = 0; i < text.Length; i++)
            {
                array[i] = int.Parse(text[i]);
            }
            for(int i =0; i<text.Length;i++){
                if(array[i]%2 ==0){
                    array[i]=array[i]/2;
                }
            }
            int[] q = array.Distinct().ToArray();

            for(int i =0; i<q.Length;i++){
                total+=q[i];
            }
            Console.WriteLine(total);
        }
    }
}
