"use client";
import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Button, TextField, Typography, Grid, Paper } from "@mui/material";
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

export default function SetRangos() {
  const {
    getValues,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    const nivel = getValues("escalas.nivel") || 0;
    const escalas = getValues("escalas.escala") || [];
    escalas.forEach((_, index) => {
      if (escalas.length > nivel) {
        setValue(`sections.${index}.escala`, escalas.slice(0, nivel));
      }
    });
  }, [watch("escalas.nivel")]);
  return (
    <div>
      <TextField
        defaultValue={getValues("escalas.nivel") || 0}
        error={!!errors?.escalas?.nivel}
        helperText={errors?.escalas?.nivel?.message}
        {...register(`escalas.nivel`, {
          required: "Campo requerido",
          validate: {
            isNumber: (value) => !isNaN(value) || "Debe ser un número",
            isPositive: (value) => value >= 0 || "Debe ser mayor o igual a 0",
          },
        })}
        label="Número de escalas"
        fullWidth
        required
        variant="outlined"
      />
    </div>
  );
}
