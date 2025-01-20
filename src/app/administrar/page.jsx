"use client";

import React, { useState } from "react";
import {
  Grid,
  Paper,
  Button,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
} from "@mui/material";
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  RocketLaunch as RocketLaunchIcon,
} from "@mui/icons-material";
import MenuAppBar from "../../components/general/MenuAppBar";
import { useRouter } from "next/navigation";
import FullPageLoader from "./../../components/general/FullPageLoader";

const AdminDashboard = () => {
  const { push } = useRouter();
  const [loading, seLloading] = useState(false);
  const buttonStyle = {
    height: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: "1.2rem",
  };

  const redirectTo = (url) => {
    seLloading(true);
    push(url);
  };

  return (
    <>
      <FullPageLoader open={loading} />
      <MenuAppBar title="Panel admin" />
      <Container maxWidth="md" style={{ padding: "2rem" }}>
        <Typography variant="h3" gutterBottom align="center">
          Panel de Administración
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3}>
              <Button
                color="secondary"
                fullWidth
                style={buttonStyle}
                onClick={() => redirectTo("/administrar/usuarios")}
                startIcon={<PeopleIcon style={{ fontSize: "4rem" }} />}
              >
                Administrar Usuarios
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3}>
              <Button
                color="secondary"
                fullWidth
                style={buttonStyle}
                onClick={() => redirectTo("/administrar/pruebas")}
                startIcon={<AssignmentIcon style={{ fontSize: "4rem" }} />}
              >
                Gestionar Pruebas
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3}>
              <Button
                color="secondary"
                fullWidth
                style={buttonStyle}
                onClick={() => redirectTo("/administrar/explora-tu-futuro")}
                startIcon={<RocketLaunchIcon style={{ fontSize: "4rem" }} />}
              >
                Explorar Tu Futuro
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AdminDashboard;
