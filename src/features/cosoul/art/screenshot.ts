import { launch } from 'puppeteer';

import { uploadImage } from '../../../../api-lib/s3';

// const BASE_URL = 'http://localhost:3000/cosoul/image/';
const BASE_URL = 'https://app.coordinape.com/cosoul/image/';

export async function screenshotCoSoul(tokenId: number): Promise<Buffer> {
  const browser = await launch({
    headless: 'new',
    args: ['--enable-gpu'],
  });
  const page: any = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  await page.goto(`${BASE_URL}${tokenId}`);

  const element = await page.$('#cosoulSolo');
  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  await delay(2000);
  const buffer = await element.screenshot();
  await browser.close();
  return buffer;
}

export async function storeCoSoulImage(tokenId: number) {
  const buffer = await screenshotCoSoul(tokenId);
  await uploadImage(`cosoul/${tokenId}.png`, buffer);
}
