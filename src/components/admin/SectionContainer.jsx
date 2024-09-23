"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Container,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  ExpandMore,
} from "@mui/icons-material";
import MaterialIcon from "./../../components/general/MaterialIcon";

// Default options for questions
const defaultOptions = [
  "Nunca",
  "Pocas Veces",
  "Algunas Veces",
  "Frecuentemente",
  "Siempre",
];

const SectionWithQuestions = ({
  section,
  sectionIndex,
  addQuestionHandler,
  updateQuestionHandler,
  deleteQuestionHandler,
  deleteSectionHandler,
  cloneQuestionHandler,
}) => {
  const {
    register,
    formState: { errors },
    getValues,
    control,
    setValue,
    watch,
  } = useFormContext();

  useEffect(() => {
    console.log("section.questions");
    console.log(section.questions);
  }, [section, sectionIndex]);

  const { fields, append } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions`,
  });

  return (
    <Container maxWidth="lg" className="my-5">
      <Paper elevation={3} className="p-3">
        {/* Section Header */}
        <Grid container spacing={1} alignItems={"center"}>
          <Grid item xs={10}>
            <TextField
              error={!!errors?.sections?.[sectionIndex]?.name}
              defaultValue={section.name}
              helperText={errors?.sections?.[sectionIndex]?.name?.message}
              {...register(`sections.${sectionIndex}.name`, {
                required: "Campo requerido",
              })}
              label="Nombre de la sección"
              fullWidth
              required
              variant="standard"
            />
          </Grid>
          <Grid item xs={2} display={"flex"} justifyContent={"end"}>
            <IconButton
              onClick={() => deleteSectionHandler(sectionIndex)}
              aria-label="delete"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Grid>

          {/* Max Value Input */}
          <Grid item xs={12}>
            <TextField
              className="my-6"
              error={!!errors?.sections?.[sectionIndex]?.valorMax}
              defaultValue={section?.valorMax || 5}
              helperText={errors?.sections?.[sectionIndex]?.valorMax?.message}
              {...register(`sections.${sectionIndex}.valorMax`, {
                required: "Campo requerido",
              })}
              label="Valor Maximo de sección"
              fullWidth
              required
              variant="standard"
              disabled={section.questions.length > 0}
            />
          </Grid>

          {/* Accordion for questions */}
          <Accordion className="w-full">
            <AccordionSummary expandIcon={<ExpandMore />} aria-label="Expand">
              <Typography>Preguntas de sección</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid item xs={12}>
                {section?.questions && section.questions.length > 0 ? (
                  section.questions.map((question, questionIndex) => (
                    <div className="question-container" key={questionIndex}>
                      <Collapse in={focus}>
                        <Typography variant="body1" className="text-end">
                          #{question?.id || 0}
                        </Typography>
                      </Collapse>

                      {/* Question Text Input */}
                      <TextField
                        defaultValue={question?.texto || ""}
                        {...register(
                          `sections.${sectionIndex}.questions.${questionIndex}.texto`,
                          {
                            required: "Campo requerido",
                          }
                        )}
                        label="Texto de la pregunta"
                        fullWidth
                        required
                        variant="standard"
                      />

                      {/* Validation Checkbox */}
                      <FormControlLabel
                        label="¿Pregunta de validación?"
                        control={
                          <Checkbox
                            defaultChecked={question?.validacion || false}
                            {...register(
                              `sections.${sectionIndex}.questions.${questionIndex}.validacion`
                            )}
                          />
                        }
                      />

                      <Typography variant="h6" className="mt-4">
                        Opciones
                      </Typography>

                      {/* Options for each question */}
                      {question?.opciones &&
                        question?.opciones?.length > 0 &&
                        question?.opciones?.map((field, optionIndex) => (
                          <Grid
                            container
                            spacing={2}
                            alignItems="center"
                            key={field.id}
                          >
                            <input
                              type="hidden"
                              defaultValue={optionIndex + 1}
                              {...register(
                                `sections.${sectionIndex}.questions.${questionIndex}.opciones.${optionIndex}.valor`,
                                {
                                  required: "Campo requerido",
                                }
                              )}
                            />
                            <Grid item xs={10}>
                              <TextField
                                {...register(
                                  `sections.${sectionIndex}.questions.${questionIndex}.opciones.${optionIndex}.texto`,
                                  {
                                    required: "Campo requerido",
                                  }
                                )}
                                label={`Opción ${optionIndex + 1}`}
                                fullWidth
                                required
                                variant="standard"
                              />
                            </Grid>
                          </Grid>
                        ))}

                      {/* Question Actions */}
                      <Grid
                        item
                        xs={12}
                        display="flex"
                        justifyContent="end"
                        className="mt-4"
                      >
                        <IconButton
                          onClick={() =>
                            cloneQuestionHandler(sectionIndex, questionIndex)
                          }
                          aria-label="clone"
                        >
                          <ContentCopyIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            deleteQuestionHandler(sectionIndex, questionIndex)
                          }
                          aria-label="delete"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </div>
                  ))
                ) : (
                  <section className="w-full">
                    <Typography variant="h5" className="text-center">
                      Parece que aun no hay preguntas
                    </Typography>
                    <div className="w-full">
                      <MaterialIcon
                        iconName="archive"
                        className="text-5xl text-center w-full"
                      />
                      <Typography
                        variant="caption"
                        className="text-center w-full"
                      >
                        Añade nuevas preguntas con el botón de abajo
                      </Typography>
                    </div>
                  </section>
                )}
              </Grid>
              <Grid item xs={12} className="w-full flex justify-center my-5">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addQuestionHandler(sectionIndex)}
                >
                  <MaterialIcon iconName="add" className="mr-2" />
                  Agregar pregunta
                </Button>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SectionWithQuestions;
