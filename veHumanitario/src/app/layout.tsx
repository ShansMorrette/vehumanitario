import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import ThemeProvider from "./components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portal Humanitario - Personas Localizadas",
  description:
    "Portal humanitario gratuito para la centralización de datos sobre personas localizadas en hospitales, clínicas y sectores. Sin fines de lucro.",
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1e293b",
};

/*
 * Blocking inline script that sets dark class BEFORE first paint.
 * Reads localStorage → falls back to system preference → defaults light.
 * This prevents any flash-of-wrong-theme (FOUC).
 */
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch(e){}
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
