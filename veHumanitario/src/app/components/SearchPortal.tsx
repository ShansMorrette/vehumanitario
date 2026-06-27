"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface Persona {
  id: number;
  nombreCompleto: string;
  cedula: string | null;
  estatus: string;
  ubicacion: string;
  ultimaActualizacion: string;
}

function StatusBadge({ estatus }: { estatus: string }) {
  let classes = "";
  let icon = "";

  switch (estatus) {
    case "Hospitalizado":
      classes =
        "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/50";
      icon = "🏥";
      break;
    case "Localizado":
      classes =
        "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700/50";
      icon = "✅";
      break;
    case "En Verificación":
    default:
      classes =
        "bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700/50";
      icon = "🔍";
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      <span>{icon}</span>
      {estatus}
    </span>
  );
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

// SVG icons - zero dependency
function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
    >
      <path
        fillRule="evenodd"
        d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IdIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
    >
      <path
        fillRule="evenodd"
        d="M1 6a3 3 0 013-3h12a3 3 0 013 3v8a3 3 0 01-3 3H4a3 3 0 01-3-3V6zm4 1.5a2 2 0 114 0 2 2 0 01-4 0zm2 3a4 4 0 00-3.665 2.395.75.75 0 00.416 1A8.98 8.98 0 007 14.5a8.98 8.98 0 003.249-.605.75.75 0 00.416-1A4 4 0 007 10.5zm6-1a.75.75 0 01.75-.75h2a.75.75 0 010 1.5h-2a.75.75 0 01-.75-.75zm.75 2.75a.75.75 0 000 1.5h2a.75.75 0 000-1.5h-2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function SearchPortal() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const doSearch = useCallback(async (term: string) => {
    const cleaned = term.trim();
    if (cleaned.length < 2) {
      setResults([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    // Abort previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/buscar?q=${encodeURIComponent(cleaned)}`,
        { signal: controller.signal }
      );
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Error en la consulta.");
        setResults([]);
      } else {
        setResults(json.data);
        setError(null);
      }
      setHasSearched(true);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError("Error de conexión. Intente de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);

    // Debounce 300ms
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      doSearch(value);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    doSearch(query);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return (
    <>
      {/* MODULE B: Search */}
      <section className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-2 text-center text-xl font-bold text-slate-800 dark:text-slate-100 sm:text-2xl">
            <span className="mr-2">🔎</span>
            Buscador de Personas Localizadas
          </h2>
          <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Consulta en tiempo real la base de datos centralizada
          </p>

          <form onSubmit={handleSubmit} className="relative">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Busque por nombre completo o número de cédula..."
                  className="w-full rounded-xl border-2 border-slate-200 bg-white py-3.5 pl-11 pr-4 text-base text-slate-800 shadow-sm outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-blue-800 sm:px-8"
              >
                {loading ? (
                  <>
                    <span className="loader-spinner" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <SearchIcon />
                    Buscar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* MODULE C: Results */}
      <section className="w-full px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-300">
              ⚠️ {error}
            </div>
          )}

          {!hasSearched && !loading && (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-800/40">
              <div className="mx-auto mb-4 text-5xl">📋</div>
              <p className="text-base font-medium text-slate-500 dark:text-slate-400">
                Ingrese datos para iniciar la consulta
              </p>
              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                Puede buscar por nombre completo o cédula de identidad
              </p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <span className="loader-spinner-lg" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Consultando base de datos...
                </p>
              </div>
            </div>
          )}

          {hasSearched && !loading && results.length === 0 && !error && (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-800/40">
              <div className="mx-auto mb-4 text-5xl">🔍</div>
              <p className="text-base font-medium text-slate-500 dark:text-slate-400">
                No se encontraron resultados
              </p>
              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                Intente con otro nombre o número de cédula
              </p>
            </div>
          )}

          {hasSearched && !loading && results.length > 0 && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {results.length}{" "}
                  {results.length === 1
                    ? "resultado encontrado"
                    : "resultados encontrados"}
                </p>
                {results.length === 50 && (
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    (Máximo 50 resultados por consulta)
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {results.map((persona) => (
                  <article
                    key={persona.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/80 dark:hover:shadow-lg dark:hover:shadow-slate-900/30"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold leading-tight text-slate-800 dark:text-slate-100">
                        {persona.nombreCompleto}
                      </h3>
                      <StatusBadge estatus={persona.estatus} />
                    </div>

                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <IdIcon />
                        <span>
                          <span className="font-medium text-slate-500 dark:text-slate-400">
                            Cédula:
                          </span>{" "}
                          {persona.cedula || (
                            <span className="italic text-slate-400 dark:text-slate-500">
                              No registrada
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <LocationIcon />
                        <span>
                          <span className="font-medium text-slate-500 dark:text-slate-400">
                            Ubicación:
                          </span>{" "}
                          {persona.ubicacion}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <ClockIcon />
                        <span>
                          <span className="font-medium text-slate-500 dark:text-slate-400">
                            Actualizado:
                          </span>{" "}
                          {formatDate(persona.ultimaActualizacion)}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
