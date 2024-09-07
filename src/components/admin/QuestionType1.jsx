"use client";
import React, { useState, useEffect } from "react";
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
  Collapse,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import MaterialIcon from "@/components/general/MaterialIcon";
import { useFormContext } from "react-hook-form"; // Changed to useFormContext
import { ExpandMore } from "@mui/icons-material";

const QuestionType1 = ({
  question,
  questionIndex,
  sectionIndex,
  deleteQuestionHandler,
}) => {
  const {
    register,
    formState: { errors },
    getValues,
  } = useFormContext(); // Updated to use useFormContext
  const [focus, setFocus] = useState(false);

  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);

  // Function to handle clicks outside the component
  const handleClickOutside = (event) => {
    if (event.target.closest(".question-container") === null) {
      setFocus(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="question-container" onClick={handleFocus}>
      <Container maxWidth="lg" className="border rounded-md my-4 py-4">
        <section> 
          <Collapse in={focus}>
            <Typography variant="body1" className="text-end">
              #{question?.id || 0}
            </Typography>
          </Collapse>
        </section>
        <TextField
          defaultValue={question?.texto}
          error={
            !!errors?.[
              `sections.${sectionIndex}.questions.${questionIndex}.texto`
            ]
          }
          helperText={
            errors?.[
              `sections.${sectionIndex}.questions.${questionIndex}.texto`
            ]?.message
          }
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
        <FormControlLabel
          label={"¿Pregunta de validación?"}
          control={
            <Checkbox
              defaultChecked={
                getValues(
                  `sections.${sectionIndex}.questions.${questionIndex}.validacion`
                ) || false
              }
              {...register(
                `sections.${sectionIndex}.questions.${questionIndex}.validacion`
              )}
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
    </div>
  );
};

export default QuestionType1; // Added default export
