"use client";
import Image from "next/image";
import Container from "@mui/material/Container";
import ContainerPruebasCarrousel from "@/components/home/ContainerPruebasCarrousel";
import Button from "@mui/material/Button";
import MenuAppBar from "@/components/general/MenuAppBar";
import IconApp from "@/components/general/IconApp";

export default function Home() {
  return (
    <>
      <MenuAppBar />
      <Container maxWidth="lg">
        <main className="flex flex-col w-full items-center">
          <IconApp />
          <ContainerPruebasCarrousel title={"Autoconocimiento"} />
          <ContainerPruebasCarrousel title={"vocacional"} />
          <Container maxWidth="xs" className="flex justify-center">
            <Button variant="contained" color="primary">
              Introducir codigo
            </Button>
          </Container>
        </main>
      </Container>
    </>
  );
}
