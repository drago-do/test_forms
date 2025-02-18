import { Paper, Typography, Box, Button } from "@mui/material";
import Image from "next/image";

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

export default PantallaFinal; 