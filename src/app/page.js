"use client";
import React from "react";
import ContainerPruebasCarrousel from "./../components/home/ContainerPruebasCarrousel";
import Button from "@mui/material/Button";
import MenuAppBar from "./../components/general/MenuAppBar";
import LandingPage from "./../components/home/LandingPage";
import { Container } from "@mui/material";
import Footer from "./../components/general/Footer";
import useUser from "./../hook/useUser";
import TitlePage from "./../components/general/TitlePage";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "./MuiTheme";
import { useEffect, useState } from "react";

export default function Home() {
  const { getUserRole } = useUser();
  const [auth, setAuth] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setAuth(!!getUserRole());
  }, [getUserRole]);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <MenuAppBar title="Will be" />
      <TitlePage />
      <Container maxWidth="lg">
        <main className="flex flex-col w-full items-center">
          <LandingPage showPreview={!auth} showButton={auth} />
          {auth && (
            <>
              <ContainerPruebasCarrousel title={"Autoconocimiento"} type={1} />
              <ContainerPruebasCarrousel title={"vocacional"} type={2} />
              <Container maxWidth="xs" className="flex justify-center">
                <Button variant="contained" color="primary" className="my-16">
                  Introducir codigo
                </Button>
              </Container>
            </>
          )}
        </main>
      </Container>
      <Footer />
    </ThemeProvider>
  );
}
