import { launch } from 'puppeteer';

async function run() {
  const browser = await launch({
    headless: 'new',
    args: ['--enable-gpu'],
  });
  const page: any = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  await page.goto('http://localhost:3000/cosoul/image/1');

  const element = await page.$('#cosoulSolo');
  await element?.screenshot({
    path: 'src/features/cosoul/art/screenshots/cosoul.png',
  });

  browser.close();
}

run();

export default {};
