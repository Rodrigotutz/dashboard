import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export const dynamic = 'force-dynamic'; // Necessário para evitar cache

export async function POST(request: Request) {
  try {
    const { html, options } = await request.json();

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--font-render-hinting=none' // Melhora renderização de fontes
      ],
    });

    const page = await browser.newPage();

    // Configurar para usar fontes sans-serif como padrão
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    // Opções padrão para o PDF
    const pdfOptions = {
      format: 'A4' as const,
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      ...options
    };

    const pdf = await page.pdf(pdfOptions);
    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="document.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}