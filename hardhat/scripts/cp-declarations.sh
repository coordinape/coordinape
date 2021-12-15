#!/bin/bash
find typechain -name "*.d.ts" | xargs -I _ cp _ dist/typechain/
