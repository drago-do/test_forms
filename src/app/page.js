"use client";
import Image from "next/image";
import Container from "@mui/material/Container";
import MenuAppBar from "./../components/general/MenuAppBar";

export default function Home() {
  return (
    <Container maxWidth="lg">
      <MenuAppBar />

      <h1>Hello Next.js</h1>
      <h2>Welcome to Next.js</h2>
    </Container>
  );
}
