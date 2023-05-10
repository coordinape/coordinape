#!/bin/bash

# Copy all TypeScript declaration files (files ending with .d.ts) from typechain/ to dist/typechain/ directory.

mkdir -p dist/typechain
find typechain -name "*.d.ts" | xargs -I _ cp _ dist/typechain/
