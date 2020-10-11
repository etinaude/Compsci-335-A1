set prompt=$G

curl -s -S -X GET http://localhost:8081/

curl -s -S -X GET https://localhost:8082/
pause

curl -s -S -X POST -H "Content-type:application/json" --data-binary @one.json http://localhost:8081/one
pause

curl -s -S -X POST -H "Content-type:application/json" --data-binary @array.json https://localhost:8082/array
pause

pause

