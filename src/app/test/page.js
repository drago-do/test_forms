"use client";
import React from "react";
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
import { useForm, useFieldArray } from "react-hook-form";
import { ExpandMore } from "@mui/icons-material";

export default function Page({ valorMax = 5 }) {
  const methods = useForm({
    defaultValues: {
      sections: [],
    },
    mode: "all",
  });

  React.useEffect(() => {
    console.log(methods.getValues());
  }, [methods.watch()]);

  const { control, handleSubmit, register, watch, trigger, formState: { errors } } = methods;
  const { fields: sections, append, remove, update } = useFieldArray({
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
    const newSectionId = sections.length > 0 ? sections[sections.length - 1].id + 1 : 1; // Increment ID based on last section
    append({ ...sectionBase, id: newSectionId });
  };

  const deleteSectionHandler = (index) => {
    remove(index);
  };

  const addQuestionHandler = (index) => {
    const updatedQuestions = [
      ...sections[index].questions,
      { ...questionBase, id: sections[index].questions.length > 0 ? sections[index].questions[sections[index].questions.length - 1].id + 1 : 1 }, // Increment ID based on last question
    ];
    update(index, { ...sections[index], questions: updatedQuestions });
  };

  const deleteQuestionHandler = (sectionIndex, questionIndex) => {
    const updatedQuestions = sections[sectionIndex].questions.filter((_, idx) => idx !== questionIndex);
    update(sectionIndex, { ...sections[sectionIndex], questions: updatedQuestions });
  };

  const updateQuestionHandler = (sectionIndex, questionIndex, newName, isValid) => {
    const updatedQuestions = sections[sectionIndex].questions.map((question, idx) =>
      idx === questionIndex ? { ...question, texto: newName, validacion: isValid } : question // Allow updating text and validation
    );
    update(sectionIndex, { ...sections[sectionIndex], questions: updatedQuestions });
  };

  return (
    <Container maxWidth="md">
      {sections && sections.length > 0 ? (
        sections.map((section, index) => (
          <SectionOfTest
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
          <Typography variant="h6" className="text-center">Ups, parece que aun no tienes ninguna sección.</Typography>
          <MaterialIcon iconName="box" className="text-5xl"/>
        </div>
      )}
      <Grid item xs={12} className="w-full flex justify-center my-5">
        <Button variant="contained" color="primary" onClick={addSectionHandler}>
          <MaterialIcon iconName="add_notes" className="mr-3" />
          Agregar sección
        </Button>
      </Grid>
    </Container>
  );
}

const SectionOfTest = ({
  section,
  sectionIndex,
  addQuestionHandler,
  updateQuestionHandler,
  deleteQuestionHandler,
  deleteSectionHandler,
}) => {
  const { register, formState: { errors } } = useForm({ mode: "all" });

  return (
    <Container maxWidth="lg" className="my-5">
      <Paper elevation={3} className="p-3">
        <Grid container spacing={1} alignItems={"center"}>
          <Grid item xs={10}>
            <TextField
              error={!!errors?.sections?.[sectionIndex]?.name}
              defaultValue={section.name}
              helperText={errors?.sections?.[sectionIndex]?.name?.message}
              {...register(`sections.${sectionIndex}.name`, {
                required: "Campo requerido",
              })}
              {...register(`sections.${sectionIndex}.name`, {
                required: "Campo requerido",
                onChange: (e) => console.log("Section name changed:", e.target.value),
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
          <Accordion className="w-full">
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-label="Expand"
              aria-controls="-content"
              id="-header"
            >
              <Typography>Preguntas de sección</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid item xs={12}>
                {section?.questions && section?.questions.length > 0 ? (
                  section.questions.map((question, questionIndex) => (
                    <QuestionType1
                      key={questionIndex}
                      question={question}
                      questionIndex={questionIndex}
                      sectionIndex={sectionIndex}
                      updateQuestionHandler={updateQuestionHandler}
                      deleteQuestionHandler={deleteQuestionHandler}
                    />
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
                <Button variant="contained" color="primary" onClick={() => addQuestionHandler(sectionIndex)}>
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

const QuestionType1 = ({ question, questionIndex, sectionIndex,deleteQuestionHandler }) => {
  const { register, formState: { errors }, getValues } = useForm({ mode: "all" });

  return (
    <Container maxWidth="lg" className="border rounded-md my-2">
      <section>
        <Typography variant="body1" className="text-end">
          #{question?.id || 0}
        </Typography>
      </section>
      <TextField
        defaultValue={question?.texto} // Use defaultValue instead of value for controlled input
        error={!!errors?.[`sections.${sectionIndex}.questions.${questionIndex}.texto`]}
        helperText={errors?.[`sections.${sectionIndex}.questions.${questionIndex}.texto`]?.message}
        {...register(`sections.${sectionIndex}.questions.${questionIndex}.texto`, {
          required: "Campo requerido",
        })}
        label="Texto de la pregunta"
        fullWidth
        required
        variant="standard"
      />
      <FormControlLabel
        label={"¿Pregunta de validación?"}
        control={
          <Checkbox
            defaultChecked={getValues(`sections.${sectionIndex}.questions.${questionIndex}.validacion`) || false} // Use defaultChecked instead of checked
            {...register(`sections.${sectionIndex}.questions.${questionIndex}.validacion`)}
          />
        }
      />
      <Grid item xs={12} display={"flex"} justifyContent={"end"}>
        <IconButton
          onClick={() => deleteQuestionHandler(sectionIndex, questionIndex)}
          aria-label="delete"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Container>
  );
};
