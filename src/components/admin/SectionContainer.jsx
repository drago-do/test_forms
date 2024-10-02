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
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  ExpandMore,
} from "@mui/icons-material";
import MaterialIcon from "./../../components/general/MaterialIcon";
import LinkInput from "./LinksTesting";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const SectionWithQuestions = () => {
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext();

  const {
    fields: sections,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `sections`,
  });
  const tipoPrueba = getValues("tipo");

  const getSectionBase = () => {
    return {
      name: "",
      link: null,
      questions: [
        {
          id: uuidv4(),
          texto: "",
          opciones:
            tipoPrueba === "2"
              ? [
                  {
                    id: uuidv4(),
                    texto: "",
                    valor: 1,
                    subcategoria: "",
                  },
                ]
              : [],
          tipo:
            tipoPrueba === "1"
              ? "escala"
              : tipoPrueba === "2"
              ? "opcion_multiple"
              : "verdadero_falso",
          validacion: false,
        },
      ],
    };
  };

  const addSection = () => {
    append(getSectionBase());
  };

  const deleteSection = (indexSection) => {
    if (sections.length > 1) {
      remove(indexSection);
    } else {
      toast.error("No te puedes quedar sin secciones");
    }
  };
  return (
    <>
      {sections && sections.length > 0 ? (
        sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <Container maxWidth="lg" className="my-5">
              <Paper elevation={3} className="p-3">
                <Grid container spacing={1} alignItems={"center"}>
                  <Grid item xs={10}>
                    <TextField
                      error={!!errors?.sections?.[sectionIndex]?.name}
                      defaultValue={section?.name}
                      helperText={
                        errors?.sections?.[sectionIndex]?.name?.message
                      }
                      {...register(`sections.${sectionIndex}.name`, {
                        required: "Campo requerido",
                      })}
                      label="Nombre de la sección"
                      color="secondary"
                      fullWidth
                      required
                      variant="standard"
                    />
                  </Grid>
                  <Grid item xs={2} display={"flex"} justifyContent={"end"}>
                    <IconButton
                      onClick={() => deleteSection(sectionIndex)}
                      aria-label="delete"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <LinkInput
                  sectionIndex={sectionIndex}
                  defaultValue={section?.link}
                />
                {tipoPrueba === "1" && (
                  <Grid item xs={12} className="mt-4">
                    <TextField
                      error={!!errors?.sections?.[sectionIndex]?.valorMax}
                      defaultValue={section.valorMax}
                      helperText={
                        errors?.sections?.[sectionIndex]?.valorMax?.message
                      }
                      {...register(`sections.${sectionIndex}.valorMax`, {
                        required: "Campo requerido",
                      })}
                      label="Valor máximo de la sección"
                      fullWidth
                      required
                      variant="standard"
                    />
                  </Grid>
                )}
              </Paper>
            </Container>
            <QuestionsType2 section={section} sectionIndex={sectionIndex} />
          </div>
        ))
      ) : (
        <Typography variant="body1">No hay secciones</Typography>
      )}
      <Grid item xs={12} className="w-full flex justify-center my-5">
        <Button variant="contained" color="primary" onClick={addSection}>
          <MaterialIcon iconName="add_notes" className="mr-3" />
          Agregar sección
        </Button>
      </Grid>
    </>
  );
};

