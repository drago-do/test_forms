"use client";
import React from "react";
import { Box, Container, Typography, useTheme } from "@mui/material";
import IconApp from "./IconApp"; // Ensure the correct import path

export default function TitlePage() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: theme.palette.primary.main,
        color: "primary.contrastText",
        py: 8,
        textAlign: "center",
        width: "100%",
      }}
    >
      <Container className="flex flex-col items-center w-full">
        <IconApp forceMode="dark" />
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Descubre Tu Propósito de Vida
        </Typography>
        <Typography variant="h5" paragraph>
          Te apoyamos a desarrollar tu carrera profesional y alcanzar tus sueños
        </Typography>
      </Container>
    </Box>
  );
}
