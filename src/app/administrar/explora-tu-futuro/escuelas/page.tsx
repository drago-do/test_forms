"use client";
import React, { useState, useEffect, useCallback } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FullPageLoader from "../../../../components/general/FullPageLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import useCarreras from "../../../../hook/useCarreras";
import { useRouter } from "next/navigation";
import CarreraItem from "../../../../components/explora-tu-futuro/CarreraItem";
import SearchTextBox from "../../../../components/explora-tu-futuro/SearchTextBox";
import { List, Alert } from "@mui/material";
import MenuAppBar from "../../../../components/general/MenuAppBar";

export default function Page() {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [carreras, setCarreras] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { getAllCarreras, searchCarreras } = useCarreras();

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setSearchQuery(query);
    setPage(1); // Reset page to 1 for new search
    setCarreras([]); // Clear current carreras to reload from the start
    fetchCarreras(query, 1); // Fetch with new search query
  };

  const fetchCarreras = useCallback(
    async (query = searchQuery, currentPage = page) => {
      setLoading(true);
      setError(null);
      try {
        const data = query
          ? await searchCarreras(query, currentPage, 40)
          : await getAllCarreras(currentPage, 40);

        if (data && data?.carreras) {
          setCarreras((prevCarreras) => {
            const newCarreras = data.carreras.filter(
              (newCarrera) =>
                !prevCarreras.some((carrera) => carrera._id === newCarrera._id)
            );
            return [...prevCarreras, ...newCarreras];
          });
          setPage(currentPage + 1);
          setHasMore(currentPage < data.totalPages);
        } else {
          setError("No se pudo obtener la respuesta del servidor.");
        }
      } catch (error) {
        console.error("Failed to fetch carreras:", error);
        setError(
          "Error al obtener las carreras. Por favor, inténtalo de nuevo."
        );
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, page, getAllCarreras, searchCarreras]
  );

  useEffect(() => {
    fetchCarreras();
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
          Administración de Carreras
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="flex items-center"
          onClick={() =>
            handleURLClick(
              "/administrar/explora-tu-futuro/carreras/crear-editar"
            )
          }
        >
          Crear nueva carrera
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
          dataLength={carreras.length}
          next={() => fetchCarreras(searchQuery, page)}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <Container
              maxWidth="lg"
              className="w-full flex flex-col items-center my-16"
            >
              <Typography variant="h5">Fin de la lista</Typography>
              <Typography variant="body1">
                No quedan más carreras que mostrar
              </Typography>
            </Container>
          }
        >
          <List>
            {carreras &&
              carreras.map((carrera) => (
                <CarreraItem
                  key={carrera._id}
                  _id={carrera._id}
                  nombre={carrera.nombre}
                  descripcion={carrera.descripcion}
                  nivelEducativo={carrera.nivelEducativo}
                />
              ))}
          </List>
        </InfiniteScroll>
      </Container>
    </>
  );
}
