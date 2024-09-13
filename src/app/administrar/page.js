"use client";
import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import MenuAppBar from "./../../components/general/MenuAppBar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MaterialIcon from "./../../components/general/MaterialIcon";
import {
  List,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
} from "@mui/material";

import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import FullPageLoader from "./../../components/general/FullPageLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import useTest from "./../../hook/useTest";

import { useRouter } from "next/navigation";

export default function Page() {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { getAllTests } = useTest();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const data = await getAllTests(page, 40);
      if (data) {
        console.log(data);
        setTests((prevTests) => {
          const newTests = data.data.filter(
            (newTest) => !prevTests.some((test) => test._id === newTest._id)
          );
          return [...prevTests, ...newTests];
        });
        setPage((prevPage) => prevPage + 1);
        if (page >= data.totalPages) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch tests:", error);
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
      <MenuAppBar />
      <Container maxWidth="md">
        <Typography variant="h2" className="mt-16 mb-3">
          Administracion de test
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="flex items-center"
          onClick={() => handleURLClick("/administrar/crear-editar")}
        >
          <MaterialIcon iconName="add_notes" />
          Crear nuevo test
        </Button>
        <SeachTextBox />
        <InfiniteScroll
          dataLength={tests.length}
          next={fetchTests}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <Container
              maxWidth="lg"
              className="w-full flex flex-col items-center my-16"
            >
              <Typography variant="h5">Fin de la lista</Typography>
              <MaterialIcon iconName="data_check" className="text-6xl" />
              <Typography variant="body1">
                No quedan mas test que mostrar
              </Typography>
            </Container>
          }
        >
          <List>
            {tests.map((test) => (
              <ItemTest
                key={test._id}
                titulo={test.titulo}
                descripcion={test.descripcion}
                instrucciones={test.instrucciones}
                categorias={test.categorias}
              />
            ))}
          </List>
        </InfiniteScroll>
      </Container>
    </>
  );
}

const ItemTest = ({ titulo, descripcion, instrucciones, categorias }) => (
  <Paper elevation={2} className="my-2 p-2 flex items-center justify-between">
    <div className="flex items-center">
      <ListItemIcon>
        <MaterialIcon iconName="question_mark" />
      </ListItemIcon>
      <ListItemText
        primary={titulo}
        secondary={
          <>
            <Typography component="span">{descripcion}</Typography>
            <Typography component="span">{instrucciones}</Typography>
            <Typography component="span">
              Categorías: {categorias.map((cat) => cat.nombre).join(", ")}
            </Typography>
          </>
        }
      />
    </div>
    <IconButton>
      <MoreVertIcon />
    </IconButton>
  </Paper>
);

const SeachTextBox = (props) => (
  <TextField
    {...props}
    className="my-6"
    fullWidth
    variant="outlined"
    label="Buscar test"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
  />
);
