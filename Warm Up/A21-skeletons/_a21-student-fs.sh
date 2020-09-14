# !/bin/bash
set -v

function pause () {
    read -n1 -p "Press any key to continue . . ."
    echo
}

dotnet build a21-student-fs.fsproj
pause

dotnet run -p a21-student-fs.fsproj < a21-inp1.txt > a21-outp1-test.txt
diff a21-outp1.txt a21-outp1-test.txt
pause

dotnet run -p a21-student-fs.fsproj < a21-inp2.txt  > a21-outp2-test.txt
diff a21-outp2.txt a21-outp2-test.txt
pause

dotnet run -p a21-student-fs.fsproj < a21-inp3.txt  > a21-outp3-test.txt
diff a21-outp3.txt a21-outp3-test.txt
pause

dotnet run -p a21-student-fs.fsproj < a21-inp4.txt  > a21-outp4-test.txt
diff a21-outp4-fs.txt a21-outp4-test.txt
pause

