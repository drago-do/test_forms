"use client";
import "./globals.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { createTheme } from "@mui/material/styles";
import localFont from "next/font/local";
import { esES } from "@mui/material/locale";
import { StyledEngineProvider } from "@mui/material/styles";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster, toast } from "sonner";
import "material-symbols";

const materialSymbols = localFont({
  variable: "--font-family-symbols", // Variable name (to reference after in CSS/styles)
  style: "normal",
  src: "./../../node_modules/material-symbols/material-symbols-outlined.woff2", // This is a reference to woff2 file from NPM package "material-symbols"
  display: "block",
  weight: "100 700",
});

export const theme = createTheme({
  esES,
  palette: {
    mode: "dark",
    primary: {
      main: "#0584a3",
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

export const ligthTeme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#00ccff",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ffeebc",
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
    // Aquí podrías usar algún mecanismo para detectar el tema preferido del usuario o del navegador
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  useEffect(() => {
    // define a custom handler function
    // for the contextmenu event
    const handleContextMenu = (e) => {
      // prevent the right-click menu from appearing
      e.preventDefault();
    };
    // attach the event listener to
    // the document object
    document.addEventListener("contextmenu", handleContextMenu);
    // clean up the event listener when
    // the component unmounts
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <html lang="es" className={`${materialSymbols.variable}`}>
      <Toaster richColors position="bottom-left" closeButton />
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={isDarkMode ? theme : ligthTeme}>
          {/* <Suspense fallback={<Loading />}> */}
          <body>
            {children}
            <SpeedInsights />
          </body>
          {/* </Suspense> */}
        </ThemeProvider>
      </StyledEngineProvider>
    </html>
  );
}
