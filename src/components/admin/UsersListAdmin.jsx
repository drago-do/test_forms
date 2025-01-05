import React, { useState, useEffect } from "react";
import {
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useUser from "./../../hook/useUser";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";

export default function UsersListAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [nuevoRol, setNuevoRol] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const { getAllUser, updateUserInfo } = useUser();

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const { users } = await getAllUser();
        setUsuarios(users);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };

    cargarUsuarios();
  }, []);

  const handleMenuOpen = (event, user) => {
    console.log(user);

    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRoleChange = () => {
    setNuevoRol(selectedUser.role === "Admin" ? "User" : "Admin");
    setDialogoAbierto(true);
    handleMenuClose();
  };

  const manejarConfirmacionCambioRol = async () => {
    try {
      await updateUserInfo(selectedUser._id, { role: nuevoRol });
      setDialogoAbierto(false);
      const { users } = await getAllUser(); // Recargar usuarios
      setUsuarios(users);
    } catch (error) {
      console.error("Error al actualizar el rol del usuario:", error);
      setDialogoAbierto(false);
    }
  };

  return (
    <>
      <List>
        {usuarios.map((usuario) => (
          <ListItem key={usuario._id} divider>
            <ListItemText
              primary={`${usuario.firstName} ${usuario.lastName}`}
              secondary={
                <RolAndEmail rol={usuario.role} email={usuario.email} />
              }
            />
            <IconButton
              edge="end"
              onClick={(event) => handleMenuOpen(event, usuario)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleRoleChange}>Cambiar Rol</MenuItem>
            </Menu>
          </ListItem>
        ))}
        <DialogChangeRole
          open={dialogoAbierto}
          onClosed={() => setDialogoAbierto(false)}
          selectedUser={selectedUser}
          handleChangeRole={manejarConfirmacionCambioRol}
        />
      </List>
    </>
  );
}

const RolAndEmail = ({ rol = "", email = "" }) => {
  return (
    <section className="flex justify-start">
      <Chip
        icon={rol === "User" ? <PersonIcon /> : <AdminPanelSettingsIcon />}
        label={rol}
        color={rol === "User" ? "primary" : "secondary"}
        size="small"
      />
      <Chip icon={<AlternateEmailIcon />} label={email} size="small" />
    </section>
  );
};

const DialogChangeRole = ({
  open,
  onClosed,
  selectedUser,
  handleChangeRole,
}) => {
  return (
    <Dialog open={open} onClose={onClosed}>
      <DialogTitle>Confirmar Cambio de Rol</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Estás seguro de que quieres cambiar el rol de{" "}
          {selectedUser?.firstName} {selectedUser?.lastName}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClosed} color="secondary">
          Cancelar
        </Button>
        <Button color="secondary" onClick={handleChangeRole} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
