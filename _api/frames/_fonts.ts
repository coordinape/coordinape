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

const createFont = (name: string, filename: string) => {
  // TODO: fix font loading in vercel, url fetching is very slow
  let fontData: ArrayBuffer;
  if (IS_LOCAL_ENV) {
    fontData = readFileSync(
      join(process.cwd(), 'public', 'fonts', `${filename}`)
    );
  } else {
    const currentFilename = fileURLToPath(import.meta.url);
    const currentDirname = dirname(currentFilename);
    fontData = readFileSync(join(currentDirname, `./${filename}`));
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
      ...createFont('Denim', 'Denim-Regular.ttf'),
      weight: 400,
      style: 'normal',
    },
    {
      ...createFont('Denim', 'Denim-RegularItalic.ttf'),
      weight: 400,
      style: 'italic',
    },
    {
      ...createFont('Denim', 'Denim-SemiBold.ttf'),
      weight: 600,
      style: 'normal',
    },
    {
      ...createFont('Denim', 'Denim-SemiBoldItalic.ttf'),
      weight: 600,
      style: 'italic',
    },
  ];
  const endTime = Date.now();
  // eslint-disable-next-line no-console
  console.log('Font load time:', endTime - startTime, 'ms');
  return fonts as FontOptions[];
};
