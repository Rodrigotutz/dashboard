"use client";
import { useState } from "react";

export function PuppeteerPDFButton({
  html,
  title,
  author,
}: {
  html: string;
  title: string;
  author?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      const styledHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body {
                font-family: 'Helvetica', 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                padding: 5px;
                margin: 0 auto;
              }
              h1 {
                font-size: 24px;
                color: #222;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
                margin-bottom: 20px;
              }
              a {
                color: #0066cc;
                text-decoration: underline;
              }
              ul, ol {
                margin-left: 20px;
              }
              .author {
                font-size: 12px;
                color: #666;
                margin-top: 30px;
                border-top: 1px solid #eee;
                padding-top: 10px;
              }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <div>${html}</div>
            ${author ? `<div class="author">Publicado por: ${author}</div>` : ""}
          </body>
        </html>
      `;

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html: styledHtml,
          options: {
            format: "A4",
            margin: {
              top: "10mm",
              right: "10mm",
              bottom: "10mm",
              left: "10mm",
            },
            printBackground: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-col w-72">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200 w-auto"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Gerando PDF...
          </span>
        ) : (
          "Baixar PDF (Alta Qualidade)"
        )}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
