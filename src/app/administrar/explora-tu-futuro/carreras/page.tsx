"use client";
import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FullPageLoader from "../../../../components/general/FullPageLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import useCarreras from "../../../../hook/useCarreras";
import { useRouter } from "next/navigation";
import CarreraItem from "../../../../components/explora-tu-futuro/CarreraItem";
import SearchTextBox from "../../../../components/explora-tu-futuro/SearchTextBox";
import { List } from "@mui/material";

export default function Page() {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [carreras, setCarreras] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { getAllCarreras } = useCarreras();

  useEffect(() => {
    fetchCarreras();
  }, []);

  const fetchCarreras = async () => {
    setLoading(true);
    try {
      const data = await getAllCarreras(page, 40);
      if (data) {
        console.log(data);

        setCarreras((prevCarreras) => {
          const newCarreras = data.carreras.filter(
            (newCarrera) =>
              !prevCarreras.some((carrera) => carrera._id === newCarrera._id)
          );
          return [...prevCarreras, ...newCarreras];
        });
        setPage((prevPage) => prevPage + 1);
        if (page >= data.totalPages) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch carreras:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleURLClick = (url) => {
    setLoading(true);
    push(url);
  };

  return (
    <>
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
        <SearchTextBox />
        <InfiniteScroll
          dataLength={carreras.length}
          next={fetchCarreras}
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
            {carreras.map((carrera) => (
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
