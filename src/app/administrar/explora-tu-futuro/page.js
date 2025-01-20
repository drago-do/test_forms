"use client";
import React, { useState } from "react";
import { Grid, Paper, Button, Typography, Container } from "@mui/material";
import {
  School as SchoolIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import MenuAppBar from "../../../components/general/MenuAppBar";
import { useRouter } from "next/navigation";
import FullPageLoader from "../../../components/general/FullPageLoader";

export default function Page() {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    push(url);
  };

  return (
    <>
      <FullPageLoader open={loading} />
      <MenuAppBar title="Explora Tu Futuro" />
      <Container maxWidth="md" style={{ padding: "2rem" }}>
        <Typography variant="h3" gutterBottom align="center">
          Explora Tu Futuro
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3}>
              <Button
                color="secondary"
                fullWidth
                style={buttonStyle}
                onClick={() =>
                  redirectTo("/administrar/explora-tu-futuro/carreras")
                }
                startIcon={<SchoolIcon style={{ fontSize: "4rem" }} />}
              >
                Carreras
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3}>
              <Button
                color="secondary"
                fullWidth
                style={buttonStyle}
                onClick={() =>
                  redirectTo("/administrar/explora-tu-futuro/escuelas")
                }
                startIcon={<BusinessIcon style={{ fontSize: "4rem" }} />}
              >
                Escuelas
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
