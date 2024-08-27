"use client";
import React from "react";
import Container from "@mui/material/Container";
import MenuAppBar from "@/components/general/MenuAppBar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MaterialIcon from "@/components/general/MaterialIcon";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
} from "@mui/material";

import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";

export default function page() {
  const tests = [
    {
      name: "test",
      description: "test",
      date: "2021-01-01",
      status: "active",
    },
    {
      name: "test2",
      description: "test2",
      date: "2021-01-01",
      status: "active",
    },
    {
      name: "test3",
      description: "test3",
      date: "2021-01-01",
      status: "active",
    },
    {
      name: "test4",
      description: "test4",
      date: "2021-01-01",
      status: "active",
    },
    {
      name: "test5",
      description: "test5",
      date: "2021-01-01",
      status: "active",
    },
  ];

  return (
    <>
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
        >
          <MaterialIcon iconName="add_notes" />
          Crear nuevo test
        </Button>
        <SeachTextBox />
        <List>
          {tests.map((test) => (
            <ItemTest
              key={test.name}
              nombre={test.name}
              descripcion={test.description}
            />
          ))}
        </List>
      </Container>
    </>
  );
}

const ItemTest = ({ nombre, descripcion }) => (
  <Paper elevation={2} className="my-2 p-2 flex items-center justify-between">
    <div className="flex items-center">
      <ListItemIcon>
        <MaterialIcon iconName="question_mark" />
      </ListItemIcon>
      <ListItemText primary={nombre} secondary={descripcion} />
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
