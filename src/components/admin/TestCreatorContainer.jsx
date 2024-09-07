"use client";
import React from "react";
import { Grid, Container, Typography, Button } from "@mui/material";

import MaterialIcon from "@/components/general/MaterialIcon";
import { FormProvider, useFormContext, useFieldArray } from "react-hook-form";
import SectionContainer from "./SectionContainer";
import SetRangos from "./SetRangos";

export default function Page({ valorMax = 5 }) {
  const methods = useFormContext();

  React.useEffect(() => {
    console.log(methods.getValues());
  }, [methods.watch()]);

  const {
    control,
    handleSubmit,
    clearErrors,
    register,
    watch,
    trigger,
    formState: { errors },
  } = methods;
  const {
    fields: sections,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: "sections",
  });

  const sectionBase = {
    id: 0, // Start IDs from 0
    name: "Nombre por defecto",
    link: null,
    maxValue: 5,
    questions: [],
  };

  const questionBase = {
    id: 0, // Start IDs from 0
    texto: "",
    opciones: Array.from({ length: valorMax }, (_, index) => index + 1),
    tipo: "escala",
    validacion: false,
  };

  const addSectionHandler = () => {
    const newSectionId =
      sections.length > 0 ? sections[sections.length - 1].id + 1 : 1; // Increment ID based on last section
    append({ ...sectionBase, id: newSectionId });
  };

  const deleteSectionHandler = (index) => {
    clearErrors();
    remove(index);
  };

  const addQuestionHandler = (index) => {
    const updatedQuestions = [
      ...sections[index].questions,
      {
        ...questionBase,
        id:
          sections[index].questions.length > 0
            ? sections[index].questions[sections[index].questions.length - 1]
                .id + 1
            : 1,
      }, // Increment ID based on last question
    ];
    update(index, { ...sections[index], questions: updatedQuestions });
  };

  const deleteQuestionHandler = (sectionIndex, questionIndex) => {
    clearErrors();
    const updatedQuestions = sections[sectionIndex].questions.filter(
      (_, idx) => idx !== questionIndex
    );
    update(sectionIndex, {
      ...sections[sectionIndex],
      questions: updatedQuestions,
    });
  };

  const updateQuestionHandler = (
    sectionIndex,
    questionIndex,
    newName,
    isValid
  ) => {
    const updatedQuestions = sections[sectionIndex].questions.map(
      (question, idx) =>
        idx === questionIndex
          ? { ...question, texto: newName, validacion: isValid }
          : question // Allow updating text and validation
    );
    update(sectionIndex, {
      ...sections[sectionIndex],
      questions: updatedQuestions,
    });
  };

  return (
    <>
      <SetRangos />
      {sections && sections.length > 0 ? (
        sections.map((section, index) => (
          <SectionContainer
            key={index}
            section={section}
            sectionIndex={index}
            updateSectionHandler={update}
            deleteSectionHandler={deleteSectionHandler}
            addQuestionHandler={addQuestionHandler}
            updateQuestionHandler={updateQuestionHandler}
            deleteQuestionHandler={deleteQuestionHandler}
          />
        ))
      ) : (
        <div className="flex flex-col flex-nowrap w-full my-6 items-center">
          <Typography variant="h6" className="text-center">
            Ups, parece que aun no tienes ninguna sección.
          </Typography>
          <MaterialIcon iconName="box" className="text-5xl" />
        </div>
      )}
      <Grid item xs={12} className="w-full flex justify-center my-5">
        <Button variant="contained" color="primary" onClick={addSectionHandler}>
          <MaterialIcon iconName="add_notes" className="mr-3" />
          Agregar sección
        </Button>
      </Grid>
    </>
  );
}
