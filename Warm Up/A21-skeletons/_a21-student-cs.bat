dotnet build a21-student-cs.csproj
pause

dotnet run -p a21-student-cs.csproj < a21-inp1.txt > a21-outp1-test.txt
fc a21-outp1.txt a21-outp1-test.txt
pause

dotnet run -p a21-student-cs.csproj < a21-inp2.txt  > a21-outp2-test.txt
fc a21-outp2.txt a21-outp2-test.txt
pause

dotnet run -p a21-student-cs.csproj < a21-inp3.txt  > a21-outp3-test.txt
fc a21-outp3.txt a21-outp3-test.txt
pause

dotnet run -p a21-student-cs.csproj < a21-inp4.txt  > a21-outp4-test.txt
fc a21-outp4-cs.txt a21-outp4-test.txt
pause
