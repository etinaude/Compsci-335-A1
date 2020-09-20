//module Program

//open System
open System.IO

// ...

//[<EntryPoint>]
//let main argv =
    // ...
    //0
        





// Learn more about F# at http://fsharp.org

open System
[<EntryPoint>]
let readLines filePath = System.IO.File.ReadLines(filePath);;
let main argv =
    printfn "Hello World from F#!"
    0 // return an integer exit code
