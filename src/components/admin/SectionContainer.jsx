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
  Dialog,
  DialogTitle,
} from "@mui/material";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
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
    clearErrors,
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
  const tipoPrueba = parseInt(getValues("tipo"));

  const getSectionBase = () => {
    return {
      name: "",
      link: null,
      questions: [
        {
          id: uuidv4(),
          texto: "",
          opciones:
            tipoPrueba === 2
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
            tipoPrueba === 1
              ? "escala"
              : tipoPrueba === 2
              ? "opcion_multiple"
              : "verdadero_falso",
          validacion: false,
        },
      ],
    };
  };

  const addSection = () => {
    append(getSectionBase());
    clearErrors();
  };

  const deleteSection = (indexSection) => {
    if (sections.length > 1) {
      remove(indexSection);
    } else {
      toast.error("No te puedes quedar sin secciones");
    }
    clearErrors();
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
                {tipoPrueba === 1 && (
                  <LinkInput
                    sectionIndex={sectionIndex}
                    defaultValue={section?.link}
                  />
                )}
                {tipoPrueba === 1 && (
                  <EscalaPorSeccion sectionIndex={sectionIndex} />
                )}
                {tipoPrueba === 1 && (
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
                      label="Valor máximo por item de la sección actual"
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
    clearErrors,
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

  const tipoPrueba = parseInt(getValues("tipo"));

  const addQuestionHandler = () => {
    append(getQuestionBase());
    clearErrors();
  };

  const deleteQuestionHandler = (questionIndex) => {
    if (questions.length > 1) {
      remove(questionIndex);
    } else {
      toast.error("No te puedes quedar sin preguntas en la sección.");
    }
    clearErrors();
  };

  const cloneQuestionHandler = (questionIndex) => {
    const clonedQuestion = getValues(
      `sections.${sectionIndex}.questions.${questionIndex}`
    );
    clonedQuestion.id = uuidv4();
    append(clonedQuestion);
    clearErrors();
  };

  const getQuestionBase = () => {
    return {
      id: uuidv4(),
      texto: "",
      opciones:
        tipoPrueba === 2
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
            {tipoPrueba === 1 && (
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
            )}
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
    clearErrors,
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

  const tipoPrueba = parseInt(getValues("tipo"));
  let valorMax = getValues(`sections.${sectionIndex}.valorMax`);

  const addQuestionOption = () => {
    console.log("valorMax");
    console.log(valorMax);
    if (tipoPrueba === 2) {
      append(getQuestionOptionBase());
    } else if (tipoPrueba === 1 && valorMax > 0 && valorMax < 10) {
      const questions = getQuestionOptionBaseScala(valorMax);
      append(questions);
    } else {
      toast.error(
        "No puedes agregar preguntas a la seccion sin valor maximo de seccion."
      );
    }
    clearErrors();
  };

  const deleteQuestionOption = (questionOptionIndex) => {
    if (opciones.length > 1) {
      remove(questionOptionIndex);
    } else {
      toast.error("No te puedes quedar sin opciones para una pregunta");
    }
    clearErrors();
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
            <Grid item xs={tipoPrueba === 1 ? 12 : 6}>
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
            {tipoPrueba !== 1 && categorias && categorias.length > 0 ? (
              <Grid item xs={5}>
                <Controller
                  name={`sections.${sectionIndex}.questions.${questionIndex}.opciones.${opcionIndex}.subcategoria`}
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: `Es necesario seleccionar una subcategoria para la opcion ${
                        opcionIndex + 1
                      } de la pregunta ${questionIndex + 1} de la seccion ${
                        sectionIndex + 1
                      }`,
                    },
                  }}
                  render={({ field }) => (
                    <Select {...field} fullWidth>
                      {categorias.map((categoria) =>
                        categoria.subcategorias.map((subcat, index) => (
                          <MenuItem key={subcat} value={subcat}>
                            {`${categoria?.nombre} - ${subcat}`}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  )}
                />
              </Grid>
            ) : (
              <>
                {tipoPrueba !== 1 && (
                  <Grid item xs={5}>
                    <Alert severity="warning">
                      Aún no se han agregado categorías y subcategorías
                    </Alert>
                  </Grid>
                )}
              </>
            )}
            {tipoPrueba !== 1 && (
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
        {tipoPrueba === 1 ? (
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

const EscalaPorSeccion = ({ sectionIndex }) => {
  // `sections.${sectionIndex}.valorMax`;
  const {
    getValues,
    setValue,
    register,
    watch,
    unregister,
    formState: { errors },
  } = useFormContext();

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = (value) => {
    setOpen(false);
  };

  useEffect(() => {
    const nivel = getValues("escalas.nivel") || 0;
    const escalas = getValues(`sections.${sectionIndex}.escala`) || [];
    if (escalas?.length > nivel) {
      setValue(`sections.${sectionIndex}.escala`, escalas.slice(0, nivel));
      unregister(`sections.${sectionIndex}.escala`);
    }
  }, [watch("escalas.nivel")]);

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Definir escalas
      </Button>
      <Dialog onClose={handleClose} open={open}>
        <section className="p-6">
          <DialogTitle>Define las escalas para esta prueba</DialogTitle>
          <Grid item xs={12}>
            {Array.from({ length: getValues(`escalas.nivel`) || 0 }).map(
              (_, index) => {
                const nivel = getValues("escalas.nivel") || 0;
                const percentage = 100 / nivel;
                const startRange = Math.round(index * percentage);
                const endRange = Math.round((index + 1) * percentage) - 1;
                return (
                  <TextField
                    key={index}
                    className="my-4"
                    defaultValue={
                      getValues(`sections.${sectionIndex}.escala.${index}`) ||
                      ""
                    }
                    error={!!errors?.sections?.[sectionIndex]?.escala?.[index]}
                    helperText={
                      errors?.sections?.[sectionIndex]?.escala?.[index]
                        ?.message ||
                      `De ${startRange} a ${
                        endRange === 99 ? "100" : endRange
                      } porciento`
                    }
                    {...register(`sections.${sectionIndex}.escala.${index}`, {
                      required: "Campo requerido",
                    })}
                    label={`Escala ${index + 1}`}
                    fullWidth
                    variant="standard"
                  />
                );
              }
            )}
            <section className="w-full flex justify-end px-3 ">
              <Button variant="text" color="primary" onClick={handleClose}>
                Guardar
              </Button>
            </section>
          </Grid>
        </section>
      </Dialog>
    </>
  );
};

export default SectionWithQuestions;
