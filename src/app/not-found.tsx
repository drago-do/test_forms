"use client";
import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

const Error404Page: React.FC = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get("search") as string;
    if (searchQuery) {
      // Implement your search functionality here
      console.log("Searching for:", searchQuery);
      // For example, you could redirect to a search results page
      // router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, borderRadius: 2, backgroundColor: "background.paper" }}
        >
          <Typography
            variant="h1"
            color="primary"
            sx={{ fontSize: "8rem", fontWeight: "bold", mb: 2 }}
          >
            404
          </Typography>
          <Typography variant="h4" gutterBottom>
            ¡Ups! Página no encontrada
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Lo sentimos, la página que estás buscando no existe o ha sido
            movida.
          </Typography>
          <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<HomeIcon />}
                fullWidth
                onClick={handleGoHome}
              >
                Ir al Inicio
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ArrowBackIcon />}
                fullWidth
                onClick={handleGoBack}
              >
                Volver Atrás
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Error404Page;
