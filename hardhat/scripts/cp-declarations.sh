#!/bin/bash

mkdir -p dist/typechain 

# Copy all TypeScript declaration files (files ending with .d.ts) from typechain/ to dist/typechain/ directory.
find typechain -name "*.d.ts" | xargs -I _ cp _ dist/typechain/

# Copy deploymentInfo
cp deploymentInfo.json dist/
