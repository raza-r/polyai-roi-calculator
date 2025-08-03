import puppeteer, { Browser, Page } from 'puppeteer';

declare global {
  var browser: Browser;
  var page: Page;
}

beforeAll(async () => {
  global.browser = await puppeteer.launch({
    headless: false, // Set to true for CI/CD
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  global.page = await global.browser.newPage();
});

afterAll(async () => {
  if (global.browser) {
    await global.browser.close();
  }
});