const QuestionsType2 = ({ sectionIndex }) => {
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext();

  const {
    fields: questions,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions`,
  });

  const tipoPrueba = getValues("tipo");

  const addQuestionHandler = () => {
    append(getQuestionBase());
  };

  const deleteQuestionHandler = (questionIndex) => {
    if (questions.length > 1) {
      remove(questionIndex);
    } else {
      toast.error("No te puedes quedar sin preguntas en la sección.");
    }
  };

  const cloneQuestionHandler = (questionIndex) => {
    const clonedQuestion = getValues(
      `sections.${sectionIndex}.questions.${questionIndex}`
    );
    clonedQuestion.id = uuidv4();
    append(clonedQuestion);
  };

  const getQuestionBase = () => {
    return {
      id: uuidv4(),
      texto: "",
      opciones:
        tipoPrueba === "2"
          ? [
              {
                id: uuidv4(),
                texto: "",
                valor: 1,
                subcategoria: "",
              },
            ]
          : [],
      tipo: "opcion_multiple",
      validacion: false,
    };
  };

  return (
    <Container maxWidth="lg">
      {questions && questions.length > 0 ? (
        questions.map((question, questionIndex) => (
          <Container maxWidth="lg" key={questionIndex}>
            <TextField
              defaultValue={question?.texto || ""}
              {...register(
                `sections.${sectionIndex}.questions.${questionIndex}.texto`,
                {
                  required: {
                    message: `Debes ingresar un texto para la pregunta ${
                      questionIndex + 1
                    } de la seccion ${sectionIndex + 1}`,
                    value: true,
                  },
                }
              )}
              label="Texto de la pregunta"
              fullWidth
              required
              color="secondary"
              variant="standard"
            />
            <FormControlLabel
              label="¿Pregunta de validación?"
              color="secondary"
              control={
                <Checkbox
                  color="secondary"
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
            <QuestionOptionsType2
              sectionIndex={sectionIndex}
              questionIndex={questionIndex}
            />
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="end"
              className="mt-4"
            >
              <IconButton
                onClick={() => cloneQuestionHandler(questionIndex)}
                aria-label="clone"
              >
                <ContentCopyIcon />
              </IconButton>
              <IconButton
                onClick={() => deleteQuestionHandler(questionIndex)}
                aria-label="delete"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Container>
        ))
      ) : (
        <Typography variant="body1">No hay preguntas</Typography>
      )}
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
    </Container>
  );
};

const QuestionOptionsType2 = ({ sectionIndex, questionIndex }) => {
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext();

  const {
    fields: opciones,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions.${questionIndex}.opciones`,
  });

  const categorias = getValues("categorias");

  const tipoPrueba = getValues("tipo");
  let valorMax = getValues(`sections.${sectionIndex}.valorMax`);

  const addQuestionOption = () => {
    console.log("valorMax");
    console.log(valorMax);
    if (tipoPrueba === "2") {
      append(getQuestionOptionBase());
    } else if (tipoPrueba === "1" && valorMax > 0 && valorMax < 10) {
      const questions = getQuestionOptionBaseScala(valorMax);
      append(questions);
    } else {
      toast.error(
        "No puedes agregar preguntas a la seccion sin valor maximo de seccion."
      );
    }
  };

  const deleteQuestionOption = (questionOptionIndex) => {
    if (opciones.length > 1) {
      remove(questionOptionIndex);
    } else {
      toast.error("No te puedes quedar sin opciones para una pregunta");
    }
  };

  const getQuestionOptionBase = () => {
    return { id: uuidv4(), texto: "", valor: 1, subcategoria: "" };
  };

  const getQuestionOptionBaseScala = (valorMax) => {
    const opciones = [];
    for (let i = 1; i <= valorMax; i++) {
      opciones.push({
        id: uuidv4(),
        texto: "",
        valor: i,
        subcategoria: "",
      });
    }
    return opciones;
  };

  return (
    <>
      {opciones && opciones.length > 0 ? (
        opciones.map((opcion, opcionIndex) => (
          <Grid container spacing={2} alignItems="center" key={opcionIndex}>
            <Grid item xs={tipoPrueba === "1" ? 12 : 6}>
              <TextField
                {...register(
                  `sections.${sectionIndex}.questions.${questionIndex}.opciones.${opcionIndex}.texto`,
                  {
                    required: {
                      message: `El valor de la opción ${
                        opcionIndex + 1
                      } de la pregunta ${questionIndex + 1} de la seccion ${
                        sectionIndex + 1
                      } es obligatorio`,
                      value: true,
                    },
                  }
                )}
                fullWidth
                placeholder={`Ingrese el texto de la opción ${opcionIndex + 1}`}
                required
                variant="standard"
              />
            </Grid>
            {tipoPrueba !== "1" && categorias && categorias.length > 0 ? (
              <Grid item xs={5}>
                <Select
                  defaultValue=""
                  {...register(
                    `sections.${sectionIndex}.questions.${questionIndex}.opciones.${opcionIndex}.subcategoria`,
                    {
                      required: {
                        value: true,
                        message: `Es necesario seleccionar una subcategoria para la opcion ${
                          opcionIndex + 1
                        } de la pregunta ${questionIndex + 1} de la seccion ${
                          sectionIndex + 1
                        }`,
                      },
                    }
                  )}
                  fullWidth
                >
                  {categorias.map((categoria) =>
                    categoria.subcategorias.map((subcat, index) => (
                      <MenuItem
                        key={subcat}
                        value={subcat}
                        selected={index === 0}
                      >
                        {`${categoria?.nombre} - ${subcat}`}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </Grid>
            ) : (
              <>
                {tipoPrueba !== "1" && (
                  <Grid item xs={5}>
                    <Alert severity="warning">
                      Aún no se han agregado categorías y subcategorías
                    </Alert>
                  </Grid>
                )}
              </>
            )}
            {tipoPrueba !== "1" && (
              <Grid item xs={1}>
                <IconButton
                  onClick={() => deleteQuestionOption(opcionIndex)}
                  aria-label="delete"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        ))
      ) : (
        <Typography variant="body1">
          No hay opciones hasta que definas el valor maximo y des click en el
          boton
        </Typography>
      )}
      <Grid item xs={12} className="w-full flex justify-center my-5">
        {tipoPrueba === "1" ? (
          <Collapse in={opciones.length === 0}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => addQuestionOption()}
            >
              <MaterialIcon iconName="add" className="mr-2" />
              Agregar opcion
            </Button>
          </Collapse>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => addQuestionOption()}
          >
            <MaterialIcon iconName="add" className="mr-2" />
            Agregar opcion
          </Button>
        )}
      </Grid>
    </>
  );
};

export default SectionWithQuestions;
