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
  rm -f src/icons/__generated/*.bak 2>/dev/null || true
  echo "Deleted temp working directory $WORK_DIR"
}

# register the cleanup function to be called on the EXIT signal
trap cleanup EXIT

# Ensure output directory exists
mkdir -p $OUT_DIR

# copy all the various icons into the tmpdir
# if there are new icon dirs, add them here
cp -a src/icons/brands/. $WORK_DIR 2>/dev/null || true
cp -a src/icons/custom/. $WORK_DIR 2>/dev/null || true
cp -a src/icons/feather/. $WORK_DIR 2>/dev/null || true
cp -a src/icons/fontawesome/. $WORK_DIR_512 2>/dev/null || true
cp -a src/icons/networks/. $WORK_DIR 2>/dev/null || true

# cleanup whatever old ones are there
rm -rf src/icons/__generated/
mkdir -p src/icons/__generated/

# generate icons from all the svgs
echo "Generating icons for 24x24..."
npx @svgr/cli --typescript $WORK_DIR --template ./src/icons/svgr-template.cjs --svg-props css="{CSS_REPLACE}" --svg-props viewBox="0 0 24 24" --out-dir $OUT_DIR

echo "Generating icons for 512x512..."
npx @svgr/cli --typescript $WORK_DIR_512 --template ./src/icons/svgr-template.cjs --svg-props css="{CSS_REPLACE}" --svg-props viewBox="0 0 512 512" --out-dir $OUT_DIR_512

echo "Contents of $OUT_DIR_512 before move:"
ls -la $OUT_DIR_512

# Move and concatenate files with error handling
if [ -d "$OUT_DIR_512" ] && [ "$(ls -A $OUT_DIR_512/*.tsx 2>/dev/null)" ]; then
    mv $OUT_DIR_512/*.tsx $OUT_DIR/
    echo "Moved .tsx files successfully"
else
    echo "No .tsx files found in $OUT_DIR_512"
fi

if [ -f "$OUT_DIR_512/index.ts" ]; then
    cat $OUT_DIR_512/index.ts >> $OUT_DIR/index.ts
    echo "Concatenated index.ts successfully"
else
    echo "No index.ts found in $OUT_DIR_512"
fi

# Replace SVG tags with SvgIcon
echo "Replacing SVG tags with SvgIcon..."
sed -i'.bak' 's/\<svg/\<SvgIcon/g' $OUT_DIR/*.tsx
sed -i'.bak' 's/\<\/svg/\<\/SvgIcon/g' $OUT_DIR/*.tsx
sed -i'.bak' 's/{CSS_REPLACE}/\{\{ \.\.\.css, \.\.\.\(props\.css \?\? \{\}\) \}\}/g' $OUT_DIR/*.tsx

echo "Script completed successfully!"