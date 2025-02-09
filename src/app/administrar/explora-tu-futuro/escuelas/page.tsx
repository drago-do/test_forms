"use client";
import React, { useState, useEffect, useCallback } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FullPageLoader from "../../../../components/general/FullPageLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import useEscuelas from "../../../../hook/useEscuelas";
import { useRouter } from "next/navigation";
import EscuelaItem from "../../../../components/explora-tu-futuro/EscuelaItem";
import SearchTextBox from "../../../../components/explora-tu-futuro/SearchTextBox";
import { List, Alert } from "@mui/material";
import MenuAppBar from "../../../../components/general/MenuAppBar";

export default function Page() {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [escuelas, setEscuelas] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { getAllEscuelas, searchEscuelas } = useEscuelas();

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setSearchQuery(query);
    setPage(1); // Reset page to 1 for new search
    setEscuelas([]); // Clear current escuelas to reload from the start
    fetchEscuelas(query, 1); // Fetch with new search query
  };

  const fetchEscuelas = useCallback(
    async (query = searchQuery, currentPage = page) => {
      setLoading(true);
      setError(null);
      try {
        const data = query
          ? await searchEscuelas(query, currentPage, 40)
          : await getAllEscuelas(currentPage, 40);
        console.log("data");
        console.log(data);

        if (data && data?.escuelas) {
          setEscuelas((prevEscuelas) => {
            const newEscuelas = data.escuelas.filter(
              (newEscuela) =>
                !prevEscuelas.some((escuela) => escuela._id === newEscuela._id)
            );
            return [...prevEscuelas, ...newEscuelas];
          });
          setPage(currentPage + 1);
          setHasMore(currentPage < data.totalPages);
        } else {
          setError("No se pudo obtener la respuesta del servidor.");
        }
      } catch (error) {
        console.error("Failed to fetch escuelas:", error);
        setError(
          "Error al obtener las escuelas. Por favor, inténtalo de nuevo."
        );
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, page, getAllEscuelas, searchEscuelas]
  );

  useEffect(() => {
    fetchEscuelas();
  }, []);

  const handleURLClick = (url) => {
    setLoading(true);
    push(url);
  };

  return (
    <>
      <MenuAppBar title="Explora Tu Futuro" />
      <FullPageLoader open={loading} />
      <Container maxWidth="md">
        <Typography variant="h2" className="mt-16 mb-3">
          Administración de Escuelas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="flex items-center"
          onClick={() =>
            handleURLClick(
              "/administrar/explora-tu-futuro/escuelas/crear-editar"
            )
          }
        >
          Crear nueva escuela
        </Button>
        <section className="my-3">
          <SearchTextBox onSearch={handleSearch} />
        </section>
        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}
        <InfiniteScroll
          dataLength={escuelas.length}
          next={() => fetchEscuelas(searchQuery, page)}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <Container
              maxWidth="lg"
              className="w-full flex flex-col items-center my-16"
            >
              <Typography variant="h5">Fin de la lista</Typography>
              <Typography variant="body1">
                No quedan más escuelas que mostrar
              </Typography>
            </Container>
          }
        >
          <List>
            {escuelas &&
              escuelas.map((escuela) => (
                <EscuelaItem
                  key={escuela._id}
                  _id={escuela._id}
                  nombreInstitucion={escuela.nombreInstitucion}
                  campus={escuela.campus}
                  nivelEducativo={escuela.programas[0].nivelEstudios}
                />
              ))}
          </List>
        </InfiniteScroll>
      </Container>
    </>
  );
}
