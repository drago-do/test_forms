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
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Search, School, EmojiObjects, Psychology } from "@mui/icons-material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconApp from "./../../components/general/IconApp";
import Image from "next/image";

const LandingPage = ({
  showPreview = true,
  showButton = true,
  userLogin = false,
}) => {
  const [expanded, setExpanded] = useState(showPreview);
  const theme = useTheme();
  const { push } = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {showButton && (
        <Button
          onClick={toggleExpand}
          endIcon={<ExpandMoreIcon />}
          sx={{ mt: 2 }}
        >
          {expanded ? "Mostrar menos" : "Mostrar más"}
        </Button>
      )}
      <Collapse in={expanded}>
        <section className="py-16 ">
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card className="h-full">
                  <CardContent className="flex flex-col items-center text-center">
                    <Search className="text-5xl text-blue-500 mb-4" />
                    <Typography variant="h5" component="h2" gutterBottom>
                      Autodescubrimiento
                    </Typography>
                    <Typography>
                      Explora un universo de posibilidades afines a tus pasiones
                      y deseos.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className="h-full">
                  <CardContent className="flex flex-col items-center text-center">
                    <School className="text-5xl text-blue-500 mb-4" />
                    <Typography variant="h5" component="h2" gutterBottom>
                      Educación Personalizada
                    </Typography>
                    <Typography>
                      Recibe orientación adaptada a tus necesidades y objetivos
                      únicos.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className="h-full">
                  <CardContent className="flex flex-col items-center text-center">
                    <EmojiObjects className="text-5xl text-blue-500 mb-4" />
                    <Typography variant="h5" component="h2" gutterBottom>
                      Desarrollo de Carrera
                    </Typography>
                    <Typography>
                      Obtén las herramientas necesarias para triunfar en tu
                      carrera elegida.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </section>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Container component="main" sx={{ my: 8 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
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
              </Grid>

              <Grid item xs={12} md={4}>
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
                    width={900}
                    height={900}
                    alt="Descubre tu propósito"
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
          <section className="py-16">
            <Container maxWidth="md" className="text-center">
              <Typography variant="h3" component="h2" gutterBottom>
                ¿Ya elegiste qué hacer con tu futuro?
              </Typography>
              <Typography variant="h6" paragraph>
                La Educación es el pasaporte hacia el futuro. Comienza tu viaje
                de autodescubrimiento hoy y sé lo que sueñas ser.
              </Typography>
              {!showButton && (
                <Button
                  variant="contained"
                  size="large"
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => push("/iniciar-sesion")}
                >
                  Descubre Tu Camino
                </Button>
              )}
            </Container>
          </section>
        </Box>
      </Collapse>
    </>
  );
};

export default LandingPage;
