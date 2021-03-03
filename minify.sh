#!/bin/sh
# echo $@
echo "Minifiying bundle with Terser..."

terser dist/bundle.js --compress --mangle --output dist/bundle.min.js
