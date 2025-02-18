import { Grid, Button, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import { Types } from "mongoose";

const ProgramsStep = ({ control, fields, append, remove, carreras }) => (
  <Grid container spacing={2}>
    {fields.map((field, index) => (
      <Grid container spacing={2} key={field.id}>
        <Grid item xs={12} sm={6}>
          <Controller
            name={`programas.${index}.referenciaAEntrada`}
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={carreras}
                getOptionLabel={(option) => option.nombre}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seleccionar Carrera"
                    fullWidth
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name={`programas.${index}.nivelEstudios`}
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Nivel de Estudios" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="button" onClick={() => remove(index)}>
            Remove Program
          </Button>
        </Grid>
      </Grid>
    ))}
    <Grid item xs={12}>
      <Button
        type="button"
        onClick={() =>
          append({
            referenciaAEntrada: new Types.ObjectId(),
            nombre: "",
            nivelEstudios: "",
            areaEstudios: "",
            modalidad: "",
            rvoe: {
              tipo: "",
              estatus: "",
              numero: "",
              fechaOtorgamiento: null,
              fechaRetiro: null,
              motivoRetiro: "",
              autorizacionRevalidaciones: {
                autorizado: false,
                fechaAutorizacion: null,
                fechaRevocacion: null,
              },
            },
          })
        }
      >
        Add Program
      </Button>
    </Grid>
  </Grid>
);

export default ProgramsStep;
