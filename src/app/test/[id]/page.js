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
  Alert,
} from "@mui/material";
import { shuffle } from "lodash";
import useTest from "../../../hook/useTest";
import useUser from "../../../hook/useUser";
import useResults from "./../../../hook/useResults";
import PersonIcon from "@mui/icons-material/Person";
import ViewResults from "./../../../components/test/ViewResults";

import MaterialIcon from "./../../../components/general/MaterialIcon";
import FinalScreenTest from "./../../../components/test/FinalScreenTest";
import FullPageLoader from "./../../../components/general/FullPageLoader";

import { toast } from "sonner";

export default function TestForm({ params }) {
  const { createResult } = useResults();
  const { id } = params;
  const { getTestById } = useTest();
  const { getLoggedUserInfo, isAuthenticated } = useUser();
  const [activeStep, setActiveStep] = useState(0);
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testType, setTestType] = useState(1);
  const [resultId, setResultId] = useState(null);
  const [finalScreenState, setFinalScreenState] = useState("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const idUser = isAuthenticated();

  const userInfo = getLoggedUserInfo();

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  useEffect(() => {
    console.log(id);

    if (id) {
      const fetchTest = async () => {
        try {
          const testData = await getTestById(id);
          console.log(testData);
          setTest(testData);
          setTestType(testData?.documento?.tipo);

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
          const shuffledQuestions = shuffle(allQuestions);
          setQuestions(shuffledQuestions);

          const savedProgress = localStorage.getItem(`testProgress-${id}`);
          if (savedProgress) {
            const { savedStep, savedAnswers, savedQuestions } =
              JSON.parse(savedProgress);
            setActiveStep(savedStep);
            setAnswers(savedAnswers);
            setQuestions(savedQuestions);
            toast.info("Progreso de test recuperado.");
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching test:", error);
          setError("Error fetching test data.");
          setLoading(false);
        }
      };

      fetchTest();
    }
  }, []);

  useEffect(() => {
    if (activeStep > 0 && activeStep < steps.length - 1) {
      console.log(steps.length);
      console.log(activeStep);
      const saveProgress = () => {
        const progress = {
          savedStep: activeStep,
          savedAnswers: answers,
          savedQuestions: questions,
        };
        localStorage.setItem(`testProgress-${id}`, JSON.stringify(progress));
      };
      saveProgress();
    }
  }, [activeStep, answers, questions, id]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space" && answers[questions[activeStep - 1]?._id]) {
        if (activeStep < questions.length) {
          if (activeStep === steps?.length - 2 && !isSubmitting) {
            handleSubmit();
          } else {
            handleNext();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeStep, answers, questions, isSubmitting]);

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
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setFinalScreenState("loading");
      const user = getLoggedUserInfo();

      const response = await createResult({
        id_prueba: test?.documento?._id,
        id_user: user?._id,
        respuestas: answers,
      });

      if (response.success) {
        setResultId(response?.data?._id);
        setFinalScreenState("success");
        localStorage.removeItem(`testProgress-${id}`);
      } else {
        setFinalScreenState("error");
        console.error("Error submitting test results:", response.message);
        setError(`Error al subir el test. : \n ${response?.message || ""}`);
        console.log(response);
      }
    } catch (error) {
      setFinalScreenState("error");
      console.error("Error submitting test results:", error);
      setError("Error submitting test results.");
    }

    handleNext();
  };

  if (loading) {
    return <FullPageLoader open={true} />;
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
        <Card variant="outlined" sx={{ p: 3 }}>
          <CardContent>
            <Typography variant="h4" color="error" gutterBottom>
              Error
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              {error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()}
              sx={{ mt: 2 }}
            >
              Volver a cargar
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (!test) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
        <Card variant="outlined" sx={{ p: 3 }}>
          <CardContent>
            <Typography variant="h4" color="error" gutterBottom>
              Error cargando prueba
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Hubo un problema al cargar la prueba. Por favor, inténtelo de
              nuevo más tarde o contacte al soporte si el problema persiste.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()}
              sx={{ mt: 2 }}
            >
              Volver a cargar
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
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
            <Typography variant="h4" gutterBottom>
              {test?.documento?.titulo}
            </Typography>
            <Typography variant="body1" paragraph>
              {test?.documento?.descripcion}
            </Typography>
            <Typography variant="subtitle2">
              Instrucciones: {test?.documento?.instrucciones}
            </Typography>
          </CardContent>
          <ViewResults
            userId={userInfo?._id}
            testId={test?.documento?._id}
            simpleButton={false}
          />
        </Card>
      );
    } else if (step === steps.length - 1) {
      return (
        <FinalScreenTest
          state={finalScreenState}
          idResults={resultId}
          info={error || ""}
          tipo={parseInt(testType)}
          nombreTest={test?.documento?.titulo}
        />
      );
    } else {
      const question = questions[step - 1];
      return (
        <Container maxWidth="sm">
          <Card>
            <CardContent>
              <FormControl component="fieldset">
                <FormLabel component="legend" className="text-2xl mb-6">
                  {question?.texto}
                </FormLabel>
                <RadioGroup
                  value={answers[question?._id] || ""}
                  onChange={(e) => handleAnswer(question?._id, e.target.value)}
                >
                  {question.opciones.map((option) => (
                    <FormControlLabel
                      key={option.id}
                      value={
                        testType === 1 ? option.valor : option.subcategoria
                      }
                      control={<Radio />}
                      label={option?.texto}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Container>
      );
    }
  };

  return (
    <Container maxWidth="lg" className="pb-16">
      <Box sx={{ mt: 2, mb: 1 }}>{renderStepContent(activeStep)}</Box>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        {/* <Button
          color="inherit"
          disabled={activeStep === 0 || activeStep === steps.length - 1}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Regresar
        </Button> */}
        <Box sx={{ flex: "1 1 auto" }} />
        {activeStep === steps.length - 1 ? (
          <>
            <Button
              onClick={() => (window.location.href = "/usuario/" + idUser)}
              color="secondary"
            >
              <PersonIcon /> Mi perfil
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              color="secondary"
            >
              <MaterialIcon iconName="home" /> Inicio
            </Button>
          </>
        ) : (
          <Button
            onClick={
              activeStep === steps.length - 2 ? handleSubmit : handleNext
            }
            disabled={
              (activeStep !== 0 &&
                activeStep !== steps.length - 1 &&
                !answers[questions[activeStep - 1]._id]) ||
              (activeStep === steps.length - 2 && isSubmitting)
            }
            color="secondary"
          >
            {activeStep === steps.length - 2
              ? isSubmitting
                ? "Enviando..."
                : "Terminar"
              : "Siguiente"}
          </Button>
        )}
      </Box>
    </Container>
  );
}
