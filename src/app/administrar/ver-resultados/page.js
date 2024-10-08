"use client";

import { useState, useEffect } from "react";
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
import * as XLSX from "xlsx";
import PasswordIcon from "@mui/icons-material/Password";
import { toast } from "sonner";

export default function TestResults() {
  const [test, setTest] = useState({
    _id: "testx",
    titulo: "Simulated Test Title",
    descripcion: "Simulated Test Description",
    instrucciones: "Simulated Instructions",
    sections: [
      {
        name: "Section 1",
        valorMax: 100,
      },
      {
        name: "Section 2",
        valorMax: 100,
      },
    ],
  });
  const [results, setResults] = useState([
    {
      id_user: "user1",
      createdAt: new Date(),
      respuestas: {
        "Section 1 - Q1": 10,
        "Section 1 - Q2": 20,
        "Section 2 - Q1": 30,
        "Section 2 - Q2": 40,
      },
    },
    {
      id_user: "user2",
      createdAt: new Date(),
      respuestas: {
        "Section 1 - Q1": 15,
        "Section 1 - Q2": 25,
        "Section 2 - Q1": 35,
        "Section 2 - Q2": 45,
      },
    },
  ]);

  const respondentCount = results.length;
  const averageScore =
    results.length > 0
      ? results.reduce(
          (sum, result) =>
            sum + Object.values(result.respuestas).reduce((a, b) => a + b, 0),
          0
        ) / results.length
      : 0;

  const chartData =
    test?.sections.map((section) => ({
      name: section.name,
      Promedio:
        results.reduce((sum, result) => {
          const sectionScore = Object.entries(result.respuestas)
            .filter(([key]) => key.startsWith(section.name))
            .reduce((sectionSum, [, value]) => sectionSum + value, 0);
          return sum + sectionScore;
        }, 0) / results.length,
      Máximo: section.valorMax,
    })) || [];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, "test_results.xlsx");
    toast.success("Descargando Excel de resultados");
  };

  const copyTestCode = () => {
    const testLink = `${process.env.NEXT_PUBLIC_API}/test/${test._id}`;
    navigator.clipboard
      .writeText(testLink)
      .then(() => {
        toast.info("Enlace del test copiado al portapapeles");
      })
      .catch((err) => {
        toast.error("Error al enlace el código del test");
      });
  };

  if (!test) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
      <Card sx={{ marginBottom: 2 }}>
        <CardHeader title={test.titulo} />
        <CardContent>
          <Typography variant="body1">{test.descripcion}</Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <strong>Instrucciones:</strong> {test.instrucciones}
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
            <CardContent className="w-full flex justify-between ">
              <Button
                variant="contained"
                startIcon={<FileDownloadIcon />}
                onClick={exportToExcel}
              >
                Exportar a Excel
              </Button>
              <Button
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
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id_user}>
                    <TableCell>{result.id_user}</TableCell>
                    <TableCell>
                      {new Date(result.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {Object.values(result.respuestas).reduce(
                        (a, b) => a + b,
                        0
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
