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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ConfettiExplosion from "react-confetti-explosion";
import MaterialIcon from "../general/MaterialIcon";
import LoaderPencil from "../general/LoaderPencil";
import useResults from "./../../hook/useResults";

export default function Page({
  state = "success",
  idResults = "673cc65c37dc6c7e01592e15",
  info = "Error ",
  tipo = 2,
  nombreTest = "",
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
        const response = await getResultById(idResults);
        console.log(response);

        if (response.success) {
          setResults(response.data);
          console.log(response.data);

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
              {nombreTest != "" ? `: ${nombreTest}` : ""}
            </Typography>
            <section className="w-full flex justify-center my-12">
              {successImage}
            </section>
            <Typography variant="h4">Resultados</Typography>
            {tipo === 1 ? (
              <ResultsTable results={results} />
            ) : (
              <ResultsType2 results={results} tipo={tipo} />
            )}
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

  return <Container maxWidth="xl">{renderContent()}</Container>;
}

const ResultsTable = ({ results }) => {
  const [showLinks, setShowLinks] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");

  const handleShowLinks = (index) => {
    setShowLinks((prev) => ({ ...prev, [index]: true }));
  };

  const handleOpenDialog = (content) => {
    setDialogContent(content);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <TableContainer component={Paper} className="my-5">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "25%" }}>Sección</TableCell>
              <TableCell style={{ width: "25%" }}>Porcentaje</TableCell>
              <TableCell style={{ width: "25%" }}>Interpretación</TableCell>
              <TableCell style={{ width: "25%" }}>Enlaces</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.nombreSeccion}</TableCell>
                <TableCell>{result.porcentaje}%</TableCell>
                <TableCell>
                  {result.escala.split(" ").slice(0, 3).join(" ")}...
                  <span
                    style={{
                      marginLeft: "3px",
                      color: "skyblue",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => handleOpenDialog(result.escala)}
                  >
                    Ver más
                  </span>
                </TableCell>
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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          Interpretación Completa
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const ResultsType2 = ({ results, tipo }) => {
  const [showLinks, setShowLinks] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");

  const handleShowLinks = (index) => {
    setShowLinks((prev) => ({ ...prev, [index]: true }));
  };

  const handleOpenDialog = (content) => {
    setDialogContent(content);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const usuarioResults = results?.usuario || {};
  const totalResults = results?.total || {};
  const fullCategoriesAndSubCategories = results?.subcategorias || {};

  return (
    <>
      <TableContainer component={Paper} className="my-5">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ÁREA ACADEMICA</TableCell>
              <TableCell>PORCENTAJE</TableCell>
              {tipo === 3 && <TableCell>CARRERAS</TableCell>}
              <TableCell>ENLACES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(usuarioResults).map(([category, data], index) => (
              <TableRow key={index}>
                <TableCell>{category}</TableCell>
                <TableCell>{data.promedio}%</TableCell>
                {tipo === 3 && (
                  <TableCell>
                    <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
                      {Object.entries(
                        fullCategoriesAndSubCategories[category] || {}
                      ).map(([subcategoria, count], subIndex) => (
                        <li key={subIndex}>
                          <Typography variant="body2">
                            {subcategoria}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                )}
                <TableCell>
                  {showLinks[index] ? (
                    data.enlaces.map((enlace, enlaceIndex) => {
                      const getShortLabel = (url) => {
                        try {
                          const { hostname, pathname } = new URL(url);
                          const shortPath =
                            pathname.length > 20
                              ? pathname.substring(0, 5) + "..."
                              : pathname;
                          return `${hostname}${shortPath}`;
                        } catch (error) {
                          return url;
                        }
                      };

                      return (
                        <Chip
                          key={enlaceIndex}
                          className="my-2"
                          label={getShortLabel(enlace)}
                          component="a"
                          href={`${enlace}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          clickable
                        />
                      );
                    })
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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          Interpretación Completa
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
