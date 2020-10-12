set prompt=$G

curl -s -S -X GET http://localhost:8081/
curl -s -S -X GET https://localhost:8082/
pause

@echo.
curl -s -S -X POST -H "Content-type:application/json" --data-binary @one.json http://localhost:8081/one
curl -s -S -X POST -H "Content-type:application/json" --data-binary @one.json https://localhost:8082/one
pause

@echo.
curl -s -S -X POST -H "Content-type:application/json" --data-binary @array.json http://localhost:8081/array
curl -s -S -X POST -H "Content-type:application/json" --data-binary @array.json https://localhost:8082/array
pause

@echo.
curl -s -S -X POST -H "Content-type:application/json" --data-binary @just-array.json http://localhost:8081/just-array
curl -s -S -X POST -H "Content-type:application/json" --data-binary @just-array.json https://localhost:8082/just-array
pause

@echo.
curl -s -S -X POST -H "Content-type:application/txt" --data-binary @just-string.txt http://localhost:8081/just-string
curl -s -S -X POST -H "Content-type:application/txt" --data-binary @just-string.txt https://localhost:8082/just-string
pause

pause

