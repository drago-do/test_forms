"use client";
import React from "react";
import { Grid, Container, Typography, Button, TextField } from "@mui/material";

import MaterialIcon from "./../../components/general/MaterialIcon";
import { FormProvider, useFormContext, useFieldArray } from "react-hook-form";
import SectionContainer from "./SectionContainer";
import SetRangos from "./SetRangos";
import Cookies from "js-cookie";

export default function Page({}) {
  const methods = useFormContext();

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
    questions: [],
  };

  const createdBy = Cookies.get("_id") || null;

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
    const questionBase = {
      id: 0, // Start IDs from 0
      texto: "",
      // opciones: Array.from(
      //   { length: methods.getValues(`sections.${index}.valorMax`) },
      //   (_, index2) => index2 + 1
      // ),
      tipo: "escala",
      validacion: false,
    };

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

  const cloneQuestionHandler = (sectionIndex, questionIndex) => {
    const questionToClone = sections[sectionIndex].questions[questionIndex];
    const clonedQuestion = {
      ...questionToClone,
      id:
        sections[sectionIndex].questions.length > 0
          ? sections[sectionIndex].questions[
              sections[sectionIndex].questions.length - 1
            ].id + 1
          : 1,
    };
    const updatedQuestions = [
      ...sections[sectionIndex].questions,
      clonedQuestion,
    ];
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
      <Grid item xs={12}>
        <TextField
          type="hidden"
          defaultValue={createdBy}
          {...register("creado_por")}
        />
      </Grid>
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
            cloneQuestionHandler={cloneQuestionHandler}
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
