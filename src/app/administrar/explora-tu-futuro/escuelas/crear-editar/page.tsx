"use client";

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
import useEscuelas from "../../../../../hook/useEscuelas";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import VideoInput from "../../../../../components/explora-tu-futuro/VideoInput";
import RichTextEditor from "../../../../../components/general/RichTextEditor";
import FullPageLoader from "../../../../../components/general/FullPageLoader";
import SearchImage from "../../../../../components/general/SearchImage";
import MenuAppBar from "../../../../../components/general/MenuAppBar";
import { IEscuela } from "../../../../../types/escuela";

const steps = [
  { label: "Información Básica", icon: <School /> },
  { label: "Multimedia", icon: <YouTube /> },
  { label: "Textos Informativos", icon: <Description /> },
];

function EscuelaForm() {
  const methods = useForm<IEscuela>({ mode: "all" });
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
  const { createEscuela, updateEscuela, getEscuelaById } = useEscuelas();
  const params = useSearchParams();
  const idEscuela = params.get("id");

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
  }, [idEscuela]);

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
                              name="nombreInstitucion"
                              control={control}
                              rules={{ required: "Este campo es requerido" }}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Nombre de la Institución"
                                  fullWidth
                                  error={!!errors.nombreInstitucion}
                                  helperText={errors.nombreInstitucion?.message}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Controller
                              name="razonSocial"
                              control={control}
                              rules={{ required: "Este campo es requerido" }}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Razón Social"
                                  fullWidth
                                  error={!!errors.razonSocial}
                                  helperText={errors.razonSocial?.message}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Controller
                              name="mejoraInstitucional"
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Mejora Institucional"
                                  fullWidth
                                  error={!!errors.mejoraInstitucional}
                                  helperText={
                                    errors.mejoraInstitucional?.message
                                  }
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Controller
                              name="campus.nombre"
                              control={control}
                              rules={{ required: "Este campo es requerido" }}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Nombre del Campus"
                                  fullWidth
                                  error={!!errors.campus?.nombre}
                                  helperText={errors.campus?.nombre?.message}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Controller
                              name="campus.estado"
                              control={control}
                              rules={{ required: "Este campo es requerido" }}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Estado"
                                  fullWidth
                                  error={!!errors.campus?.estado}
                                  helperText={errors.campus?.estado?.message}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Controller
                              name="campus.municipio"
                              control={control}
                              rules={{ required: "Este campo es requerido" }}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Municipio"
                                  fullWidth
                                  error={!!errors.campus?.municipio}
                                  helperText={errors.campus?.municipio?.message}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Controller
                              name="campus.domicilio"
                              control={control}
                              rules={{ required: "Este campo es requerido" }}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Domicilio"
                                  fullWidth
                                  error={!!errors.campus?.domicilio}
                                  helperText={errors.campus?.domicilio?.message}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Controller
                              name="campus.codigoPostal"
                              control={control}
                              rules={{ required: "Este campo es requerido" }}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Código Postal"
                                  fullWidth
                                  error={!!errors.campus?.codigoPostal}
                                  helperText={
                                    errors.campus?.codigoPostal?.message
                                  }
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      )}
                      {index === 1 && (
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <SearchImage name="multimedia.logo" />
                          </Grid>
                          <Grid item xs={12}>
                            <Controller
                              name="multimedia.videos"
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
                              name="informacionAdicional.porqueEstudiarConNosotros"
                              control={control}
                              render={({ field }) => (
                                <RichTextEditor
                                  {...field}
                                  label="¿Por qué estudiar con nosotros?"
                                  icon={<EmojiObjects />}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Controller
                              name="informacionAdicional.experiencias"
                              control={control}
                              render={({ field }) => (
                                <RichTextEditor
                                  {...field}
                                  label="Experiencias"
                                  icon={<Star />}
                                  value={field.value.join(" ")} // Convert string array to a single string
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Controller
                              name="informacionAdicional.testimonios"
                              control={control}
                              render={({ field }) => (
                                <RichTextEditor
                                  {...field}
                                  label="Testimonios"
                                  icon={<Build />}
                                  value={field.value.join(" ")} // Convert string array to a single string
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
          src={estado === "success" ? "/escuela.png" : "/error.png"}
          alt="Escuela creada icon"
          width={200}
          height={200}
          style={{
            filter: "drop-shadow(5px 5px 5px rgba(102, 102, 102, 0.9))",
          }}
        />
      </section>
      <Typography variant="body1" align="center" sx={{ mb: 3 }}>
        {estado === "success"
          ? "La escuela ha sido procesada correctamente."
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
          Crear Nueva Escuela
        </Button>
      </Box>
    </Paper>
  );
};
