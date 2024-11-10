"use client";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import useUser from "./../../hook/useUser";

export default function CarruselUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [indiceInicio, setIndiceInicio] = useState(0);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nuevoRol, setNuevoRol] = useState("");

  const { getAllUser, updateUserInfo, getUserRole, isAuthenticated } =
    useUser();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const { users } = await getAllUser();
      setUsuarios(users);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const manejarSiguienteGrupo = () => {
    setIndiceInicio((prevIndice) =>
      Math.min(prevIndice + 5, usuarios.length - 5)
    );
  };

  const manejarGrupoAnterior = () => {
    setIndiceInicio((prevIndice) => Math.max(prevIndice - 5, 0));
  };

  const manejarCambioRol = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNuevoRol(usuario.role === "Admin" ? "User" : "Admin");
    setDialogoAbierto(true);
  };

  const manejarConfirmacionCambioRol = async () => {
    try {
      await updateUserInfo(usuarioSeleccionado._id, { role: nuevoRol });
      setDialogoAbierto(false);
      await cargarUsuarios(); // Recargar usuarios en lugar de recargar la página
    } catch (error) {
      console.error("Error al actualizar el rol del usuario:", error);
      setDialogoAbierto(false);
    }
  };

  const obtenerInicialesUsuario = (nombre, apellido) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  if (!isAuthenticated() || getUserRole() !== "Admin") {
    return <Typography>No tienes permiso para ver este contenido.</Typography>;
  }

  const usuariosMostrados = usuarios.slice(indiceInicio, indiceInicio + 5);

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", textAlign: "center" }}>
      <Grid container spacing={2} justifyContent="center">
        {usuariosMostrados.map((usuario) => (
          <Grid item xs={12} sm={6} md={2} key={usuario._id}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                border: "2px solid #e0e0e0",
                borderRadius: "10px",
                padding: 2,
                height: "100%",
              }}
            >
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  fontSize: "1.5rem",
                  bgcolor: `#${(
                    usuario.firstName.charCodeAt(0) * 100 +
                    usuario.lastName.charCodeAt(0)
                  )
                    .toString(16)
                    .padStart(6, "0")
                    .slice(0, 6)}`,
                  mb: 1,
                }}
              >
                {obtenerInicialesUsuario(usuario.firstName, usuario.lastName)}
              </Avatar>
              <Typography
                variant="subtitle1"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {usuario.firstName} {usuario.lastName.split(" ")[0]}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Rol: {usuario.role}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => manejarCambioRol(usuario)}
                sx={{ mt: 1, fontSize: "0.8rem" }}
              >
                Alternar Rol
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <IconButton
          onClick={manejarGrupoAnterior}
          disabled={indiceInicio === 0}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={manejarSiguienteGrupo}
          disabled={indiceInicio + 5 >= usuarios.length}
        >
          <ChevronRight />
        </IconButton>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Mostrando {indiceInicio + 1}-
        {Math.min(indiceInicio + 5, usuarios.length)} de {usuarios.length}
      </Typography>
      <Dialog open={dialogoAbierto} onClose={() => setDialogoAbierto(false)}>
        <DialogTitle>Confirmar Cambio de Rol</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres cambiar el rol de{" "}
            {usuarioSeleccionado?.firstName} {usuarioSeleccionado?.lastName} a{" "}
            {nuevoRol}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoAbierto(false)}>Cancelar</Button>
          <Button onClick={manejarConfirmacionCambioRol} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
