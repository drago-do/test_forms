import React, { useEffect } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ImageIcon from "@mui/icons-material/Image";
import { toast } from "sonner";
import useSerpApi from "../../hook/useSearpAPI";
import Image from "next/image";
import { useFormContext, Controller } from "react-hook-form";

const SearchImage = ({ name }) => {
  const { images, loading, error, searchImages } = useSerpApi();
  const { control, setValue, watch } = useFormContext();
  const searchQuery = watch(name) || ""; // Ensure searchQuery is always a string
  const previewUrl = watch(`${name}Preview`) || ""; // Ensure previewUrl is always a string

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSearch = async () => {
    if (!searchQuery) {
      toast.error("Por favor, ingrese un término de búsqueda.");
      return;
    }

    await searchImages(searchQuery);

    if (images.length > 0) {
      setValue(`${name}Preview`, images[0].original);
      toast.success("Imágenes encontradas.");
    } else {
      setValue(`${name}Preview`, "");
      toast.error("No se encontraron imágenes.");
    }
  };

  const handleImageSelect = () => {
    if (previewUrl) {
      setValue(name, previewUrl);
      toast.success("Imagen seleccionada.");
    } else {
      toast.error("No hay imagen para seleccionar.");
    }
  };

  return (
    <Box>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            variant="outlined"
            placeholder="Buscar imagen en Google..."
            value={field.value || ""} // Ensure controlled input
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch} disabled={loading}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      {previewUrl && (
        <Box mt={2} display="flex" alignItems="center">
          <Image
            src={previewUrl}
            alt="Preview"
            width={100}
            height={100}
            style={{ marginRight: 16 }}
          />
          <IconButton color="primary" onClick={handleImageSelect}>
            <ImageIcon />
          </IconButton>
          <Typography variant="body2">Seleccionar esta imagen</Typography>
        </Box>
      )}
    </Box>
  );
};

export default SearchImage;
