//module Program

open System
open System.IO


    
let value = (stdin.ReadToEnd().Split ' ');
//let value = (Array.filter (fun elem -> elem % 2 = 0) [| 1 .. 10|])
let s  = value |> Array.toList
let newList = List.map (fun x -> (x.replace("", "")) |> int) s
let finalList = (Seq.distinct ((List.map (fun x -> x/2) (List.filter (fun x -> x % 2 = 0) newList))@List.filter (fun x -> x % 2 = 1) newList))

printfn "%d " (Seq.sum finalList)

