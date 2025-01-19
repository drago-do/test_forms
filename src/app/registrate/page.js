"use client";
import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import IconApp from "./../../components/general/IconApp";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Collapse,
} from "@mui/material";
import { useForm } from "react-hook-form";
import useUser from "./../../hook/useUser"; // Import the useUser hook
import FullPageLoader from "./../../components/general/FullPageLoader";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Import Toaster and toast from sonner
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "./../MuiTheme";

export default function Page() {
  const { push } = useRouter();
  const methods = useForm({ mode: "all" });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { createNewUser } = useUser(); // Destructure createNewUser from useUser
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  const onSubmit = async (data) => {
    setError(false);
    setLoader(true);
    try {
      // Add a timer of 1.5 seconds before making the request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await createNewUser(data);
      toast.success("Registro exitoso! Redirigiendo a inicio de sesión..."); // Notify user of successful registration
      setTimeout(() => {
        push("/iniciar-sesion"); // Redirect to login page after 5 seconds
      }, 5000);
    } catch (error) {
      setError(true);
      setLoader(false);
      toast.error("Error en el registro. Inténtalo de nuevo."); // Notify user of registration error
      console.error("Registration failed:", error);
    }
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Container
        maxWidth="lg"
        className="flex flex-col flex-nowrap items-center my-16"
      >
        <FullPageLoader open={loader} />
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
          <form onSubmit={handleSubmit(onSubmit)}>
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
              <Collapse in={error} className="w-full m-8">
                <Alert severity="error">
                  Error al registrarse. Inténtalo de nuevo.
                </Alert>
              </Collapse>
              <Grid item xs={12} className="flex flex-col items-center">
                <Button type="submit" variant="contained" color="primary">
                  Registrarse
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Container>
    </ThemeProvider>
  );
}
