"use client";
import React, { useState } from "react";
import {
  Grid,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import MaterialIcon from "@/components/general/MaterialIcon";
import { useForm } from "react-hook-form";
import { ExpandMore } from "@mui/icons-material";

export default function Page() {
  const methods = useForm({ mode: "all" });
  //Deconstruccion de methods
  const {
    register,
    watch,
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

  const sectionBase = {
    id: 1,
    name: "Nombre por defecto",
    link: null,
    maxValue: 5,
    questions: [],
  };

  const questionBase = {
    texto: "",
    opciones: Array.from({ length: valorMax }, (_, index) => index + 1),
    tipo: "escala",
    validacion: false,
  };
  const [sections, setSections] = useState([]);

  const addSectionHandler = () => {
    setSections((prevSections) => [
      ...prevSections,
      { ...sectionBase, id: prevSections.length + 1 },
    ]);
  };

  const deleteSectionHandler = (idSection) => {
    setSections((prevSections) =>
      prevSections.filter((section) => section.id !== idSection)
    );
  };

  const updateSectionHandler = (idSection, sectionNewInfo) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === idSection ? { ...section, ...sectionNewInfo } : section
      )
    );
  };

  const addQuestionHandler = (idSection, questionText) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === idSection
          ? {
              ...section,
              questions: [
                ...section.questions,
                {
                  questionBase,
                },
              ],
            }
          : section
      )
    );
  };

  const deleteQuestionHandler = (idSection, questionIndex) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === idSection
          ? {
              ...section,
              questions: section.questions.filter(
                (_, index) => index !== questionIndex
              ),
            }
          : section
      )
    );
  };

  const updateQuestionHandler = (
    idSection,
    questionIndex,
    newName,
    isValid
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === idSection
          ? {
              ...section,
              questions: section.questions.map((question, index) =>
                index === questionIndex
                  ? { ...question, texto: newName, validacion: isValid }
                  : question
              ),
            }
          : section
      )
    );
  };

  return (
    <Container maxWidth="md">
      {sections && sections.length > 0 ? (
        <>
          {sections.map((section, index) => (
            <SectionOfTest
              key={index}
              section={sections}
              updateSectionHandler={updateSectionHandler}
              deleteSectionHandler={deleteSectionHandler}
              addQuestionHandler={addQuestionHandler}
              updateQuestionHandler={updateQuestionHandler}
              deleteQuestionHandler={deleteQuestionHandler}
            />
          ))}
        </>
      ) : (
        <div>Sin entradas</div>
      )}
      <Grid item xs={12} className="w-full flex justify-center my-5">
        <Button variant="contained" color="primary">
          <MaterialIcon iconName="add_notes" className="mr-3" />
          Agregar seccion
        </Button>
      </Grid>
    </Container>
  );
}

// esquemaDeSeccion : ({
//   id: 0,
//   name: "Nombre por defecto",
//   link: null,
//   maxValue: 5,
//   questions: [],
// });

const SectionOfTest = ({
  section,
  addQuestionHandler,
  updateQuestionHandler,
  deleteQuestionHandler,
  deleteSectionHandler,
  updateSectionHandler,
}) => {
  const methods = useForm({ mode: "all" });
  //Deconstruccion de methods
  const {
    register,
    watch,
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} className="p-3">
        <Grid container spacing={1} alignItems={"center"}>
          <Grid item xs={10}>
            <TextField
              error={!!errors?.sections?.[section.id]?.name}
              defaultValue={section.name}
              helperText={errors?.sections?.[section.id]?.name?.message}
              {...register(`sections.${section.id}.name`, {
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
              onClick={() => deleteSection(section.id)}
              aria-label="delete"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
          <Accordion className="w-full">
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-label="Expand"
              aria-controls="-content"
              id="-header"
            >
              <Typography>Preguntas de seccion</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid item xs={12}>
                {section?.questions && section?.length > 0 ? (
                  <>Hola</>
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
                        Añade nuevas preguntas con el boton de abajo
                      </Typography>
                    </div>
                    <QuestionType1 />
                  </section>
                )}
              </Grid>
              <Grid item xs={12} className="w-full flex justify-center my-5">
                <Button variant="contained" color="primary">
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

const QuestionType1 = () => {
  const methods = useForm({ mode: "all" });
  //Deconstruccion de methods
  const {
    register,
    getValues,
    watch,
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;
  return (
    <Container maxWidth="lg" className="border rounded-md my-2">
      <section>
        <Typography variant="body1" className="text-end">
          #12
        </Typography>
      </section>
      <TextField
        error={!!errors?.firstName}
        helperText={errors?.firstName?.message}
        {...register("firstName", {
          required: "Campo requerido",
        })}
        label="Nombre (s)"
        fullWidth
        required
        variant="standard"
      />
      <FormControlLabel
        label={"¿Pregunta de validación?"}
        className="w-full my-5"
        {...register("format.documento.generalesConcurso.proyectoActivo")}
        control={
          <Checkbox
            checked={
              getValues("format.documento.generalesConcurso.proyectoActivo") ||
              false
            }
          />
        }
      />
    </Container>
  );
};
