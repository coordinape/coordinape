#!/bin/bash

# make a tmp dir, copy all the icons into there

rm -rf ./tmpicons
mkdir tmpicons
WORK_DIR=./tmpicons

OUT_DIR=src/icons/__generated

# deletes the temp directory
function cleanup {
  rm -rf "$WORK_DIR"
  rm src/icons/__generated/*.bak
  echo "Deleted temp working directory $WORK_DIR"
}

# register the cleanup function to be called on the EXIT signal
trap cleanup EXIT


# copy all the various icons into the tmpdir
# if there are new icon dirs, add them here
cp src/icons/figma/*svg $WORK_DIR
cp src/icons/brands/*svg $WORK_DIR

# cleanup whatever old ones are there
rm -rf src/icons/__generated/*

# generate icons from all the svgs

npx @svgr/cli --typescript  $WORK_DIR --template ./src/icons/figma/svgr-template.js --svg-props css="{CSS_REPLACE}" --svg-props viewBox="0 0 16 16" --out-dir $OUT_DIR
sed -i '.bak' 's/\<svg/\<SvgIcon/g' src/icons/__generated/*.tsx
sed -i '.bak' 's/\<\/svg/\<\/SvgIcon/g' src/icons/__generated/*.tsx
sed -i '.bak' 's/{CSS_REPLACE}/\{\{ \.\.\.css, \.\.\.\(props\.css \?\? \{\}\) \}\}/g' src/icons/__generated/*.tsx
