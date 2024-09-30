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
import { useFormContext, Controller } from "react-hook-form";
import useTest from "../../hook/useTest";
import { toast } from "sonner";

export default function LinkInput({ sectionIndex, defaultValue = [] }) {
  const { control, setValue, getValues, register } = useFormContext();
  const [links, setLinks] = useState(
    Array.isArray(defaultValue) ? defaultValue : []
  );
  const [tests, setTests] = useState([]);
  const [newLink, setNewLink] = useState("");
  const { getAllTests } = useTest();

  useEffect(() => {
    if (!Array.isArray(defaultValue)) {
      console.error("defaultValue is not an array");
      setLinks([]);
    } else {
      setLinks(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    const fetchTests = async () => {
      const testList = await getAllTests();
      console.log(testList.data);
      setTests(testList.data);
    };
    fetchTests();
  }, []);

  const handleDeleteLink = (linkToDelete) => {
    const updatedLinks = links.filter((link) => link !== linkToDelete);
    setLinks(updatedLinks);
    setValue(`sections.${sectionIndex}.link`, updatedLinks); // Update form value
  };

  const formatLink = (link) => {
    try {
      const url = new URL(link);
      const domain = url.hostname;
      const path = url.pathname;
      const truncatedPath =
        path.length > 10 ? `${path.slice(0, 3)}...${path.slice(-7)}` : path;
      return `${domain}${truncatedPath}`;
    } catch (error) {
      return link;
    }
  };

  const handleAddLink = () => {
    try {
      let formattedLink = newLink.trim();

      // Agregar "https://" si no está presente al inicio de la URL
      if (!/^https?:\/\//i.test(formattedLink)) {
        formattedLink = `https://${formattedLink}`;
      }

      // Validar la URL
      new URL(formattedLink);

      // Actualizar la lista de enlaces
      const updatedLinks = [...links, formattedLink];
      setLinks(updatedLinks);
      setValue(`sections.${sectionIndex}.link`, updatedLinks); // Actualizar el valor del formulario
      setNewLink(""); // Limpiar el campo de entrada
    } catch (error) {
      toast.error("El enlace no tiene una estructura válida");
    }
  };

  return (
    <Grid item xs={12} className="mt-4">
      <section className="flex flex-col md:flex-row justify-between">
        <Controller
          name={`sections.${sectionIndex}.link`}
          disableClearable
          control={control}
          defaultValue={links}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
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
                      const updatedLinks = [
                        ...links,
                        `${process.env.NEXT_PUBLIC_API}test/${newValue?._id}`,
                      ];
                      setLinks(updatedLinks);
                      onChange(updatedLinks);
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
                    error={!!error}
                    helperText={error ? error.message : null}
                  />
                )}
              />
            </>
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
        {links && links?.length > 0 ? (
          links.map((link, index) => {
            const test = tests.find(
              (test) =>
                `${process.env.NEXT_PUBLIC_API}test/${test._id}` === link
            );
            return (
              <Chip
                key={index}
                label={test ? test.titulo : formatLink(link)}
                onDelete={() => handleDeleteLink(link)}
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

      {/* Hidden input to maintain form data */}
      <input
        type="hidden"
        {...register(`sections.${sectionIndex}.link`)}
        value={links && links?.join(",")}
      />
    </Grid>
  );
}
