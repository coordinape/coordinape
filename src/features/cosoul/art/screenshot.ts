import chromium from '@sparticuz/chromium-min';
import { Browser, launch } from 'puppeteer-core';

import {
  CHROMIUM_BINARY_LOCATION,
  WEB_APP_BASE_URL,
} from '../../../../api-lib/config';
import { uploadImage } from '../../../../api-lib/s3';

const BASE_URL = WEB_APP_BASE_URL + '/cosoul/image/';

export async function screenshotCoSoul(tokenId: number): Promise<Buffer> {
  const local = !process.env.VERCEL;
  let browser: Browser;
  if (local) {
    browser = await launch({
      headless: false,
      args: ['--enable-gpu'],
      executablePath: CHROMIUM_BINARY_LOCATION,
    });
  } else {
    const executablePath = await chromium.executablePath(
      'https://coordinape-prod.s3.amazonaws.com/chromium-v115.0.0-pack.tar'
    );
    browser = await launch({
      headless: chromium.headless,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
    });
  }

  const page: any = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  await page.goto(`${BASE_URL}${tokenId}`);

  const element = await page.waitForSelector('#cosoulSolo.webglReady', {
    timeout: 10000,
  });

  const buffer = await element.screenshot();
  return buffer;
}

export async function storeCoSoulImage(tokenId: number) {
  // no-op in CI
  if (process.env.CI) return;

  const buffer = await screenshotCoSoul(tokenId);
  return await uploadImage(`cosoul/screenshots/${tokenId}.png`, buffer);
}
