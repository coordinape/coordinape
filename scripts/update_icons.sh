#!/bin/bash

# make a tmp dir, copy all the icons into there

rm -rf ./tmpicons
mkdir tmpicons
rm -rf ./tmpicons512
mkdir tmpicons512
mkdir tmpicons512/out

WORK_DIR=./tmpicons
WORK_DIR_512=./tmpicons512

OUT_DIR=src/icons/__generated
OUT_DIR_512=./tmpicons512/out

# deletes the temp directory
function cleanup {
  rm -rf "$WORK_DIR"
  rm -rf "$WORK_DIR_512"
  rm src/icons/__generated/*.bak
  echo "Deleted temp working directory $WORK_DIR"
}

# register the cleanup function to be called on the EXIT signal
trap cleanup EXIT


# copy all the various icons into the tmpdir
# if there are new icon dirs, add them here
cp -a src/icons/brands/. $WORK_DIR
cp -a src/icons/custom/. $WORK_DIR
cp -a src/icons/feather/. $WORK_DIR
cp -a src/icons/fontawesome/. $WORK_DIR_512
cp -a src/icons/networks/. $WORK_DIR

# cleanup whatever old ones are there
rm -rf src/icons/__generated/

# generate icons from all the svgs

npx @svgr/cli --typescript  $WORK_DIR --template ./src/icons/svgr-template.cjs --svg-props css="{CSS_REPLACE}" --svg-props viewBox="0 0 24 24" --out-dir $OUT_DIR
npx @svgr/cli --typescript  $WORK_DIR_512 --template ./src/icons/svgr-template.cjs --svg-props css="{CSS_REPLACE}" --svg-props viewBox="0 0 512 512" --out-dir $OUT_DIR_512
mv $OUT_DIR_512/*.tsx $OUT_DIR
cat $OUT_DIR_512/index.ts >> $OUT_DIR/index.ts
sed -i '.bak' 's/\<svg/\<SvgIcon/g' src/icons/__generated/*.tsx
sed -i '.bak' 's/\<\/svg/\<\/SvgIcon/g' src/icons/__generated/*.tsx
sed -i '.bak' 's/{CSS_REPLACE}/\{\{ \.\.\.css, \.\.\.\(props\.css \?\? \{\}\) \}\}/g' src/icons/__generated/*.tsx
