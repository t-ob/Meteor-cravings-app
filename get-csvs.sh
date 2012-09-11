#!/bin/sh
NOW=$(date +"%Y-%m-%d-%T")

USERS10="users-10.$NOW.csv"
EVENTS10="events-10.$NOW.csv"
USERS20="users-20.$NOW.csv"
EVENTS20="events-20.$NOW.csv"

mongoexport --host flame.mongohq.com --port 27098 --username murakami --password password --collection events --db app6288655 --csv --out $EVENTS10 -f user,time

mongoexport --host flame.mongohq.com --port 27098 --username murakami --password password --collection users --db app6288655 --csv --out $USERS10 -f user,points

mongoexport --host flame.mongohq.com --port 27102 --username murakami --password password --collection events --db app6289394 --csv --out $EVENTS20 -f user,time

mongoexport --host flame.mongohq.com --port 27102 --username murakami --password password --collection users --db app6289394 --csv --out $USERS20 -f user,points


