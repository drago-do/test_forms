import React from "react";
import MenuAppBar from "../../../components/general/MenuAppBar";
import { Typography, Container } from "@mui/material";
import BusquedaComponent from "./components/BusquedaComponent";
export default function page() {
  return (
    <>
      <MenuAppBar title="Busqueda" />
      <Container maxWidth="lg">
        <BusquedaComponent />
      </Container>
    </>
  );
}
