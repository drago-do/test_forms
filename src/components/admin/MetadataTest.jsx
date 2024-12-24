import React, { useState, useEffect } from "react";
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
import Cookies from "js-cookie";

import { useFormContext, Controller } from "react-hook-form";

export default function MetadataTest() {
  const {
    control,
    register,
    watch,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext();

  const [estaEditando, setEstaEditando] = useState(
    getValues("editando") ? true : false
  );

  useEffect(() => {
    setEstaEditando(getValues("editando") ? true : false);
  }, [watch("editando")]);

  register("creado_por", {
    value: Cookies.get("_id") || null,
  });

  return (
    <>
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
              error={!!errors?.pregunta}
              helperText={errors?.pregunta?.message}
              {...register("pregunta", {
                required: "Nececitas colocar a que pregunta responde este test",
              })}
              label="Pregunta a la que responde (PDF)"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              error={!!errors?.descripcionPDF}
              helperText={errors?.pregunta?.descripcionPDF}
              {...register("descripcionPDF", {
                required:
                  "Nececitas colocar la descripcion que aparecera en este test",
              })}
              label="Descripcion (PDF)"
              fullWidth
              multiline
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
              defaultValue={"1"}
              control={control}
              rules={{ required: "Campo requerido." }}
              render={({ field }) => (
                <FormControl component="fieldset" error={!!errors?.tipo}>
                  <FormLabel component="legend" color="secondary">
                    Tipo de prueba
                  </FormLabel>
                  <RadioGroup {...field} row>
                    <FormControlLabel
                      value={"1"}
                      disabled={estaEditando}
                      control={<Radio color="secondary" />}
                      label="Interpretacion de Rangos (TEST 1)"
                      defaultChecked
                    />
                    <FormControlLabel
                      disabled={estaEditando}
                      value={"2"}
                      control={<Radio color="secondary" />}
                      label="Areas academicas (Test 2)"
                    />
                    <FormControlLabel
                      disabled={estaEditando}
                      value={"3"}
                      control={<Radio color="secondary" />}
                      label="Carreras (Test 3)"
                    />
                  </RadioGroup>
                  <FormHelperText>{errors?.tipo?.message}</FormHelperText>
                  {estaEditando && (
                    <FormHelperText>
                      No puedes modificar el tipo de test en el momento de
                      edición
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
