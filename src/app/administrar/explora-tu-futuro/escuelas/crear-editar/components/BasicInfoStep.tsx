import { Grid, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const BasicInfoStep = ({ control, errors }) => (
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
      <Controller
        name="nombreInstitucion"
        control={control}
        rules={{ required: "Este campo es requerido" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nombre de la Institución"
            fullWidth
            error={!!errors.nombreInstitucion}
            helperText={errors.nombreInstitucion?.message}
          />
        )}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Controller
        name="razonSocial"
        control={control}
        rules={{ required: "Este campo es requerido" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Razón Social"
            fullWidth
            error={!!errors.razonSocial}
            helperText={errors.razonSocial?.message}
          />
        )}
      />
    </Grid>
    <Grid item xs={12}>
      <Controller
        name="mejoraInstitucional"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <TextField
            {...field}
            label="Mejora Institucional"
            fullWidth
            error={!!errors.mejoraInstitucional}
            helperText={errors.mejoraInstitucional?.message}
            multiline
            rows={4}
          />
        )}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Controller
        name="campus.nombre"
        control={control}
        rules={{ required: "Este campo es requerido" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nombre del Campus"
            fullWidth
            error={!!errors.campus?.nombre}
            helperText={errors.campus?.nombre?.message}
          />
        )}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Controller
        name="campus.estado"
        control={control}
        rules={{ required: "Este campo es requerido" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Estado"
            fullWidth
            error={!!errors.campus?.estado}
            helperText={errors.campus?.estado?.message}
          />
        )}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Controller
        name="campus.municipio"
        control={control}
        rules={{ required: "Este campo es requerido" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Municipio"
            fullWidth
            error={!!errors.campus?.municipio}
            helperText={errors.campus?.municipio?.message}
          />
        )}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Controller
        name="campus.domicilio"
        control={control}
        rules={{ required: "Este campo es requerido" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Domicilio"
            fullWidth
            error={!!errors.campus?.domicilio}
            helperText={errors.campus?.domicilio?.message}
          />
        )}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Controller
        name="campus.codigoPostal"
        control={control}
        rules={{ required: "Este campo es requerido" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Código Postal"
            fullWidth
            error={!!errors.campus?.codigoPostal}
            helperText={errors.campus?.codigoPostal?.message}
          />
        )}
      />
    </Grid>
  </Grid>
);

export default BasicInfoStep; 