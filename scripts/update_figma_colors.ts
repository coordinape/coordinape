import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';
import * as Figma from 'figma-api';
import sortBy from 'lodash/sortBy';

dotenv.config();

/**
 * Go to https://www.figma.com/developers/api#authentication
 */
async function main() {
  const api = new Figma.Api({
    personalAccessToken: process.env.FIGMA_ACCESS_TOKEN || 'token',
  });

  const file = await api.getFile(FIGMA_FILE_KEY, {
    ids: [COLORS_DOCUMENT],
  });

  const styles: Styles[] = sortBy(
    Object.entries(file.styles)
      .filter(([, { styleType }]) => styleType === FILL)
      .map(([id, { name }]) => ({ name: name.replace(/\s/g, ''), id })),
    [
      ({ name }) => name.split('/')[0],
      ({ name }) => Number((name.split('/')[1] || '').split('|')[0]),
    ]
  );

  const result = mapStyleToNode(file, styles);
  generateFile(result);
}

//#region constants
const FIGMA_FILE_KEY = '358dQZc6GCZVwofUAVTcmf';
const COLORS_DOCUMENT = '1:13367';
const FILL = 'FILL';
const RECTANGLE = 'RECTANGLE';
const FRAME = 'FRAME';
//#endregion constants

//#region Types
type Styles = {
  name: string;
  id: string;
};

type ColorNode = {
  name: string;
  color: string;
};
//#endregion Types

//#region Utils functions
const rgbToHex = (r: number, g: number, b: number) => {
  const color =
    '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

  if (color.length > 7) {
    return color.slice(0, 7);
  }
  return color;
};

const noChildren = (node: any) => node != null && !('children' in node);
const isRectangle = (node: any) =>
  node != null && (node.type === RECTANGLE || node.type === FRAME);

const findStyleInTree = (root: any, styleId: any) => {
  if (noChildren(root)) {
    return isRectangle(root) && root.styles && root.styles.fills === styleId
      ? root
      : undefined;
  } else {
    return isRectangle(root) && root.styles && root.styles.fills === styleId
      ? root
      : root.children
          .map((item: any) => {
            return findStyleInTree(item, styleId);
          })
          .reduce(
            (accumulator: any, current: any) =>
              accumulator != null ? accumulator : current,
            undefined
          );
  }
};

const mapStyleToNode = (file: any, styles: Styles[]) => {
  const colorNodes: ColorNode[] = [];

  styles.forEach(({ name, id }) => {
    const node = findStyleInTree(file.document, id);
    const color =
      isRectangle(node) && node.fills[0] ? node.fills[0].color : undefined;

    if (color) {
      const { r, g, b } = color;
      colorNodes.push({ name, color: rgbToHex(r * 255, g * 255, b * 255) });
    }
  });

  return colorNodes;
};

const generateFile = (
  content: ColorNode[],
  fileName = './src/ui/new-colors.ts'
) => {
  if (!content) {
    throw new Error('No styles found');
  }

  const colorsGroupName: string[] = [];
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  });
  content = content.sort((a, b) => collator.compare(a.name, b.name));

  const colors = content.reduce((prev, curr) => {
    let colorGroupName;

    if (!colorsGroupName.includes(curr.name.split('/')[0])) {
      colorsGroupName.push(curr.name.split('/')[0]);
      colorGroupName = curr.name.split('/')[0];
    }

    const name = curr.name
      .split('|')[0]
      .replace('New/', '')
      .replace('/', '')
      .toLowerCase();

    return (
      prev +
      (colorGroupName ? `  // ${colorGroupName}\n` : '') +
      `  '${name}': '${curr.color}',\n`
    );
  }, '');

  const fileContents = `// Updated at ${new Date().toUTCString()}
// by scripts/update-figma-colors.ts

export const newColors = {
${colors}
};`;

  fs.writeFileSync(path.resolve(fileName), fileContents);

  // eslint-disable-next-line no-console
  console.log(`Wrote ${content.length} colors to ${fileName}`);
};
//#endregion Utils functions

(async function () {
  await main()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .then(() => {
      process.exit(0);
    });
})();
