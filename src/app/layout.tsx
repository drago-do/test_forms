import React from "react";
import "./globals.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { StyledEngineProvider } from "@mui/material/styles";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import { Metadata } from "next";
import "material-symbols";
import localFont from "next/font/local";

const materialSymbols = localFont({
  variable: "--font-family-symbols",
  style: "normal",
  src: "./../../node_modules/material-symbols/material-symbols-outlined.woff2",
  display: "block",
  weight: "100 700",
});

// ✅ Configuración de metadata sin errores
export const metadata: Metadata = {
  title: "Will Be",
  description:
    "Te apoyamos a desarrollar tu carrera profesional y alcanzar tus sueños.",
  metadataBase: new URL("https://www.willbe.mx"),
  twitter: {
    card: "summary_large_image",
    title: "Will Be",
    description:
      "Te apoyamos a desarrollar tu carrera profesional y alcanzar tus sueños.",
    images: ["https://www.willbe.mx/CoverWeb.jpg"],
  },
  openGraph: {
    title: "Will Be",
    description:
      "Te apoyamos a desarrollar tu carrera profesional y alcanzar tus sueños.",
    url: "https://www.willbe.mx",
    siteName: "Will Be",
    type: "website",
    images: [
      {
        url: "https://www.willbe.mx/CoverWeb.jpg",
        width: 1200,
        height: 630,
        alt: "Imagen de portada de Will Be",
      },
    ],
  },
};

// ✅ El layout es un componente React funcional sin errores de TS
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={materialSymbols.variable}>
      <body>
        <StyledEngineProvider injectFirst>
          <Toaster richColors position="bottom-left" closeButton />
          {children}
          <SpeedInsights />
        </StyledEngineProvider>
      </body>
    </html>
  );
}
