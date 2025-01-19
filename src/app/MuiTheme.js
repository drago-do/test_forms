"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { esES } from "@mui/material/locale";

export const darkTheme = createTheme({
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

export const lightTheme = createTheme({
  esES,
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
