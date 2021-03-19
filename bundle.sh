#!/bin/sh
# echo $@
echo "Using tsconfig.json for configuration"
echo "Bundling TS files into one single JS file..."

deno bundle --config ./tsconfig.json src/oxhr.ts dist/bundle.js
