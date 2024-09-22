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
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import MaterialIcon from "./../../components/general/MaterialIcon";
import { useFormContext } from "react-hook-form";
import { ExpandMore } from "@mui/icons-material";
import QuestionType from "./QuestionType1";

const SectionOfTest = ({
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
  } = useFormContext(); // Changed to useFormContext for consistency

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
          <Grid item xs={12}>
            <TextField
              className="my-6"
              error={!!errors?.sections?.[sectionIndex]?.valorMax}
              defaultValue={section.valorMax || 5}
              helperText={errors?.sections?.[sectionIndex]?.name?.valorMax}
              {...register(`sections.${sectionIndex}.valorMax`, {
                required: "Campo requerido",
              })}
              label="Valor Maximo de sección"
              fullWidth
              required
              variant="standard"
            />
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
                {section?.questions && section.questions.length > 0 ? (
                  section.questions.map((question, questionIndex) => (
                    <QuestionType
                      key={questionIndex}
                      question={question}
                      questionIndex={questionIndex}
                      sectionIndex={sectionIndex}
                      updateQuestionHandler={updateQuestionHandler}
                      deleteQuestionHandler={deleteQuestionHandler}
                      cloneQuestionHandler={cloneQuestionHandler}
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

export default SectionOfTest;
