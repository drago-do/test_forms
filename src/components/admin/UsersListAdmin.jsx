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
  TextField,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import useUser from "./../../hook/useUser";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import { toast } from "sonner";
import InfiniteScroll from "react-infinite-scroll-component";

export default function UsersListAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [dialogoResetPassword, setDialogoResetPassword] = useState(false);
  const [nuevoRol, setNuevoRol] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { getAllUser, updateUserInfo, searchUsers } = useUser();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { users, totalPages } = await getAllUser(page);
      setUsuarios((prevUsuarios) => {
        const existingIds = new Set(prevUsuarios.map((user) => user._id));
        const newUsers = users.filter((user) => !existingIds.has(user._id));
        return [...prevUsuarios, ...newUsers];
      });
      setHasMore(page < totalPages);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (!searchTerm.trim()) {
        setPage(1);
        setUsuarios([]);
        cargarUsuarios();
      } else {
        const users = await searchUsers(searchTerm);
        setUsuarios(users);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      toast.error("Error al buscar usuarios");
    } finally {
      setLoading(false);
    }
  };

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

  const handlePasswordReset = () => {
    setDialogoResetPassword(true);
    handleMenuClose();
  };

  const manejarConfirmacionCambioRol = async () => {
    try {
      await updateUserInfo(selectedUser._id, { role: nuevoRol });
      setDialogoAbierto(false);
      setPage(1);
      setUsuarios([]);
      cargarUsuarios(); // Recargar usuarios
      toast.success("Rol del usuario actualizado con éxito");
    } catch (error) {
      console.error("Error al actualizar el rol del usuario:", error);
      toast.error("Error al actualizar el rol del usuario");
      setDialogoAbierto(false);
    }
  };

  const manejarConfirmacionResetPassword = async () => {
    if (!nuevaContrasena.trim()) {
      toast.error("La contraseña no puede estar vacía");
      return;
    }
    try {
      await updateUserInfo(selectedUser._id, { password: nuevaContrasena });
      setDialogoResetPassword(false);
      toast.success("Contraseña reiniciada con éxito");
    } catch (error) {
      console.error("Error al reiniciar la contraseña del usuario:", error);
      toast.error("Error al reiniciar la contraseña del usuario");
      setDialogoResetPassword(false);
    }
  };

  return (
    <>
      <TextField
        label="Buscar Usuarios"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <InfiniteScroll
        dataLength={usuarios.length}
        next={() => {
          if (!loading) {
            setPage((prevPage) => prevPage + 1);
          }
        }}
        hasMore={hasMore}
        loader={
          <section className="flex flex-col items-center w-full">
            <CircularProgress color="secondary" />
            <Typography variant="caption">Cargando más usuarios...</Typography>
          </section>
        }
        endMessage={
          <section className="flex flex-col items-center w-full my-12">
            <PersonIcon fontSize="large" />
            <Typography variant="caption">
              No hay más usuarios para mostrar
            </Typography>
          </section>
        }
      >
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
                <MenuItem onClick={handlePasswordReset}>
                  Reiniciar Contraseña
                </MenuItem>
              </Menu>
            </ListItem>
          ))}
          <DialogChangeRole
            open={dialogoAbierto}
            onClosed={() => setDialogoAbierto(false)}
            selectedUser={selectedUser}
            handleChangeRole={manejarConfirmacionCambioRol}
          />
          <DialogResetPassword
            open={dialogoResetPassword}
            onClosed={() => setDialogoResetPassword(false)}
            selectedUser={selectedUser}
            handleResetPassword={manejarConfirmacionResetPassword}
            setNuevaContrasena={setNuevaContrasena}
          />
        </List>
      </InfiniteScroll>
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

const DialogResetPassword = ({
  open,
  onClosed,
  selectedUser,
  handleResetPassword,
  setNuevaContrasena,
}) => {
  return (
    <Dialog open={open} onClose={onClosed}>
      <DialogTitle>Confirmar Reinicio de Contraseña</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Estás seguro de que quieres reiniciar la contraseña de{" "}
          {selectedUser?.firstName} {selectedUser?.lastName}?
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Nueva Contraseña"
          type="password"
          fullWidth
          variant="standard"
          onChange={(e) => setNuevaContrasena(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClosed} color="secondary">
          Cancelar
        </Button>
        <Button color="secondary" onClick={handleResetPassword} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
