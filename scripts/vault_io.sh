#!/bin/bash

COMMAND=$1
FILE_PATH=$2
CONTENT=$3

if [ "$COMMAND" == "read" ]; then
  cat "$FILE_PATH"
elif [ "$COMMAND" == "write" ]; then
  echo -e "$CONTENT" > "$FILE_PATH"
fi
