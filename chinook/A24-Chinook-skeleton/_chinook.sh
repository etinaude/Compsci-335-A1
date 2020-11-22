#!/bin/bash

function pause () {
    read -n1 -p "Press any key to continue . . ."
    echo
}
set -v

cd "`dirname "$0"`"
pwd

set -v
dotnet build chinook.csproj
set +v
pause

#for ((X=1; X<=4; X++)) 
for X in {1..4} 
    do
    dotnet ./bin/Debug/netcoreapp3.1/chinook.dll < request-$X.txt > response-$X-test.txt
    #cat response-$X-test.txt
    diff --strip-trailing-cr response-$X.txt response-$X-test.txt
    echo case $X : $?
    done

pause
