#!/bin/bash

function pause () {
    read -n1 -p "Press any key to continue . . ."
    echo
}
set -v

cd "`dirname "$0"`"

echo testing Fitness /target and /assess

curl -w '\n' -s -S -X POST -H "Content-type:application/json" --data-binary @target.json http://localhost:8091/target

pause

curl -w '\n' -s -S -X POST -H "Content-type:application/json" --data-binary @assess0.json http://localhost:8091/assess

curl -w '\n' -s -S -X POST -H "Content-type:application/json" --data-binary @assess2.json http://localhost:8091/assess

pause

echo testing Client /top

curl -w '\n' -s -S -X POST -H "Content-type:application/json" --data-binary @top.json http://localhost:8101/top

curl -w '\n' -s -S -X POST -H "Content-type:application/json" --data-binary @top.json http://localhost:8101/top

pause

echo testing Monkeys /try

curl -w '\n' -s -S -X POST -H "Content-type:application/json" --data-binary @try0.json http://localhost:8081/try

curl -w '\n' -s -S -X POST -H "Content-type:application/json" --data-binary @try.json http://localhost:8081/try

pause

pause
