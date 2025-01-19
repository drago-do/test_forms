"use client";
import React, { useEffect, useState } from "react";
import useUser from "./../../../hook/useUser";
import MenuAppBar from "../../../components/general/MenuAppBar";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "../../MuiTheme";

export default function Layout({ children }) {
  const { isAuthenticated } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  if (!isAuthenticated()) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <main>
        <MenuAppBar title="Informacion usuario" />
        {children}
      </main>
    </ThemeProvider>
  );
}
