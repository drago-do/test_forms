import React from "react";
import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast } from "sonner";
import useEscuelas from "../../hook/useEscuelas";

const EscuelaItem = ({ _id, nombreInstitucion, campus, nivelEducativo }) => {
  const { push } = useRouter();
  const { deleteEscuela } = useEscuelas();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    console.log(`Navigating to details of school with ID: ${_id}`);
    toast.success(`Funcion no implementada`);
    handleMenuClose();
  };

  const handleEdit = () => {
    push(`/administrar/explora-tu-futuro/escuelas/crear-editar?id=${_id}`);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await deleteEscuela(_id);
      toast.success(
        `Escuela con ID: ${nombreInstitucion} eliminada exitosamente.`
      );
    } catch (error) {
      console.error(
        `Error al eliminar la escuela con ID: ${nombreInstitucion}`,
        error
      );
      toast.error(`Error al eliminar la escuela con ID: ${nombreInstitucion}`);
    }
    handleMenuClose();
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardHeader
        avatar={<Avatar>{nombreInstitucion.charAt(0)}</Avatar>}
        title={nombreInstitucion}
        subheader={`Campus: ${campus.nombre} - Nivel Educativo: ${nivelEducativo}`}
        action={
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
        }
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <IconButton color="primary">
            <InfoIcon />
          </IconButton>
          Ver detalles
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <IconButton color="secondary">
            <EditIcon />
          </IconButton>
          Editar
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
          Eliminar
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default EscuelaItem;
