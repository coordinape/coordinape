import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { IS_LOCAL_ENV } from '../../api-lib/config.ts';

declare type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
declare type Style = 'normal' | 'italic';

interface FontOptions {
  data: Buffer | ArrayBuffer;
  name: string;
  weight?: Weight;
  style?: Style;
  lang?: string;
}

const getPath = (name: string) =>
  join(process.cwd(), 'public', 'fonts', `${name}.ttf`);
const createFont = (name: string, file: string) => {
  // TODO: fix font loading in vercel, url fetching is very slow
  let fontData: ArrayBuffer;
  if (IS_LOCAL_ENV) {
    fontData = readFileSync(getPath(file));
  } else {
    const currentFilename = fileURLToPath(import.meta.url);
    const currentDirname = dirname(currentFilename);
    fontData = readFileSync(join(currentDirname, `./${file}.ttf`));
  }

  return {
    name: name,
    data: fontData,
  };
};

export const loadFonts = (): FontOptions[] => {
  const startTime = Date.now();
  const fonts = [
    {
      ...createFont('Denim', 'Denim-Regular'),
      weight: 400,
      style: 'normal',
    },
    {
      ...createFont('Denim', 'Denim-RegularItalic'),
      weight: 400,
      style: 'italic',
    },
    {
      ...createFont('Denim', 'Denim-SemiBold'),
      weight: 600,
      style: 'normal',
    },
    {
      ...createFont('Denim', 'Denim-SemiBoldItalic'),
      weight: 600,
      style: 'italic',
    },
  ];
  const endTime = Date.now();
  // eslint-disable-next-line no-console
  console.log('Font load time:', endTime - startTime, 'ms');
  return fonts as FontOptions[];
};
