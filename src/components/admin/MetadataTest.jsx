import React from "react";
import MenuAppBar from "@/components/general/MenuAppBar";
import {
  Grid,
  Container,
  Typography,
  TextField,
  FormControl,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
  FormHelperText,
  Button,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";

export default function MetadataTest() {
  const methods = useForm({ mode: "all" });
  //Deconstruccion de methods
  const {
    control,
    register,
    watch,
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

  return (
    <>
      <MenuAppBar />
      <Container maxWidth="md">
        <Typography variant="h2" className="mt-16 mb-3 font-semibold">
          Crear nuevo test
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              error={!!errors?.titulo}
              helperText={errors?.titulo?.message}
              {...register("titulo", {
                required: "Campo requerido",
              })}
              label="Nombre"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              error={!!errors?.descripcion}
              helperText={errors?.descripcion?.message}
              {...register("descripcion", {
                required: "Campo requerido",
              })}
              label="Descripcion del test"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              error={!!errors?.instrucciones}
              helperText={errors?.instrucciones?.message}
              {...register("instrucciones", {
                required: "Campo requerido",
              })}
              label="Instrucciones del test"
              fullWidth
              multiline
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="tipo"
              defaultValue={1}
              control={control}
              rules={{ required: "Campo requerido." }}
              render={({ field }) => (
                <FormControl component="fieldset" error={!!errors?.tipo}>
                  <FormLabel component="legend">Tipo de prueba</FormLabel>
                  <RadioGroup {...field} row>
                    <FormControlLabel
                      value={1}
                      control={<Radio />}
                      defaultChecked
                      label="Interpretacion de Rangos (TEST 1)"
                    />
                    <FormControlLabel
                      value={2}
                      control={<Radio />}
                      label="Areas academicas (Test 2)"
                    />
                    <FormControlLabel
                      value={3}
                      control={<Radio />}
                      label="Porcentaje por carreras (Test 3)"
                    />
                  </RadioGroup>
                  <FormHelperText>{errors?.tipo?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
        <Container maxWidth="md" className="flex justify-end">
          <Button variant="contained" color="primary">
            Siguiente
          </Button>
        </Container>
      </Container>
    </>
  );
}
