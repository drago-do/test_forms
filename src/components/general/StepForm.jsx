"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Collapse,
  Typography,
  Alert,
  AlertTitle,
  Grid,
} from "@mui/material";
import Image from "next/image";
import UploadDocumentAnim from "./../../components/general/LoaderPencil";
import scrollTop from "./../../utils/ScrollTop";
import { useFormContext, Controller } from "react-hook-form";
import FinalScreen from "./../../components/admin/FinalScreen";
import InformacionPersonal from "./../../components/admin/MetadataTest";
import InformacionLaboral from "./../../components/admin/FinalScreen";
import NoPage from "./../general/FullPageLoader";

export default function Page({
  formTitle = "Default Title",
  formatCode = "Default",
  stepComponents = [
    { form: InformacionPersonal, name: "Información Personal" },
    { form: InformacionLaboral, name: "Laboral" },
  ],
  pathToDocument = {
    documentExist: false,
    view: `pdf/FPE1_1/ver-crear/vista/`,
    pdf: `pdf/FPE1_1/ver-crear/pdf/`,
  },
  textToStatusScreen = {
    titleMessage: "Mensaje por defecto",
    descriptionMessage: "Mensaje por defecto.",
    errorDescriptionMessage:
      "Comunícate con el administrador del proyecto, puedes incluir más información sobre este fallo si presionas <Ctrl + Mayus + C> y envías lo que hay en consola.",
  },
  uploadToDataBase = (data) => {
    console.log("Función por defecto");
    console.log(data);
  },
  step = 0,
  debug = false,
  edit,
}) {
  const [activeStep, setActiveStep] = useState(step);
  const [submitStatus, setSubmitStatus] = useState("loading");
  const [info, setInfo] = useState(null);
  const stepsToComplete = stepComponents?.length || 1;
  const [IDDocumentCreated, setIDDocumentCreated] = useState(null);
  const [errorMessages, setErrorMessages] = useState(null);
  const {
    watch,
    handleSubmit,
    trigger,
    getValues,
    dirtyFields,
    formState: { errors },
  } = useFormContext();

  const onSubmit = (data) => {
    scrollTop();
    uploadToDataBase(data, formatCode)
      .then((response) => {
        console.log(response);
        const { success } = response;
        if (success) {
          setSubmitStatus("success");
        } else {
          const { message } = response;
          setSubmitStatus("error");
          setInfo(message);
        }
      })
      .catch((error) => {
        console.log("Error al enviar los datos");
        console.log(error);
        setInfo(error);
        setSubmitStatus("error");
      });
  };

  useEffect(() => {
    if (debug) {
      console.log(getValues());
    }
  }, [watch()]);

  const getErrorMessages = (errorObj) => {
    let messages = [];
    const traverseErrors = (obj) => {
      for (const key in obj) {
        if (obj[key]?.message) {
          messages.push({
            path: camelCaseToCapitalizedSpaces(key),
            message: obj[key].message,
            ref: obj[key].ref,
          });
        } else if (typeof obj[key] === "object") {
          traverseErrors(obj[key]);
        }
      }
    };
    traverseErrors(errorObj);
    return messages;
  };

  useEffect(() => {
    const handleClick = () => {
      setTimeout(() => {
        setErrorMessages(getErrorMessages(errors));
      }, 200);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [errors]);

  function camelCaseToCapitalizedSpaces(camelCaseString) {
    const result = camelCaseString
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, function (str) {
        return str.toUpperCase();
      });
    return result;
  }

  function getStepContent(step) {
    const StepComponent = stepComponents[step]?.form;
    if (StepComponent) {
      return <StepComponent edit={edit} />;
    } else {
      return <NoPage />;
    }
  }

  const handleNext = async () => {
    const formIsComplete = await trigger();
    if (activeStep < stepsToComplete && formIsComplete) {
      scrollTop();
      setActiveStep(activeStep + 1);
    }
  };

  const goToIndex = async (index) => {
    const formIsComplete = await trigger();
    if (formIsComplete) {
      scrollTop();
      setActiveStep(index);
    }
  };

  const handleSendSubmit = async () => {
    const formIsComplete = await trigger();
    if (formIsComplete) {
      setActiveStep(activeStep + 1);
      onSubmit(getValues());
    }
  };

  const handleBack = () => {
    setSubmitStatus(null);
    if (activeStep > 0) {
      scrollTop();
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <Container component="main" maxWidth="lg" className="pb-14">
      <Typography component="h1" variant="h4">
        {formTitle}
      </Typography>
      <Stepper
        activeStep={activeStep}
        sx={{ pt: 3, pb: 2 }}
        className="overflow-x md:overflow-hidden mb-8"
      >
        {stepComponents.map((component, index) => (
          <Step key={component.name}>
            <StepLabel onClick={() => (edit ? goToIndex(index) : null)}>
              {component.name}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === stepComponents.length ? (
        <section className="w-full flex justify-center">
          <FinalScreen state={submitStatus} info={info} />
        </section>
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          {getStepContent(activeStep)}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "start",
            }}
          >
            <div className="flex flex-col flex-nowrap items-end">
              <Collapse in={errorMessages !== null}>
                {errorMessages?.length > 0 && (
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessages.map((error, index) => (
                      <div key={index}>
                        {index + 1}.-Error en el campo <b>{error?.path}</b> ,
                        {error.message}
                      </div>
                    ))}
                  </Alert>
                )}
              </Collapse>
              <section className="w-full flex justify-end flex-nowrap">
                {activeStep !== 0 && (
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 3, ml: 1 }}
                    disabled={Object.keys(errors).length !== 0}
                  >
                    Regresar
                  </Button>
                )}
                <Collapse in={activeStep < stepsToComplete - 1}>
                  <Button
                    variant="contained"
                    disabled={Object.keys(errors).length !== 0}
                    type="button"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 0 }}
                    color={"primary"}
                  >
                    Siguiente paso
                  </Button>
                </Collapse>
                <Collapse in={activeStep === stepsToComplete - 1}>
                  <Button
                    variant="contained"
                    disabled={Object.keys(errors).length !== 0}
                    type="submit"
                    sx={{ mt: 3, ml: 0 }}
                    color="secondary"
                    onClick={handleSendSubmit}
                  >
                    Enviar
                  </Button>
                </Collapse>
              </section>
            </div>
          </Box>
        </form>
      )}
    </Container>
  );
}
