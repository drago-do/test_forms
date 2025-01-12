"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  TextField,
  Chip,
  Typography,
  Autocomplete,
  Button,
} from "@mui/material";
import { useFormContext, useFieldArray } from "react-hook-form";
import useTest from "../../hook/useTest";
import { toast } from "sonner";

const URLLocal =
  typeof window !== "undefined" ? `${window.location.origin}/` : "";

export default function LinkInput({ sectionIndex }) {
  const { control, getValues } = useFormContext();
  const {
    fields: link,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.link`,
  });

  const [tests, setTests] = useState([]);
  const [linksToRender, setLinksToRender] = useState(
    getValues(`sections.${sectionIndex}.link`) || []
  );
  const [newLink, setNewLink] = useState("");
  const { getAllTests } = useTest();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const testList = await getAllTests();
        setTests(testList.data);
      } catch (error) {
        toast.error("Error fetching tests");
      }
    };
    fetchTests();
  }, []);

  const handleDeleteLink = useCallback(
    (indexLink) => {
      remove(indexLink);
      setLinksToRender((prevLinks) =>
        prevLinks.filter((_, index) => index !== indexLink)
      );
    },
    [remove]
  );

  const formatLink = (link) => {
    try {
      const url = new URL(link);
      const domain = url.hostname;
      const path = url.pathname;
      const truncatedPath =
        path.length > 10 ? `${path.slice(0, 3)}...${path.slice(-7)}` : path;
      return domain + truncatedPath;
    } catch (error) {
      return link;
    }
  };

  const handleAddLink = useCallback(
    (newLinkTest = false) => {
      try {
        let formattedLink = newLinkTest ? newLinkTest : newLink.trim();
        if (!/^https?:\/\//i.test(formattedLink)) {
          formattedLink = "https://" + formattedLink;
        }
        append(formattedLink);
        setLinksToRender((prevLinks) => [...prevLinks, formattedLink]);
        setNewLink("");
      } catch (error) {
        toast.error("El enlace no tiene una estructura válida.");
      }
    },
    [append, newLink]
  );

  return (
    <Grid item xs={12} className="mt-4">
      <section className="flex flex-col md:flex-row justify-between">
        <Autocomplete
          freeSolo
          fullWidth
          options={tests}
          getOptionLabel={(option) => option?.titulo || option}
          onInputChange={(event, newInputValue) => setNewLink(newInputValue)}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              setNewLink(newValue);
            } else if (newValue?._id) {
              const testLink = `${URLLocal}test/${newValue._id}`;
              handleAddLink(testLink);
            }
          }}
          renderOption={(props, option) => (
            <li {...props} key={option?._id || option}>
              {option?.titulo || option}
            </li>
          )}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option?._id || option}
                label={option?.titulo || formatLink(option)}
              />
            ))
          }
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
          onClick={() => handleAddLink()}
          disabled={!newLink.trim()}
          className="my-2"
        >
          Añadir enlace
        </Button>
      </section>
      <Grid item xs={12} className="mt-4">
        {linksToRender.length > 0 ? (
          linksToRender.map((link, index) => {
            const test = tests.find(
              (test) => `${URLLocal}test/${test._id}` === link
            );
            return (
              <Chip
                key={index}
                label={test ? test.titulo : link}
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
