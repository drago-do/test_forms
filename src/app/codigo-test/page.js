"use client";
import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { TextField, Grid, Button } from "@mui/material";

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
      maxWidth="md"
      className="h-svh flex flex-col flex-nowrap justify-center items-center"
    >
      <Typography variant="h3">Ingresar a test con codigo</Typography>
      <Typography variant="body1">
        Ingresa el codigo para acceder a el test.
      </Typography>
      <Grid container spacing={2} className="flex justify-center my-24">
        <Grid item xs={6}>
          <TextField
            error={!!errors?.code}
            helperText={errors?.code?.message}
            {...register("code", {
              required: "Nececitas introduicir el codigo para acceder al test",
            })}
            label="Codigo"
            fullWidth
            required
            variant="standard"
          />
        </Grid>
      </Grid>
      <Button variant="contained" color="primary">
        Ingresar a test
      </Button>
    </Container>
  );
}
