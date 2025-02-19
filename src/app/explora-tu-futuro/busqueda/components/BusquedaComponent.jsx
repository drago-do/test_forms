"use client";
import {
  Typography,
  Container,
  Paper,
  Select,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Grid,
  Box,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Image from "next/image";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  color: "white",
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "white",
  color: theme.palette.primary.main,
  border: "2px solid white",
  borderRadius: "25px",
  padding: "10px 40px",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.9)",
    border: "2px solid white",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  marginBottom: theme.spacing(2),
  "& .MuiSelect-select": {
    padding: theme.spacing(1.5),
  },
}));

const StyledRadio = styled(Radio)(({ theme }) => ({
  color: "white",
  "&.Mui-checked": {
    color: "white",
  },
}));

export default function SchoolFinder() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={3}>
            <Box mb={4} display="flex" justifyContent="center">
              <Image
                src="/logo_dark_bg.svg"
                alt="Logo de la aplicación"
                width={180}
                height={60}
              />
            </Box>
            <Typography
              variant="h4"
              gutterBottom
              fontWeight="bold"
              align="center"
            >
              Encuentra tu Institución Educativa Ideal
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <StyledSelect defaultValue="" displayEmpty>
                <MenuItem value="" disabled>
                  Selecciona el Nivel Académico
                </MenuItem>
                <MenuItem value="pregrado">Pregrado</MenuItem>
                <MenuItem value="posgrado">Posgrado</MenuItem>
              </StyledSelect>
            </FormControl>

            <Typography variant="h6" gutterBottom>
              Tipo de Institución
            </Typography>
            <RadioGroup row sx={{ mb: 3, justifyContent: "space-between" }}>
              <FormControlLabel
                value="publica"
                control={<StyledRadio />}
                label="Pública"
              />
              <FormControlLabel
                value="privada"
                control={<StyledRadio />}
                label="Privada"
              />
              <FormControlLabel
                value="ambas"
                control={<StyledRadio />}
                label="Ambas"
              />
            </RadioGroup>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <StyledSelect defaultValue="" displayEmpty>
                <MenuItem value="" disabled>
                  Selecciona el Estado
                </MenuItem>
                <MenuItem value="estado1">Estado 1</MenuItem>
                <MenuItem value="estado2">Estado 2</MenuItem>
              </StyledSelect>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <StyledSelect defaultValue="" displayEmpty>
                <MenuItem value="" disabled>
                  Selecciona el Municipio
                </MenuItem>
                <MenuItem value="municipio1">Municipio 1</MenuItem>
                <MenuItem value="municipio2">Municipio 2</MenuItem>
              </StyledSelect>
            </FormControl>

            <StyledButton variant="contained" fullWidth size="large">
              Buscar Instituciones
            </StyledButton>
          </StyledPaper>
        </Grid>

        {!isMobile && (
          <Grid item md={6}>
            <Box
              sx={{
                position: "relative",
                height: "100%",
                borderRadius: theme.shape.borderRadius,
                overflow: "hidden",
              }}
            >
              <Image
                src="/busqueda.jpeg"
                alt="Imagen de búsqueda"
                layout="fill"
                objectFit="cover"
                style={{ zIndex: 1 }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5))",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  zIndex: 2,
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  Explora y Encuentra Tu Próxima
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  Escuela con Nosotros
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
