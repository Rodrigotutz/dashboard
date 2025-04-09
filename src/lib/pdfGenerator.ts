import { chromium } from 'playwright-core';

export const generatePdf = async (html: string): Promise<Buffer> => {
  let browser;
  try {
    const launchOptions = process.env.VERCEL
      ? {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: '/usr/bin/chromium-browser',
        headless: true
      }
      : {
        args: [],
        headless: true
      };

    browser = await chromium.launch(launchOptions);
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle' });

    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
      printBackground: true
    });

    return pdf;
  } finally {
    if (browser) await browser.close();
  }
};