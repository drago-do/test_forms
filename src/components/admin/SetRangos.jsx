"use client";
import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Button, TextField, Typography, Grid } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import { blue } from "@mui/material/colors";

function SimpleDialog(props) {
  const {
    control,
    handleSubmit,
    getValues,
    register,
    formState: { errors },
  } = useFormContext();

  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <section className="p-6">
        <DialogTitle>Define las escalas para esta prueba</DialogTitle>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              defaultValue={getValues("escalas.nivel") || 0}
              error={!!errors?.escalas?.nivel}
              helperText={errors?.escalas?.nivel?.message}
              {...register(`escalas.nivel`, {
                required: "Campo requerido",
                validate: {
                  isNumber: (value) => !isNaN(value) || "Debe ser un número",
                  isPositive: (value) =>
                    value >= 0 || "Debe ser mayor o igual a 0",
                },
              })}
              label="Numero de escalas"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            {Array.from({ length: getValues("escalas.nivel") || 0 }).map(
              (_, index) => {
                const nivel = getValues("escalas.nivel") || 0;
                const percentage = 100 / nivel;
                const startRange = Math.round(index * percentage);
                const endRange = Math.round((index + 1) * percentage) - 1;
                return (
                  <TextField
                    key={index}
                    className="my-4"
                    defaultValue={getValues(`escalas.escala.${index}`) || ""}
                    error={!!errors?.escalas?.escala?.[index]}
                    helperText={
                      errors?.escalas?.escala?.[index]?.message ||
                      `De ${startRange} a ${
                        endRange === 99 ? "100" : endRange
                      } porciento`
                    }
                    {...register(`escalas.escala.${index}`, {
                      required: "Campo requerido",
                    })}
                    label={`Escala ${index + 1}`}
                    fullWidth
                    variant="standard"
                  />
                );
              }
            )}
          </Grid>
          <section className="w-full flex justify-end px-3 ">
            <Button variant="text" color="primary" onClick={handleClose}>
              Guardar
            </Button>
          </section>
        </Grid>
      </section>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function SetRangos() {
  const { control, handleSubmit, getValues, watch, setValue } =
    useFormContext();
  const [escalas, setEscalas] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = (value) => {
    setOpen(false);
    if (value) {
      setSelectedValue(value);
    }
  };

  useEffect(() => {
    const nivel = getValues("escalas.nivel") || 0;
    const escalas = getValues("escalas.escala") || [];
    if (escalas?.length > nivel) {
      setValue("escalas.escala", escalas.slice(0, nivel));
    }
  }, [watch("escalas.nivel")]);

  return (
    <div>
      <section className="w-full flex flex-nowrap justify-between">
        <Typography variant="h6">
          Escala Actual: {getValues("escalas.nivel") || "No definida"}
        </Typography>
        {escalas.map((escala, index) => (
          <div
            key={index}
          >{`Nivel: ${escala.nivel}, Escala: ${escala.escala}`}</div>
        ))}
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Definir escalas
        </Button>
      </section>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
