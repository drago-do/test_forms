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
      className="flex flex-col flex-nowrap items-center my-16"
    >
      <IconApp />
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        className="font-bold"
      >
        Registrate
      </Typography>
      <Container maxWidth="sm">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              error={!!errors?.firstName}
              helperText={errors?.firstName?.message}
              {...register("firstName", {
                required: "Campo requerido",
              })}
              label="Nombre (s)"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={!!errors?.lastName}
              helperText={errors?.lastName?.message}
              {...register("lastName", {
                required: "Campo requerido",
              })}
              label="Apellidos"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={!!errors?.email}
              helperText={errors?.email?.message}
              {...register("email", {
                required: "Campo requerido",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Formato de correo inválido",
                },
              })}
              label="Correo electrónico"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={!!errors?.password}
              helperText={errors?.password?.message}
              {...register("password", {
                required: "Campo requerido",
              })}
              label="Contraseña"
              type="password"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={!!errors?.password2}
              helperText={errors?.password2?.message}
              {...register("password2", {
                required: "Campo requerido",
              })}
              label="Repite tu contraseña"
              type="password"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={!!errors?.phone}
              helperText={errors?.phone?.message}
              {...register("phone", {
                required: "Campo requerido",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Número de teléfono inválido",
                },
              })}
              label="Teléfono"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={!!errors?.currentSchool}
              helperText={errors?.currentSchool?.message}
              {...register("currentSchool", {
                required: "Campo requerido",
              })}
              label="Escuela actual"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={!!errors?.educationLevel}
              helperText={errors?.educationLevel?.message}
              {...register("educationLevel", {
                required: "Campo requerido",
              })}
              label="Nivel Educativo"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={!!errors?.generation}
              helperText={errors?.generation?.message}
              {...register("generation", {
                required: "Campo requerido",
              })}
              label="Generacion"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={!!errors?.grade}
              helperText={errors?.grade?.message}
              {...register("grade", {
                required: "Campo requerido",
              })}
              label="Grado"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={!!errors?.group}
              helperText={errors?.group?.message}
              {...register("group", {
                required: "Campo requerido",
              })}
              label="Grupo"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} className="flex flex-col items-center">
            <Button variant="contained" color="primary">
              Registrarse
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
}
