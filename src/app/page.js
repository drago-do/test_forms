"use client";
import React from "react";
import ContainerPruebasCarrousel from "./../components/home/ContainerPruebasCarrousel";
import Button from "@mui/material/Button";
import MenuAppBar from "./../components/general/MenuAppBar";
import LandingPage from "./../components/home/LandingPage";
import { Container } from "@mui/material";
import Footer from "./../components/general/Footer";
import useUser from "./../hook/useUser";

export default function Home() {
  const { getUserRole } = useUser();
  const [auth, setAuth] = React.useState(false);

  React.useEffect(() => {
    setAuth(!!getUserRole());
  }, [getUserRole]);

  return (
    <>
      <MenuAppBar title="Will be" />
      <Container maxWidth="lg">
        <main className="flex flex-col w-full items-center">
          <LandingPage showPreview={!auth} showButton={auth} />
          {auth && (
            <>
              <ContainerPruebasCarrousel title={"Autoconocimiento"} />
              <ContainerPruebasCarrousel title={"vocacional"} />
              <Container maxWidth="xs" className="flex justify-center">
                <Button variant="contained" color="primary">
                  Introducir codigo
                </Button>
              </Container>
            </>
          )}
        </main>
      </Container>
      <Footer />
    </>
  );
}
