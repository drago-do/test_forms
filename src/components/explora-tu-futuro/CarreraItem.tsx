import React from "react";
import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { NivelEducativo } from "../../models/carrera";
import useCarreras from "../../hook/useCarreras";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast } from "sonner";

interface CarreraItemProps {
  _id: string;
  nombre: string;
  descripcion: string;
  nivelEducativo: NivelEducativo;
}

const CarreraItem: React.FC<CarreraItemProps> = ({
  _id,
  nombre,
  nivelEducativo,
}) => {
  const { deleteCarrera } = useCarreras();
  const { push } = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    console.log(`Navigating to details of career with ID: ${_id}`);
    toast.success(`Funcion no implementada`);
    handleMenuClose();
  };

  const handleEdit = () => {
    push(`/administrar/explora-tu-futuro/carreras/crear-editar?id=${_id}`);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await deleteCarrera(_id);
      toast.success(`Carrera con ID: ${nombre} eliminada exitosamente.`);
    } catch (error) {
      console.error(`Error al eliminar la carrera con ID: ${nombre}`, error);
      toast.error(`Error al eliminar la carrera con ID: ${nombre}`);
    }
    handleMenuClose();
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardHeader
        avatar={<Avatar>{nombre.charAt(0)}</Avatar>}
        title={nombre}
        subheader={`Nivel Educativo: ${nivelEducativo}`}
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

export default CarreraItem;
