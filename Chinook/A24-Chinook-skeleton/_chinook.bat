set pompt=$G

dotnet build chinook.csproj
@pause

@for /l %%X in (1, 1, 4) do @(
    dotnet .\bin\Debug\netcoreapp3.1\chinook.dll < request-%%X.txt > response-%%X-test.txt
    rem type response-%%X-test.txt
    fc response-%%X.txt response-%%X-test.txt
    rem pause
)

pause
