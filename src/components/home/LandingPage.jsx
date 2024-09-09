import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  Link,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
  Collapse,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconApp from "@/components/general/IconApp";
import Image from "next/image";

const LandingPage = ({ showPreview = false }) => {
  const [expanded, setExpanded] = useState(showPreview);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Box
        sx={{
          background: `linear-gradient(to right, rgba(255, 255, 255, 0) 5%, ${theme.palette.primary.main} 20%, ${theme.palette.primary.main} 80%,rgba(255, 255, 255, 0) 95%)`,
          color: "primary.contrastText",
          py: 8,
          textAlign: "center",
          width: "100%",
        }}
      >
        <Container className="flex flex-col items-center w-full">
          <IconApp forceMode="dark" />
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Descubre Tu Propósito de Vida
          </Typography>
          <Typography variant="h5" paragraph>
            Te apoyamos a desarrollar tu carrera profesional y alcanzar tus
            sueños
          </Typography>
        </Container>
      </Box>
      {showPreview && (
        <Button
          onClick={toggleExpand}
          endIcon={<ExpandMoreIcon />}
          sx={{ mt: 2 }}
        >
          {expanded ? "Mostrar menos" : "Mostrar más"}
        </Button>
      )}
      <Collapse in={expanded}>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Container component="main" sx={{ my: 8 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h4"
                  component="h2"
                  gutterBottom
                  color="secondary"
                >
                  Tu Próposito de Vida
                </Typography>
                <Typography variant="body1" paragraph>
                  En <strong>Will Be,</strong> queremos apoyarte a descubrir y
                  desarrollar Tú carrera profesional para alcanzar tus sueños y
                  metas y así descubrir tu verdadero propósito.
                </Typography>
                <Typography variant="body1" paragraph>
                  Sabemos que esta decisión no es sencilla, es una elección
                  basada en la seguridad de conocerte y de saber a dónde quieres
                  llegar, por ello, a través de una serie de test, sesiones
                  personalizadas y contenido digital, te vamos acompañar en este
                  viaje de autodescubrimiento y vamos a explorar un universo de
                  posibilidades afines a las actividades que te apasionan, tus
                  gustos, deseos y aquello que te hace feliz.
                </Typography>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  align="center"
                  color="primary"
                  sx={{ mt: 4 }}
                >
                  Y tú…¿Ya elegiste que hacer con tú futuro?
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  align="center"
                  fontWeight="medium"
                >
                  La Educación es el pasaporte hacia el futuro, comienza tú
                  viaje de autodescubrimiento hoy y se lo que sueñas ser.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                >
                  <Image
                    src="/landing.jpg"
                    className="rounded-lg"
                    width={1200}
                    height={1200}
                    alt="Descubre tu propósito"
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Collapse>
    </>
  );
};

export default LandingPage;
