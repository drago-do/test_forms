"use client";
import React, { useEffect, useState } from "react";
import MenuAppBar from "../../components/general/MenuAppBar";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "../MuiTheme";

export default function PublicLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <main>
        <MenuAppBar title="Explora Tu Futuro" />
        {children}
      </main>
    </ThemeProvider>
  );
}
