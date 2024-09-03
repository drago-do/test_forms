import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function Page({ success = true, info }) {
  return (
    <Container maxWidth="sm">
      <Typography variant="h5">
        El Test {success ? "fue creado" : "no pudo crearse"}
      </Typography>

      <section className="w-full flex justify-between">
        <Button variant="text" color="secondary">
          Regresar a la pagina principal
        </Button>
        <Button variant="contained" color="primary">
          Regresa al inicio
        </Button>
      </section>
    </Container>
  );
}
