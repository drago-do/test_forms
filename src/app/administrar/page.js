"use client";
import React from "react";
import Container from "@mui/material/Container";
import MenuAppBar from "@/components/general/MenuAppBar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MaterialIcon from "@/components/general/MaterialIcon";

export default function page() {
  return (
    <>
      <MenuAppBar />
      <Container maxWidth="md">
        <Typography variant="h2" className="mt-16 mb-3">
          Administracion de test
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="flex items-center"
        >
          <MaterialIcon iconName="add_notes" />
          Crear nuevo test
        </Button>
      </Container>
    </>
  );
}
