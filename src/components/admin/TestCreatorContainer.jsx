"use client";
import React from "react";
import { Grid, Container, Typography, Button, TextField } from "@mui/material";

import MaterialIcon from "./../../components/general/MaterialIcon";
import { FormProvider, useFormContext, useFieldArray } from "react-hook-form";
import SectionContainer from "./SectionContainer";
import SetRangos from "./SetRangos";
import QuestionsCategories from "./QuestionsCategories";

export default function Page({ maxValue }) {
  const methods = useFormContext();
  const tipoPrueba = parseInt(methods?.getValues("tipo"));

  return (
    <Container maxWidth="md">
      {tipoPrueba === 1 ? <SetRangos /> : <QuestionsCategories />}
      <SectionContainer />
    </Container>
  );
}
