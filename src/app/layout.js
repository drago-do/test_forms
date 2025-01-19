"use client";
import "./globals.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import localFont from "next/font/local";
import { esES } from "@mui/material/locale";
import { StyledEngineProvider } from "@mui/material/styles";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster, toast } from "sonner";
import { metadata } from "./metadata";
import Head from "next/head";
import "material-symbols";

const materialSymbols = localFont({
  variable: "--font-family-symbols",
  style: "normal",
  src: "./../../node_modules/material-symbols/material-symbols-outlined.woff2",
  display: "block",
  weight: "100 700",
});

const theme = createTheme({
  esES,
  palette: {
    mode: "dark",
    primary: {
      main: "#004ebb",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ffd454",
      contrastText: "#000",
    },
    background: {
      default: "#fff",
    },
    text: {
      default: "#fff",
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#004ebb",
      contrastText: "#fff",
    },
    secondary: {
      main: "#2900BA",
      contrastText: "#fff",
    },
    background: {
      default: "#000",
    },
    text: {
      default: "#000",
    },
  },
});

export default function RootLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  return (
    <html lang="es" className={`${materialSymbols.variable}`}>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta
          property="og:description"
          content={metadata.openGraph.description}
        />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta
          property="og:image:width"
          content={metadata.openGraph.images[0].width.toString()}
        />
        <meta
          property="og:image:height"
          content={metadata.openGraph.images[0].height.toString()}
        />
        <meta
          property="og:image:alt"
          content={metadata.openGraph.images[0].alt}
        />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta
          name="twitter:description"
          content={metadata.twitter.description}
        />
        <meta name="twitter:image" content={metadata.twitter.images[0]} />
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={isDarkMode ? theme : lightTheme}>
          <body>
            <Toaster richColors position="bottom-left" closeButton />
            {children}
            <SpeedInsights />
          </body>
        </ThemeProvider>
      </StyledEngineProvider>
    </html>
  );
}
