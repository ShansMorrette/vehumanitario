import SearchPortal from "./components/SearchPortal";
import ApiDocs from "./components/ApiDocs";
import ThemeToggle from "./components/ThemeToggle";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* MODULE A: Crisis Banner & Disclaimer */}
      <header className="relative w-full bg-slate-800 dark:bg-slate-900">
        {/* Theme toggle — absolute top-right */}
        <div className="absolute right-3 top-3 z-10 sm:right-5 sm:top-5">
          <ThemeToggle />
        </div>

        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-8 w-8 shrink-0 text-sky-400 sm:h-10 sm:w-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <h1 className="text-center text-xl font-bold text-white sm:text-2xl md:text-3xl">
              Portal Humanitario
            </h1>
          </div>
          <p className="text-center text-sm font-medium text-sky-300 sm:text-base">
            Registro Centralizado de Personas Localizadas
          </p>

          {/* Disclaimer */}
          <div className="mt-5 rounded-xl border border-slate-600 bg-slate-700/60 px-4 py-4 dark:border-slate-700 dark:bg-slate-800/60 sm:px-6">
            <p className="text-center text-xs leading-relaxed text-slate-300 sm:text-sm">
              Este portal es una iniciativa humanitaria, gratuita y sin fines de
              lucro para la centralización de datos sobre personas localizadas
              (clínicas, hospitales y sectores). La información es procesada
              mediante Inteligencia Artificial y verificación comunitaria.{" "}
              <strong className="text-amber-300">
                No se solicitan, ni se aceptan pagos ni donaciones de ningún
                tipo.
              </strong>
            </p>
          </div>
        </div>
      </header>

      {/* Modules B & C: Search + Results (Client Component) */}
      <SearchPortal />

      {/* MODULE D: API Documentation */}
      <ApiDocs />

      {/* Footer */}
      <footer className="mt-auto w-full border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-6 text-center sm:px-6">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Portal Humanitario — Iniciativa sin fines de lucro
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Datos procesados con IA y verificación comunitaria • Solo lectura
            pública
          </p>
        </div>
      </footer>
    </main>
  );
}
