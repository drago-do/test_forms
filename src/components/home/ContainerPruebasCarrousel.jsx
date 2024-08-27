import React from "react";
import { Paper, Container, Typography, Button, Box } from "@mui/material";
import Carrousel from "../general/Carroussel";

export default function ContainerPruebasCarrousel({ title }) {
  const createComponents = (n) => {
    return Array.from({ length: n }, (_, i) => <CardInfo key={i} />);
  };

  const arrayToRender = createComponents(10);

  return (
    <Container maxWidth="lg" className="my-3">
      <Typography variant="h5">Pruebas de {title}</Typography>
      <Carrousel renderElements={arrayToRender} />
    </Container>
  );
}

const CardInfo = (props) => {
  return (
    <Paper elevation={3} className="p-4 mb-3">
      <Typography variant="h5">Lorem ipsum dolor sit</Typography>
      <Typography variant="body2" className="mt-2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic alias,
        ducimus ipsum nesciunt
      </Typography>
      <Box display="flex" justifyContent="end">
        <Button variant="contained" color="primary">
          Responder
        </Button>
      </Box>
    </Paper>
  );
};
