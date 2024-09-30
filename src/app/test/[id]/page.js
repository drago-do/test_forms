"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
  Container,
} from "@mui/material";
import { shuffle } from "lodash";
import useTest from "../../../hook/useTest";
import useUser from "../../../hook/useUser";
import useResults from "./../../../hook/useResults";

import MaterialIcon from "./../../../components/general/MaterialIcon";

export default function TestForm({ params }) {
  const { createResult } = useResults();
  const { id } = params;
  const { getTestById } = useTest();
  const { getLoggedUserInfo } = useUser();
  const [activeStep, setActiveStep] = useState(0);
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  useEffect(() => {
    if (id) {
      const fetchTest = async () => {
        try {
          const testData = await getTestById(id);
          console.log(testData);
          setTest(testData);

          // Flatten and shuffle questions
          const allQuestions =
            testData.documento.sections?.reduce((acc, section) => {
              return acc.concat(
                section.questions?.map((question) => ({
                  ...question,
                  sectionName: section.name,
                })) || []
              );
            }, []) || [];
          console.log("allQuestions");
          console.log(allQuestions);
          setQuestions(shuffle(allQuestions));

          setLoading(false);
        } catch (error) {
          console.error("Error fetching test:", error);
          setLoading(false);
        }
      };

      fetchTest();
    }
  }, [id]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    // Calculate score
    const totalScore = Object.entries(answers).reduce(
      (sum, [questionId, answer]) => {
        const question = questions.find((q) => q._id === questionId);
        const selectedOption = question.opciones.find((o) => o.id === answer);
        return sum + (selectedOption ? selectedOption.valor : 0);
      },
      0
    );

    setScore(totalScore);
    console.log("answers");
    console.log(answers);
    // Submit results to backend
    try {
      const user = getLoggedUserInfo();
      const response = await createResult({
        id_prueba: test?.documento?._id,
        id_user: user._id,
        respuestas: answers,
      });
      console.log(response);
    } catch (error) {
      console.error("Error submitting test results:", error);
    }

    handleNext();
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!test) {
    return <Typography>Error loading test.</Typography>;
  }

  const steps = [
    "Instructions",
    ...questions.map((_, index) => `Question ${index + 1}`),
    "Results",
  ];

  const renderStepContent = (step) => {
    if (step === 0) {
      return (
        <Card>
          <CardContent>
            <Typography variant="h3" gutterBottom>
              {test?.documento?.titulo}
            </Typography>
            <Typography variant="subtitle2" paragraph>
              {test?.documento?.descripcion}
            </Typography>
            <Typography variant="body1">
              Instrucciones: {test?.documento?.instrucciones}
            </Typography>
          </CardContent>
        </Card>
      );
    } else if (step === steps.length - 1) {
      return (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              ¡Felicidades por completar la prueba!
            </Typography>
            <Typography variant="caption"></Typography>
            <Typography variant="body1">Tu puntuación: {score}</Typography>
          </CardContent>
        </Card>
      );
    } else {
      const question = questions[step - 1];
      return (
        <Card>
          <CardContent>
            <FormControl component="fieldset">
              <FormLabel component="legend" className="text-2xl mb-6">
                {question.texto}
              </FormLabel>
              <RadioGroup
                value={answers[question._id] || ""}
                onChange={(e) => handleAnswer(question._id, e.target.value)}
              >
                {question.opciones.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.id}
                    control={<Radio />}
                    label={option.texto}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <Container maxWidth="lg">
      {/* <Stepper activeStep={activeStep} className="my-8">
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper> */}
      <Box sx={{ mt: 2, mb: 1 }}>{renderStepContent(activeStep)}</Box>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0 || activeStep === steps.length - 1}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Regresar
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        {activeStep === steps.length - 1 ? (
          <Button onClick={() => setActiveStep(0)}>
            <MaterialIcon iconName="home" /> Inicio
          </Button>
        ) : (
          <Button
            onClick={
              activeStep === steps.length - 2 ? handleSubmit : handleNext
            }
            disabled={
              activeStep !== 0 &&
              activeStep !== steps.length - 1 &&
              !answers[questions[activeStep - 1]._id]
            }
          >
            {activeStep === steps.length - 2 ? "Terminar" : "Siguiente"}
          </Button>
        )}
      </Box>
    </Container>
  );
}
