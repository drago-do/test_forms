"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Button,
  Chip,
  useTheme,
  styled,
} from "@mui/material";
import {
  School,
  Business,
  Engineering,
  Work,
  Psychology,
  Timeline,
} from "@mui/icons-material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MenuAppBar from "../../../../components/general/MenuAppBar";
import FullPageLoader from "./../../../../components/general/FullPageLoader";
import useCarreras from "../../../../hook/useCarreras";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
}));

const VideoWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  paddingTop: "56.25%",
  "& iframe": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
      sx={{ p: 3 }}
    >
      {value === index && children}
    </Box>
  );
}

export default function CareerDetails() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [careerData, setCareerData] = useState(null);
  const theme = useTheme();
  const params = useParams();
  const id = params.id as string;
  const { getCarreraById } = useCarreras();

  useEffect(() => {
    if (id) {
      getCarreraById(id)
        .then((data) => {
          console.log(data);

          setCareerData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching career data:", err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <FullPageLoader open={loading} />;
  }

  if (!careerData) {
    return <Typography variant="h6">No se encontró la carrera.</Typography>;
  }

  return (
    <>
      <MenuAppBar title="Ver carrera" />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            position: "relative",
            height: "300px",
            backgroundImage: `url(${careerData.foto})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "16px",
            overflow: "hidden",
            mb: 4,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: `linear-gradient(to bottom, ${
                theme.palette.mode === "dark"
                  ? "rgba(0,0,0,0.7)"
                  : "rgba(255,255,255,0.7)"
              }, transparent)`,
            }}
          />
        </Box>
        <Grid container spacing={4}>
          {/* Header Section */}
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {careerData.nombre}
                </Typography>
                <Chip
                  label={careerData.nivelEducativo}
                  color="primary"
                  icon={<School />}
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  label={careerData.areaAcademica}
                  color="secondary"
                  icon={<MenuBookIcon />}
                  sx={{ mr: 1, mb: 1 }}
                />
              </Box>
              <Box>
                <Button
                  variant="contained"
                  startIcon={<School />}
                  sx={{
                    mr: 1,
                    mb: 1,
                    display: { xs: "none", sm: "inline-flex" },
                  }}
                >
                  Encontrar Escuelas
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Business />}
                  sx={{
                    mr: 1,
                    mb: 1,
                    display: { xs: "none", sm: "inline-flex" },
                  }}
                >
                  Encontrar Empresas
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    mr: 1,
                    mb: 1,
                    display: { xs: "inline-flex", sm: "none" },
                  }}
                >
                  <School />
                </Button>
                <Button
                  variant="outlined"
                  sx={{ display: { xs: "inline-flex", sm: "none" } }}
                >
                  <Business />
                </Button>
              </Box>
            </Box>

            {/* Main Content */}
            <Grid item xs={12}>
              <StyledPaper>
                <Grid container>
                  {/* Left side - Video */}
                  <Grid item xs={12} md={6}>
                    <VideoWrapper>
                      <iframe
                        src={careerData.videoPrincipal}
                        title="Career Video"
                        allowFullScreen
                      />
                    </VideoWrapper>
                  </Grid>

                  {/* Right side - Tabbed content */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                      >
                        <Tab icon={<Psychology />} label="Perfil" />
                        <Tab icon={<Engineering />} label="Técnico" />
                        <Tab icon={<Work />} label="Laboral" />
                        <Tab icon={<Timeline />} label="Competencias" />
                      </Tabs>
                    </Box>

                    <TabPanel value={tabValue} index={0}>
                      <Typography variant="h6" gutterBottom>
                        ¿Cómo ayuda al mundo?
                      </Typography>
                      <Typography paragraph>
                        {careerData.textosInformativos.comoAyudaAlMundo}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Intereses y habilidades necesarias
                      </Typography>
                      <Typography paragraph>
                        {careerData.textosInformativos.interesesYHabilidades}
                      </Typography>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                      <Typography variant="h6" gutterBottom>
                        Conocimientos técnicos requeridos
                      </Typography>
                      <Typography paragraph>
                        {careerData.textosInformativos.conocimientosTecnicos}
                      </Typography>
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                      <Typography variant="h6" gutterBottom>
                        Oportunidades laborales
                      </Typography>
                      <Typography paragraph>
                        {careerData.textosInformativos.dondePuedoTrabajar}
                      </Typography>
                    </TabPanel>

                    <TabPanel value={tabValue} index={3}>
                      <Typography variant="h6" gutterBottom>
                        Competencias al egresar
                      </Typography>
                      <Typography paragraph>
                        {careerData.textosInformativos.competenciasAlTerminar}
                      </Typography>
                    </TabPanel>
                  </Grid>
                </Grid>
              </StyledPaper>
            </Grid>

            {/* Professional Experience Videos */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom className="my-3">
                Experiencia de profesionales líderes
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                {careerData.videosExperiencia.map((video, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <StyledPaper>
                      <VideoWrapper
                        sx={{
                          width: "100%",
                          height: "0",
                          paddingTop: "56.25%", // 16:9 Aspect Ratio
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <iframe
                          src={video}
                          title={`Professional Experience ${index + 1}`}
                          allowFullScreen
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            margin: "0 auto",
                            fontSize: "0.8rem",
                          }}
                        />
                      </VideoWrapper>
                    </StyledPaper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
