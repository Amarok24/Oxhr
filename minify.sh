#!/bin/sh
# echo $@
echo "Minifying oxhr.js with Terser..."

terser dist/oxhr.js --compress --mangle --output dist/oxhr.min.js
