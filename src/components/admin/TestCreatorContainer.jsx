"use client";
import React from "react";
import { Grid, Container, Typography, Button, TextField } from "@mui/material";

import MaterialIcon from "./../../components/general/MaterialIcon";
import { FormProvider, useFormContext, useFieldArray } from "react-hook-form";
import SectionContainer from "./SectionContainer";
import SetRangos from "./SetRangos";
import QuestionsCategories from "./QuestionsCategories";
import { v4 as uuidv4 } from "uuid";

export default function Page({ maxValue }) {
  const methods = useFormContext();
  const tipoPrueba = methods.getValues("tipo");

  return (
    <>
      {tipoPrueba === "1" ? <SetRangos /> : <QuestionsCategories />}
      <SectionContainer />
    </>
  );
}
