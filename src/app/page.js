"use client";
import Image from "next/image";
import Container from "@mui/material/Container";
import ContainerPruebasCarrousel from "@/components/home/ContainerPruebasCarrousel";

export default function Home() {
  return (
    <Container maxWidth="lg">
      <main className="flex flex-col w-full items-center">
        <div className="w-16 h-16 rounded-full  bg-black dark:bg-white  my-3" />
        <ContainerPruebasCarrousel title={"Autoconocimiento"} />
        <ContainerPruebasCarrousel title={"vocacional"} />
      </main>
    </Container>
  );
}
