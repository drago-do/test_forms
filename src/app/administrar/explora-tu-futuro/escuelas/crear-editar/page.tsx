"use client";
import { useState, useEffect, Suspense } from "react";
import {
  FormProvider,
  useForm,
  Controller,
  useFieldArray,
} from "react-hook-form";
import {
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";
import {
  School,
  YouTube,
  Description,
  Work,
  EmojiObjects,
  Build,
  BusinessCenter,
  Star,
} from "@mui/icons-material";
import useEscuelas from "../../../../../hook/useEscuelas";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import VideoInput from "../../../../../components/explora-tu-futuro/VideoInput";
import RichTextEditor from "../../../../../components/general/RichTextEditor";
import FullPageLoader from "../../../../../components/general/FullPageLoader";
import SearchImage from "../../../../../components/general/SearchImage";
import MenuAppBar from "../../../../../components/general/MenuAppBar";
import { IEscuela } from "../../../../../types/escuela";
import Autocomplete from "@mui/material/Autocomplete";
import { Carrera } from "../../../../../models/carrera";
import { Types } from "mongoose";
import BasicInfoStep from "./components/BasicInfoStep";
import ContactStep from "./components/ContactStep";
import ProgramsStep from "./components/ProgramsStep";
import MultimediaStep from "./components/MultimediaStep";
import AdditionalInfoStep from "./components/AdditionalInfoStep";
import PantallaFinal from "./components/FinalScreen";

const steps = [
  { label: "Información Básica", icon: <School /> },
  { label: "Contacto", icon: <Description /> },
  { label: "Programas", icon: <Work /> },
  { label: "Multimedia", icon: <YouTube /> },
  { label: "Información Adicional", icon: <EmojiObjects /> },
];

function EscuelaForm() {
  const methods = useForm<IEscuela>({ mode: "all" });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "programas",
  });
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalScreen, setFinalScreen] = useState({
    status: "success",
    show: false,
  });
  const { createEscuela, updateEscuela, getEscuelaById } = useEscuelas();
  const params = useSearchParams();
  const idEscuela = params.get("id");
  const [carreras, setCarreras] = useState([]);

  useEffect(() => {
    if (idEscuela) {
      setLoading(true);
      getEscuelaById(idEscuela)
        .then((escuela) => {
          methods.reset(escuela);
        })
        .catch((error) => {
          console.error("Error fetching escuela:", error);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [idEscuela, getEscuelaById, methods]);

  useEffect(() => {
    // Fetch available Carreras
    Carrera.find()
      .then(setCarreras)
      .catch((error) => {
        console.error("Error fetching carreras:", error);
      });
  }, []);

  const onSubmit = async (data: IEscuela) => {
    setIsSubmitting(true);
    try {
      if (idEscuela) {
        await updateEscuela(idEscuela, data);
        console.log("Escuela updated successfully");
        setFinalScreen({ status: "success", show: true });
      } else {
        await createEscuela(data);
        console.log("Escuela created successfully");
        setFinalScreen({ status: "success", show: true });
      }
    } catch (error) {
      console.error("Error submitting escuela:", error);
      setFinalScreen({ status: "error", show: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (loading) {
    return <FullPageLoader open={true} />;
  }

  function redirectToLink() {
    window.location.href = "/";
  }

  if (finalScreen.show) {
    return (
      <PantallaFinal
        agregarOtra={redirectToLink}
        estado={finalScreen?.status}
      />
    );
  }

  return (
    <>
      <MenuAppBar title="Escuela" />
      <Paper
        elevation={3}
        sx={{ p: 4, m: 4, maxWidth: 800, mx: "auto", marginTop: "30px" }}
      >
        <Typography variant="h4" gutterBottom align="center">
          {idEscuela ? "Editar Escuela" : "Crear Nueva Escuela"}
        </Typography>
        <FormProvider {...methods}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  optional={
                    index === steps.length - 1 ? (
                      <Typography variant="caption">Último paso</Typography>
                    ) : null
                  }
                  icon={step.icon}
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ mb: 2 }}>
                      {index === 0 && (
                        <BasicInfoStep control={control} errors={errors} />
                      )}
                      {index === 1 && <ContactStep control={control} />}
                      {index === 2 && (
                        <ProgramsStep
                          control={control}
                          fields={fields}
                          append={append}
                          remove={remove}
                          carreras={carreras}
                        />
                      )}
                      {index === 3 && <MultimediaStep control={control} />}
                      {index === 4 && <AdditionalInfoStep control={control} />}
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1
                            ? "Finalizar"
                            : "Continuar"}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Atrás
                        </Button>
                      </div>
                    </Box>
                  </form>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>
                Todos los pasos completados - listo para enviar
              </Typography>
              <Button
                onClick={handleSubmit(onSubmit)}
                sx={{ mt: 1, mr: 1 }}
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Enviando..."
                  : idEscuela
                  ? "Actualizar Escuela"
                  : "Crear Escuela"}
              </Button>
            </Paper>
          )}
        </FormProvider>
      </Paper>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<FullPageLoader open={true} />}>
      <EscuelaForm />
    </Suspense>
  );
}
