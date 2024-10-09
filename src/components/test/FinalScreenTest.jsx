import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Typography,
  Button,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ConfettiExplosion from "react-confetti-explosion";
import MaterialIcon from "../general/MaterialIcon";
import LoaderPencil from "../general/LoaderPencil";
import useResults from "./../../hook/useResults";

export default function Page({
  state = "success",
  idResults = "66ff6eb1f2f4af1adaba1489",
  info = "Error ",
}) {
  const [showConfetti, setShowConfetti] = useState(false);
  const { getResultById } = useResults();
  const [loading, showLoading] = useState(true);
  const [results, setResults] = useState([]);

  // Manejar efecto solo cuando el estado es "success"
  useEffect(() => {
    if (state === "success") {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); // Detener confetti después de 5 segundos
      return () => clearTimeout(timer); // Limpiar el temporizador cuando el componente se desmonte
    }
  }, [state]);

  useEffect(() => {
    const fetchResults = async () => {
      if (idResults) {
        //TODO descomentar esto
        const response = await getResultById(idResults);
        if (response.success) {
          setResults(response.data);
          showLoading(false);
        }
      }
    };
    fetchResults();
  }, [idResults]);

  // Memorizar las imágenes para evitar renders innecesarios
  const successImage = useMemo(
    () => (
      <Image
        src="/test_creado.png"
        width={100}
        height={100}
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
            <Typography variant="h4">Resultados</Typography>
            <ResultsTable results={results} />
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

  return <Container maxWidth="lg">{renderContent()}</Container>;
}
const ResultsTable = ({ results }) => {
  const [showLinks, setShowLinks] = useState({});

  const handleShowLinks = (index) => {
    setShowLinks((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <TableContainer component={Paper} className="my-5">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "25%" }}>Sección</TableCell>
            <TableCell style={{ width: "25%" }}>Porcentaje</TableCell>
            <TableCell style={{ width: "25%" }}>Escala</TableCell>
            <TableCell style={{ width: "25%" }}>Enlaces</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.nombreSeccion}</TableCell>
              <TableCell>{result.porcentaje}%</TableCell>
              <TableCell>{result.escala}</TableCell>
              <TableCell>
                {showLinks[index] ? (
                  result.enlaces.map((enlace, enlaceIndex) => (
                    <Chip
                      key={enlaceIndex}
                      className="my-2"
                      label={enlace}
                      component="a"
                      href={enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      clickable
                    />
                  ))
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => handleShowLinks(index)}
                  >
                    Mostrar Enlaces
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
