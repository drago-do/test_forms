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
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  Box,
  CircularProgress,
  Chip,
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
                _id={test._id}
                titulo={test.titulo}
                descripcion={test.descripcion}
                instrucciones={test.instrucciones}
                categorias={test.categorias}
                sections={test?.sections}
                tipo={test?.tipo}
              />
            ))}
          </List>
        </InfiniteScroll>
      </Container>
    </>
  );
}

const ItemTest = ({
  titulo,
  descripcion,
  instrucciones,
  categorias,
  sections,
  tipo,
  _id,
}) => {
  const { deleteTest } = useTest();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { push } = useRouter();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteDialog = () => {
    setDeleteDialog(!deleteDialog);
  };

  const handleDeleteTest = async () => {
    handleDeleteDialog();
    setLoading(true);
    await deleteTest(_id);
    window.location.reload();
    setLoading(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        my: 2,
        p: 3,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {loading && <CircularProgress size={24} sx={{ mr: 2 }} />}
      <ListItemIcon>
        <MaterialIcon iconName="question_mark" />
      </ListItemIcon>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          alignItems: "start",
          overflow: "hidden",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mr: 2 }}>
          {titulo}
        </Typography>
        <section className="w-full flex flex-col flex-nowrap">
          <section className="w-full flex flex-nowrap items-center">
            <Chip label={`Descripción:`} sx={{ mr: 1, mb: 1 }} />{" "}
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {descripcion}
            </Typography>
          </section>
          <section className="w-full flex flex-nowrap items-center">
            <Chip label={`Instrucciones:`} sx={{ mr: 1 }} />
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {instrucciones}
            </Typography>
          </section>
        </section>
        <section className="w-full flex flex-nowrap items-center mt-2">
          <Typography variant="body1" className="mr-3">
            {tipo === 1 ? "Secciones" : "Categorias"}
          </Typography>
          {tipo === 1
            ? sections.map((section, index) => (
                <Chip key={index} label={`${section?.name}`} sx={{ mr: 1 }} />
              ))
            : categorias.map((cat, index) => (
                <Chip key={index} label={`${cat.nombre}`} sx={{ mr: 1 }} />
              ))}
        </section>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={() => push(`/administrar/crear-editar?id=${_id}`)}>
            Editar
          </MenuItem>
          <MenuItem onClick={handleDeleteDialog}>Eliminar</MenuItem>
          <MenuItem
            onClick={() => {
              setLoading(true);
              push(`/administrar/ver-resultados?id=${_id}`);
            }}
          >
            Ver Resultados
          </MenuItem>
        </Menu>
        <DeleteDialog
          open={deleteDialog}
          handleClose={handleDeleteDialog}
          handleDeleteTest={handleDeleteTest}
        />
      </Box>
    </Paper>
  );
};

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

const DeleteDialog = ({ handleClose, handleDeleteTest, open }) => {
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>¿Seguro que deseas eliminar este test?</DialogTitle>
      <section className="w-full flex justify-end">
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteTest}
          className="m-3"
        >
          <MaterialIcon iconName="delete" />
          Eliminar test
        </Button>
        <Button
          variant="text"
          color="primary"
          onClick={handleClose}
          className="m-3"
        >
          Cancelar
        </Button>
      </section>
    </Dialog>
  );
};
