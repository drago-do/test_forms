"use client";
import React, { useState } from "react";
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
import useUser from "@/hook/useUser"; // Import the useUser hook
import FullPageLoader from "@/components/general/FullPageLoader";
import { useRouter } from "next/navigation";

export default function Page() {
  const { push } = useRouter();
  const methods = useForm({ mode: "all" });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { authenticateUser } = useUser(); // Destructure authenticateUser from useUser
  const [loader, setLoader] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);

  const onSubmit = async (data) => {
    setErrorPassword(false);
    setLoader(true);
    try {
      // Add a timer of 1.5 seconds before making the request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await authenticateUser(data.email, data.password);
      push("/");
      // Handle successful authentication (e.g., redirect or show a success message)
    } catch (error) {
      setErrorPassword(true);
      setLoader(false);
      console.error("Authentication failed:", error);
      // Handle authentication error (e.g., show an error message)
    }
  };

  return (
    <Container
      maxWidth="lg"
      className="flex flex-col flex-nowrap items-center h-svh justify-center"
    >
      <FullPageLoader open={loader} />
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
        <form onSubmit={handleSubmit(onSubmit)}>
          {" "}
          {/* Add form submission handler */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                error={!!errors?.email}
                helperText={errors?.email?.message}
                {...register("email", {
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
                error={!!errors?.password}
                helperText={errors?.password?.message}
                {...register("password", {
                  required: "Campo requerido",
                })}
                label="Contraseña"
                fullWidth
                type="password"
                required
                variant="standard"
              />
            </Grid>
            <Collapse in={errorPassword} className="w-full m-8">
              <Alert severity="error">Usuario o contraseña incorrectos.</Alert>
            </Collapse>
            <Grid item xs={12} className="flex flex-col items-center">
              <Button type="submit" variant="contained" color="primary">
                {" "}
                {/* Change to submit button */}
                Ingresar
              </Button>
              <Button variant="text" color="primary" className="mt-12">
                Crear cuenta
              </Button>
            </Grid>
          </Grid>
        </form>{" "}
        {/* Close the form */}
      </Container>
    </Container>
  );
}
