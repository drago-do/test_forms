import { Grid, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const ContactStep = ({ control }) => (
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
      <Controller
        name="contacto.telefono"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Teléfono" fullWidth />
        )}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Controller
        name="contacto.correo"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Correo Electrónico" fullWidth />
        )}
      />
    </Grid>
  </Grid>
);

export default ContactStep; 