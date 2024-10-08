import React, { useState, useEffect, useMemo } from "react";
import { Container, Typography, Button, Alert } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ConfettiExplosion from "react-confetti-explosion";
import MaterialIcon from "../general/MaterialIcon";
import LoaderPencil from "../general/LoaderPencil";

const ReturnButonsGroup = () => {
  const { push } = useRouter();

  return (
    <section className="w-full flex justify-between">
      <Button variant="text" color="secondary" onClick={() => push("/")}>
        <MaterialIcon iconName="home" className="mr-3" /> Regresar a la página
        principal
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          push("/administrar/", undefined, { shallow: true });
        }}
      >
        <MaterialIcon iconName="frame_reload" className="mr-3" />
        Regresar a administración
      </Button>
    </section>
  );
};

export default function Page({ state = "success", info = "Error " }) {
  const [showConfetti, setShowConfetti] = useState(false);

  // Manejar efecto solo cuando el estado es "success"
  useEffect(() => {
    if (state === "success") {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); // Detener confetti después de 5 segundos
      return () => clearTimeout(timer); // Limpiar el temporizador cuando el componente se desmonte
    }
  }, [state]);

  // Memorizar las imágenes para evitar renders innecesarios
  const successImage = useMemo(
    () => (
      <Image
        src="/test_creado.png"
        width={200}
        height={200}
        alt="Test creado"
      />
    ),
    []
  );

  const errorImage = useMemo(
    () => <Image src="/error.png" width={200} height={200} alt="Test error" />,
    []
  );

  const renderContent = () => {
    switch (state) {
      case "success":
        return (
          <>
            {showConfetti && (
              <ConfettiExplosion
                force={0.8}
                duration={3000}
                particleCount={250}
                width={1600}
                onComplete={() => setShowConfetti(false)} // Detener cuando termine
              />
            )}
            <Typography variant="h5">
              Felicidades, concluiste el test
            </Typography>
            <section className="w-full flex justify-center my-12">
              {successImage}
            </section>
            <ReturnButonsGroup />
          </>
        );
      case "error":
        return (
          <>
            <Typography variant="h5">El Test no pudo crearse</Typography>
            <section className="w-full flex justify-center my-12">
              {errorImage}
            </section>
            {info && (
              <Alert severity="error" className="my-6">
                {info}
              </Alert>
            )}
            <ReturnButonsGroup />
          </>
        );
      case "loading":
      default:
        return (
          <Container maxWidth="lg">
            <Typography variant="h5">Subiendo tus respuestas</Typography>
            <section className="w-full flex justify-center">
              <LoaderPencil />
            </section>
          </Container>
        );
    }
  };

  return <Container maxWidth="sm">{renderContent()}</Container>;
}
