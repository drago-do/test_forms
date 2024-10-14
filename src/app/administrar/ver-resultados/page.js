"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
  Alert,
  AlertTitle,
  Container,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PasswordIcon from "@mui/icons-material/Password";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import useResults from "../../../hook/useResults";
import useTest from "../../../hook/useTest";
import { useSearchParams } from "next/navigation";
import FullPageLoader from "./../../../components/general/FullPageLoader";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import MenuAppBar from "../../../components/general/MenuAppBar";

function TestResults() {
  const params = useSearchParams();
  const idTestToGetInfo = params.get("id");
  const { getSummariOfTestResults } = useResults();
  const { getTestById } = useTest();
  const [test, setTest] = useState(null);
  const [results, setResults] = useState([]);
  const [pageState, setPageState] = useState("loading");

  useEffect(() => {
    const fetchTestAndResults = async () => {
      try {
        const testData = await getTestById(idTestToGetInfo);
        setTest(testData?.documento);

        const resultsData = await getSummariOfTestResults(idTestToGetInfo);
        if (!resultsData?.data?.length) {
          setPageState("no_response");
        } else {
          setResults(resultsData.data);
          setPageState("Ok");
        }
      } catch (error) {
        toast.error("Error al cargar los resultados");
      }
    };

    fetchTestAndResults();
  }, []);

  if (pageState === "loading") {
    return <FullPageLoader open />;
  }

  if (pageState === "no_response") {
    return (
      <>
        <MenuAppBar title="Resultados" />

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 400,
              width: "100%",
              textAlign: "center",
            }}
          >
            <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
            <Alert severity="info" sx={{ mb: 2 }}>
              <AlertTitle>No hay respuestas disponibles</AlertTitle>
              Aún no se han registrado respuestas para este test.
            </Alert>
            <Typography variant="h6" gutterBottom>
              {test?.nombre || "Test sin nombre"}
            </Typography>
            <Typography variant="body1" paragraph>
              Lo sentimos, pero aún no hay respuestas disponibles para este
              test. Por favor, intente más tarde o contacte al administrador si
              cree que esto es un error.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.history.back()}
            >
              Regresar
            </Button>
          </Paper>
        </Box>
      </>
    );
  }

  const respondentCount = results?.length;
  const averageScore =
    results.length > 0
      ? results.reduce(
          (sum, result) =>
            sum +
            Object.values(result.respuestas).reduce((a, b) => a + Number(b), 0),
          0
        ) / results.length
      : 0;

  const chartData =
    test?.sections?.map((section, index) => ({
      name: section.name,
      Promedio: Math.floor(
        results.reduce((sum, result) => {
          const sectionScore = result.seccionesResultado
            .filter(
              (seccion) => seccion.nombreSeccion === test.sections[index].name
            )
            .reduce(
              (sectionSum, seccion) =>
                sectionSum + parseInt(seccion.porcentaje, 10),
              0
            );

          return sum + sectionScore;
        }, 0) / results.length
      ),
      Máximo: 100,
    })) || [];

  const exportToExcel = () => {
    const link = document.createElement("a");
    link.href = `${process.env.NEXT_PUBLIC_API}/api/excel/${test?._id}`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Iniciando descarga del archivo Excel");
  };

  const copyTestCode = () => {
    const testLink = `${process.env.NEXT_PUBLIC_API}/test/${test._id}`;
    navigator.clipboard
      .writeText(testLink)
      .then(() => {
        toast.info("Enlace del test copiado al portapapeles");
      })
      .catch((err) => {
        toast.error("Error al copiar el código del test");
      });
  };

  return (
    <>
      <MenuAppBar title="Resultados" />
      <Box sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
        <Card sx={{ marginBottom: 2 }}>
          <CardHeader title={test?.titulo} />
          <CardContent>
            <Typography variant="body1">{test?.descripcion}</Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              <strong>Instrucciones:</strong> {test?.instrucciones}
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Resumen" />
              <CardContent>
                <Typography variant="body1">
                  Número de respondentes: {respondentCount}
                </Typography>
                <Typography variant="body1">
                  Calificación promedio: {averageScore.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Acciones" />
              <CardContent className="w-full sm:flex-col md:flex-row justify-between">
                <Button
                  variant="contained"
                  fullWidth
                  className="my-2"
                  startIcon={<FileDownloadIcon />}
                  onClick={exportToExcel}
                >
                  Exportar a Excel
                </Button>
                <Button
                  className="my-2"
                  fullWidth
                  variant="contained"
                  startIcon={<PasswordIcon />}
                  onClick={copyTestCode}
                >
                  Obtener código del test
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ marginBottom: 2 }}>
          <CardHeader title="Resultados por Sección" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Promedio" fill="#8884d8" />
                <Bar dataKey="Máximo" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Resultados Detallados" />
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Puntuación Total</TableCell>
                    <TableCell>Promedio por sección</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id_user._id}>
                      <TableCell>{`${result.id_user.firstName} ${result.id_user.lastName}`}</TableCell>
                      <TableCell>
                        {new Date(result.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {Object.values(result.respuestas).reduce(
                          (a, b) => a + Number(b),
                          0
                        )}
                      </TableCell>
                      {result.seccionesResultado.map((seccion, index) => (
                        <TableCell key={index}>{`Sección ${index + 1}: ${
                          seccion.porcentaje
                        }%`}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

// Envolver el componente con Suspense
export default function WrappedTestResults() {
  return (
    <Suspense fallback={<FullPageLoader open />}>
      <TestResults />
    </Suspense>
  );
}
