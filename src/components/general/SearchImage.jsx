import React, { useEffect, useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "sonner";
import useSerpApi from "../../hook/useSearpAPI";
import Image from "next/image";
import { useFormContext, Controller } from "react-hook-form";
import ReactSimplyCarousel from "react-simply-carousel";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const SearchImage = ({ name }) => {
  const { images, loading, error, searchImages } = useSerpApi();
  const { control, setValue, watch } = useFormContext();
  const searchQuery = watch(name) || ""; // Ensure searchQuery is always a string
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

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
      setValue(
        `${name}Preview`,
        images.map((image) => image.original)
      );
      toast.success("Imágenes encontradas.");
    } else {
      setValue(`${name}Preview`, []);
      // toast.error("No se encontraron imágenes.");
    }
  };

  const handleImageSelect = (imageUrl) => {
    if (imageUrl) {
      setValue(name, imageUrl);
      toast.success("Imagen seleccionada.");
    } else {
      toast.error("No hay imagen para seleccionar.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
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
            onKeyDown={handleKeyPress}
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
      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}
      {images.length > 0 && (
        <Box mt={2}>
          <ReactSimplyCarousel
            activeSlideIndex={activeSlideIndex}
            onRequestChange={setActiveSlideIndex}
            itemsToShow={1}
            itemsToScroll={1}
            containerProps={{
              style: {
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "5px",
                borderRadius: "8px",
              },
            }}
            speed={400}
            easing="linear"
            forwardBtnProps={{
              children: (
                <IconButton>
                  <ArrowForwardIosIcon />
                </IconButton>
              ),
              style: {
                alignSelf: "center",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                right: "10px",
              },
            }}
            backwardBtnProps={{
              children: (
                <IconButton>
                  <ArrowBackIosNewIcon />
                </IconButton>
              ),
              style: {
                alignSelf: "center",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                left: "10px",
              },
            }}
          >
            {images.map((image, index) => (
              <Box
                key={index}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  width: "300px",
                  height: "400px",
                }}
              >
                <section
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    height: "100%",
                    maxHeight: "300px",
                  }}
                  className="flex items-center justify-center"
                >
                  <Image
                    src={image.original}
                    alt={`Preview ${index}`}
                    width={300}
                    height={300}
                    style={{ borderRadius: "8px", marginBottom: "8px" }}
                  />
                </section>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: "10px" }}
                  onClick={() => handleImageSelect(image.original)}
                  startIcon={<AddPhotoAlternateIcon />}
                >
                  Seleccionar
                </Button>
              </Box>
            ))}
          </ReactSimplyCarousel>
        </Box>
      )}
    </Box>
  );
};

export default SearchImage;
