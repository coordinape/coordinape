import dotenv from 'dotenv';
import * as Figma from 'figma-api';
dotenv.config();

//#region constants
const FIGMA_FILE_KEY = 'L4oZwYVUdpgacZtwipGaYe';
const COLORS_DOCUMENT = '3542:11605';
const FILL = 'FILL';
const RECTANGLE = 'RECTANGLE';
//#endregion constants

//#region Types
type Styles = {
  name: string;
  id: string;
};

type ColorNode = {
  name: string;
  color: unknown;
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
const isRectangle = (node: any) => node != null && node.type === RECTANGLE;

const findStyleInTree = (root: any, styleId: any) => {
  if (noChildren(root)) {
    return isRectangle(root) && root.styles && root.styles.fill === styleId
      ? root
      : undefined;
  } else {
    return root.children
      .map((item: any) => findStyleInTree(item, styleId))
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
      colorNodes.push({ name, color: rgbToHex(r * 256, g * 256, b * 256) });
    }
  });

  return colorNodes;
};
//#endregion Utils functions

async function main() {
  const api = new Figma.Api({
    personalAccessToken: process.env.FIGMA_ACCESS_TOKEN || 'token',
  });

  const file = await api.getFile(FIGMA_FILE_KEY, {
    ids: [COLORS_DOCUMENT],
  });

  const styles: Styles[] = Object.entries(file.styles)
    .filter(([, { styleType }]) => styleType === FILL)
    .map(([id, { name }]) => ({ name: name.replace(/\s/g, ''), id }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const result = mapStyleToNode(file, styles);
  // eslint-disable-next-line no-console
  console.log(result, result.length);
}

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
