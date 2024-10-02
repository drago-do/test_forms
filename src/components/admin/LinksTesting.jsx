"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Chip,
  Typography,
  Autocomplete,
  Button,
} from "@mui/material";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import useTest from "../../hook/useTest";
import { toast } from "sonner";

const URLLocal = process.env.NEXT_PUBLIC_API;

export default function LinkInput({ sectionIndex }) {
  const { control, setValue, getValues, register } = useFormContext();
  const {
    fields: link,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.link`,
  });

  const [tests, setTests] = useState([]);
  const [linksToRender, setlinksToRender] = useState([]);
  const [newLink, setNewLink] = useState("");
  const { getAllTests } = useTest();

  useEffect(() => {
    const fetchTests = async () => {
      const testList = await getAllTests();
      setTests(testList.data);
    };
    fetchTests();
  }, []);

  const handleDeleteLink = (indexLink) => {
    remove(indexLink);
    // Elimina del estado tipo array por índice
    setlinksToRender((prevLinks) =>
      prevLinks.filter((_, index) => index !== indexLink)
    );
  };

  const formatLink = (link) => {
    try {
      const url = new URL(link);
      const domain = url.hostname;
      const path = url.pathname;
      const truncatedPath =
        path.length > 10 ? `${path.slice(0, 3)}...${path.slice(-7)}` : path;
      console.log(truncatedPath);
      return domain + truncatedPath;
    } catch (error) {
      return link;
    }
  };

  const handleAddLink = (newLinkTest = false) => {
    try {
      let formattedLink = newLinkTest ? newLinkTest : newLink.trim();
      // Agregar "https://" si no está presente al inicio de la URL
      if (!/^https?:\/\//i.test(formattedLink)) {
        formattedLink = "https://" + formattedLink;
      }
      // Validar la URL
      append(formattedLink);
      setlinksToRender((prevLinks) => [...prevLinks, formattedLink]);
      setNewLink(""); // Limpiar el campo de entrada
    } catch (error) {
      toast.error("El enlace no tiene una estructura válida.");
    }
  };

  const verArray = () => {
    console.log(linksToRender);
  };

  return (
    <Grid item xs={12} className="mt-4">
      <section className="flex flex-col md:flex-row justify-between">
        <Button variant="text" color="primary" onClick={verArray}>
          ver
        </Button>
        <Autocomplete
          freeSolo
          fullWidth
          options={tests}
          getOptionLabel={(option) => option?.titulo || option}
          onInputChange={(event, newInputValue) => {
            setNewLink(newInputValue);
          }}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              setNewLink(newValue);
            } else {
              if (newValue?._id) {
                const testLink = URLLocal + "test/" + newValue?._id;
                handleAddLink(testLink);
              }
            }
          }}
          renderOption={(props, option) => (
            <li {...props} key={option?._id || option}>
              {option?.titulo || option}
            </li>
          )}
          renderTags={(tagValue, getTagProps) => {
            return tagValue.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option?._id || option}
                label={option?.titulo || formatLink(option)}
              />
            ));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Agregar enlace de test o externo"
              variant="standard"
            />
          )}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddLink}
          disabled={!newLink.trim()}
          className="my-2 ml-3"
        >
          Añadir enlace
        </Button>
      </section>

      {/* Display Chips */}
      <Grid item xs={12} className="mt-4">
        {linksToRender && linksToRender?.length > 0 ? (
          linksToRender.map((link, index) => {
            const test = tests.find(
              (test) => `${URLLocal}test/${test._id}` === link
            );
            return (
              <Chip
                key={index}
                label={test ? test?.titulo : link}
                onDelete={() => handleDeleteLink(index)}
                className="mr-2 mb-2"
              />
            );
          })
        ) : (
          <Typography variant="body2" color="textSecondary">
            No hay enlaces agregados.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
