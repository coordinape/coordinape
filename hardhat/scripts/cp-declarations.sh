#!/bin/bash
mkdir -p dist/typechain
find typechain -name "*.d.ts" | xargs -I _ cp _ dist/typechain/
