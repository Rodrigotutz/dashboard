import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { html } = await request.json();

    // Configuração otimizada para Vercel
    const browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
      executablePath: await chromium.executablePath(
        process.env.CHROMIUM_REVISION || '115.0.5790.170' // Versão explícita
      ),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
    });

    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"'
      }
    });

  } catch (error) {
    console.error('Erro na Vercel:', error);
    return NextResponse.json(
      {
        error: 'Erro ao gerar PDF na Vercel',
        solution: 'Verifique os logs ou contate o suporte',
        details: error instanceof Error ? error.message : JSON.stringify(error)
      },
      { status: 500 }
    );
  }
}