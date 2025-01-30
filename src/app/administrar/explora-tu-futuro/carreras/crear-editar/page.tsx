"use client";

import { NivelEducativo, type ICarrera } from "../../../../../types/carrera";
import VideoInput from "../../../../../components/explora-tu-futuro/VideoInput";
import RichTextEditor from "../../../../../components/general/RichTextEditor";
import FullPageLoader from "../../../../../components/general/FullPageLoader";
import SearchImage from "../../../../../components/general/SearchImage";

import { useState, useEffect, Suspense } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
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
import useCarreras from "../../../../../hook/useCarreras";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

const steps = [
  { label: "Información Básica", icon: <School /> },
  { label: "Multimedia", icon: <YouTube /> },
  { label: "Textos Informativos", icon: <Description /> },
];

function CarreraForm() {
  const methods = useForm<ICarrera>({ mode: "all" });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalScreen, setFinalScreen] = useState({
    status: "success",
    show: false,
  });
  const { createCarrera, updateCarrera, getCarreraById } = useCarreras();
  const params = useSearchParams();
  const idCarrera = params.get("id");

  useEffect(() => {
    if (idCarrera) {
      setLoading(true);
      getCarreraById(idCarrera)
        .then((carrera) => {
          methods.reset(carrera);
        })
        .catch((error) => {
          console.error("Error fetching carrera:", error);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [idCarrera]);

  const onSubmit = async (data: ICarrera) => {
    setIsSubmitting(true);
    try {
      if (idCarrera) {
        await updateCarrera(idCarrera, data);
        console.log("Carrera updated successfully");
        setFinalScreen({ status: "success", show: true });
      } else {
        await createCarrera(data);
        console.log("Carrera created successfully");
        setFinalScreen({ status: "success", show: true });
      }
    } catch (error) {
      console.error("Error submitting carrera:", error);
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
    <Paper
      elevation={3}
      sx={{ p: 4, maxWidth: 800, mx: "auto", marginTop: "30px" }}
    >
      <Typography variant="h4" gutterBottom align="center">
        {idCarrera ? "Editar Carrera" : "Crear Nueva Carrera"}
      </Typography>
      <FormProvider {...methods}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === 2 ? (
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
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="nombre"
                            control={control}
                            rules={{ required: "Este campo es requerido" }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Nombre de la Carrera"
                                fullWidth
                                error={!!errors.nombre}
                                helperText={errors.nombre?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="nivelEducativo"
                            control={control}
                            rules={{ required: "Este campo es requerido" }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                select
                                label="Nivel Educativo"
                                fullWidth
                                error={!!errors.nivelEducativo}
                                helperText={errors.nivelEducativo?.message}
                                SelectProps={{
                                  value: field.value || Object.values(NivelEducativo)[0],
                                }}
                              >
                                {Object.values(NivelEducativo).map((nivel) => (
                                  <MenuItem key={nivel} value={nivel}>
                                    {nivel}
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Controller
                            name="areaAcademica"
                            control={control}
                            rules={{ required: "Este campo es requerido" }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Área Académica"
                                fullWidth
                                error={!!errors.areaAcademica}
                                helperText={errors.areaAcademica?.message}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    )}
                    {index === 1 && (
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <SearchImage name="foto" />
                        </Grid>
                        <Grid item xs={12}>
                          <Controller
                            name="videoPrincipal"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Video Principal (YouTube URL)"
                                fullWidth
                                placeholder="https://www.youtube.com/watch?v=..."
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Controller
                            name="videosExperiencia"
                            control={control}
                            defaultValue={[]}
                            rules={{ maxLength: 3 }}
                            render={({ field }) => (
                              <VideoInput
                                value={field.value}
                                onChange={field.onChange}
                                maxVideos={3}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    )}
                    {index === 2 && (
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Controller
                            name="textosInformativos.comoAyudaAlMundo"
                            control={control}
                            render={({ field }) => (
                              <RichTextEditor
                                {...field}
                                label="¿Cómo ayuda al mundo?"
                                icon={<EmojiObjects />}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Controller
                            name="textosInformativos.interesesYHabilidades"
                            control={control}
                            render={({ field }) => (
                              <RichTextEditor
                                {...field}
                                label="Intereses y Habilidades"
                                icon={<Star />}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Controller
                            name="textosInformativos.conocimientosTecnicos"
                            control={control}
                            render={({ field }) => (
                              <RichTextEditor
                                {...field}
                                label="Conocimientos Técnicos"
                                icon={<Build />}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Controller
                            name="textosInformativos.dondePuedoTrabajar"
                            control={control}
                            render={({ field }) => (
                              <RichTextEditor
                                {...field}
                                label="¿Dónde puedo trabajar?"
                                icon={<BusinessCenter />}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Controller
                            name="textosInformativos.competenciasAlTerminar"
                            control={control}
                            render={({ field }) => (
                              <RichTextEditor
                                {...field}
                                label="Competencias al Terminar"
                                icon={<Work />}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    )}
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? "Finalizar" : "Continuar"}
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
                : idCarrera
                ? "Actualizar Carrera"
                : "Crear Carrera"}
            </Button>
          </Paper>
        )}
      </FormProvider>
    </Paper>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<FullPageLoader open={true} />}>
      <CarreraForm />
    </Suspense>
  );
}

const PantallaFinal = ({ estado, agregarOtra }) => {
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        {estado === "success"
          ? "¡Operación exitosa!"
          : "Hubo un problema al procesar tu solicitud"}
      </Typography>
      <section className="flex justify-center w-full">
        <Image
          src={estado === "success" ? "/carrera.png" : "/error.png"}
          alt="Carrera creada icon"
          width={200}
          height={200}
          style={{
            filter: "drop-shadow(5px 5px 5px rgba(102, 102, 102, 0.9))",
          }}
        />
      </section>
      <Typography variant="body1" align="center" sx={{ mb: 3 }}>
        {estado === "success"
          ? "La carrera ha sido procesada correctamente."
          : "Por favor, intenta nuevamente o contacta al soporte técnico."}
      </Typography>
      <Box display="flex" justifyContent="center" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.history.back()}
        >
          Regresar
        </Button>
        <Button variant="outlined" color="secondary" onClick={agregarOtra}>
          Crear Nueva Carrera
        </Button>
      </Box>
    </Paper>
  );
};
