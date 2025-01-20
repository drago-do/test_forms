"use client";
import React, { useEffect, useState } from "react";
import useUser from "../../hook/useUser";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "../MuiTheme";

export default function Layout({ children }) {
  const { getUserRole } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  if (typeof window !== "undefined" && getUserRole() !== "Admin") {
    window.location.href = "/";
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <main>{children}</main>
    </ThemeProvider>
  );
}
