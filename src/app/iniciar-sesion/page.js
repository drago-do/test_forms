"use client";
import React from "react";
import Container from "@mui/material/Container";
import IconApp from "./../../components/general/IconApp";
import { Typography, Grid, TextField, Button } from "@mui/material";

import { useForm } from "react-hook-form";

export default function Page() {
  const methods = useForm({ mode: "all" });
  //Deconstruccion de methods
  const {
    register,
    watch,
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

  return (
    <Container
      maxWidth="lg"
      className="flex flex-col flex-nowrap items-center h-svh justify-center"
    >
      <IconApp />
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        className="font-bold"
      >
        Inicio de sesión
      </Typography>
      <Container maxWidth="sm">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              error={!!errors?.documento?.format?.FSY2?.nombre}
              helperText={errors?.format?.documento?.FSY2?.nombre?.message}
              {...register("format.documento.FSY2.nombre", {
                required: "Campo requerido",
              })}
              label="Correo electronico"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={!!errors?.documento?.format?.FSY2?.nombre}
              helperText={errors?.format?.documento?.FSY2?.nombre?.message}
              {...register("format.documento.FSY2.nombre", {
                required: "Campo requerido",
              })}
              label="Contraseña"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} className="flex flex-col items-center">
            <Button variant="contained" color="primary">
              Ingresar
            </Button>
            <Button variant="text" color="primary" className="mt-12">
              Crear cuenta
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
}
