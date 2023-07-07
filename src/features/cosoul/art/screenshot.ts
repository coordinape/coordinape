import { launch } from 'puppeteer';

async function run() {
  const browser = await launch({
    headless: 'new',
    args: ['--enable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  await page.goto('http://localhost:3000/cosoul/image/1');

  const element = await page.$('#cosoulSolo');
  await element?.screenshot({
    path: 'src/features/cosoul/art/screenshots/cosoul.png',
  });

  await page.screenshot({
    path: 'src/features/cosoul/art/screenshots/cosoul-screen.png',
  });

  browser.close();
}

run();

export default {};
