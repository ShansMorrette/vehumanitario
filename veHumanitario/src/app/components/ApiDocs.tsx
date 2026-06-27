"use client";

import { useState } from "react";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-300 dark:text-slate-400 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
      <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
    </svg>
  );
}

const apiCode = `// 1. Instala el cliente (opcional, puedes usar fetch nativo)
// npm install @supabase/supabase-js

// ─── Opción A: Con Fetch nativo (recomendado) ───
async function buscarPersonas(termino) {
  const API_URL = window.location.origin + "/api/buscar";
  
  const response = await fetch(
    \`\${API_URL}?q=\${encodeURIComponent(termino)}\`
  );
  
  if (!response.ok) {
    throw new Error("Error en la consulta");
  }
  
  const { data } = await response.json();
  return data;
}

// Ejemplo de uso:
buscarPersonas("María").then(personas => {
  personas.forEach(p => {
    console.log(\`\${p.nombreCompleto} - \${p.estatus} - \${p.ubicacion}\`);
  });
});

// ─── Estructura de respuesta ───
// {
//   "data": [
//     {
//       "id": 1,
//       "nombreCompleto": "María Elena Rodríguez",
//       "cedula": "V-12345678",
//       "estatus": "Hospitalizado",
//       "ubicacion": "Hospital Central de Valencia",
//       "ultimaActualizacion": "2025-07-10T08:30:00.000Z"
//     }
//   ],
//   "error": null
// }`;

export default function ApiDocs() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section className="w-full px-4 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
          {/* Accordion Header */}
          <button
            onClick={() => setOpen(!open)}
            className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🔌</span>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Integración de API para portales aliados
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Conecta tu plataforma con nuestra base de datos pública en
                  minutos
                </p>
              </div>
            </div>
            <ChevronIcon open={open} />
          </button>

          {/* Accordion Body */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              open
                ? "max-h-[2000px] opacity-100"
                : "max-h-0 overflow-hidden opacity-0"
            }`}
          >
            <div className="border-t border-slate-100 px-6 py-6 dark:border-slate-700">
              {/* Endpoint box */}
              <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-800/40 dark:bg-blue-900/20">
                <h4 className="mb-1 text-sm font-semibold text-blue-800 dark:text-blue-300">
                  📡 Endpoint Público
                </h4>
                <code className="block break-all rounded bg-blue-100/70 px-3 py-2 font-mono text-sm text-blue-900 dark:bg-blue-900/40 dark:text-blue-200">
                  GET /api/buscar?q=TÉRMINO_DE_BÚSQUEDA
                </code>
              </div>

              {/* Parameters table */}
              <div className="mb-4 space-y-2">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Parámetros:
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-700">
                        <th className="pb-2 pr-4 font-semibold text-slate-600 dark:text-slate-300">
                          Parámetro
                        </th>
                        <th className="pb-2 pr-4 font-semibold text-slate-600 dark:text-slate-300">
                          Tipo
                        </th>
                        <th className="pb-2 font-semibold text-slate-600 dark:text-slate-300">
                          Descripción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 pr-4">
                          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-700 dark:text-slate-300">
                            q
                          </code>
                        </td>
                        <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">
                          string
                        </td>
                        <td className="py-2 text-slate-500 dark:text-slate-400">
                          Nombre completo o cédula (mínimo 2 caracteres)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Code example header + copy button */}
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Ejemplo en JavaScript:
                </h4>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  <CopyIcon />
                  {copied ? "¡Copiado!" : "Copiar"}
                </button>
              </div>

              {/* Code block */}
              <div className="overflow-x-auto rounded-xl bg-slate-900 p-4 dark:bg-slate-950">
                <pre className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                  <code>{apiCode}</code>
                </pre>
              </div>

              {/* Warning */}
              <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-300">
                <strong>⚠️ Límites:</strong> Máximo 50 resultados por consulta.
                La búsqueda mínima es de 2 caracteres. Esta API es de solo
                lectura y gratuita.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
