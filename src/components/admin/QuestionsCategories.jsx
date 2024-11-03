"use client";

import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  Button,
  TextField,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  Autocomplete,
  DialogContent,
  DialogActions,
  List,
  IconButton,
  Collapse,
  Chip,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkInput from "./LinksTesting";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function CategoryDialog({ open, onClose, initialData }) {
  const [categoryName, setCategoryName] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState("");
  const [links, setLinks] = useState([]); // Add state for links

  useEffect(() => {
    if (initialData) {
      setCategoryName(initialData.nombre || "");
      setSubcategories(initialData.subcategorias || []);
      setLinks(initialData.link || []); // Initialize links
    } else {
      setCategoryName("");
      setSubcategories([]);
      setLinks([]); // Reset links
    }
  }, [initialData]);

  const handleAddSubcategory = () => {
    if (newSubcategory.trim()) {
      setSubcategories([...subcategories, newSubcategory.trim()]);
      setNewSubcategory("");
    }
  };

  const handleRemoveSubcategory = (index) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (categoryName.trim()) {
      console.log("ABEEEER");

      console.log({
        nombre: categoryName.trim(),
        subcategorias: subcategories,
        link: links, // Include links in the category data
      });

      onClose({
        nombre: categoryName.trim(),
        subcategorias: subcategories,
        link: links, // Include links in the category data
      });
    }
    setCategoryName("");
    setSubcategories([]);
    setLinks([]); // Reset links
  };

  return (
    <Dialog onClose={() => onClose()} open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Editar" : "Definir"} Categoría y Subcategorías
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Nombre de la Categoría"
              fullWidth
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              margin="normal"
              color="secondary"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Subcategorías</Typography>
            <List className="flex justify-start flex-wrap">
              {subcategories.map((subcategory, index) => (
                <Chip
                  key={index}
                  label={subcategory}
                  onDelete={() => handleRemoveSubcategory(index)}
                  variant="outlined"
                  className="m-2"
                  color="secondary"
                />
              ))}
            </List>
            <Grid container spacing={1}>
              <Grid item xs>
                <TextField
                  fullWidth
                  label="Nueva Subcategoría"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  margin="dense"
                  color="secondary"
                />
              </Grid>

              <Grid item>
                <Button
                  onClick={handleAddSubcategory}
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ mt: 1 }}
                >
                  Agregar
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <CategoryLinkInput
              categoryLinks={links}
              setCategoryLinks={setLinks} // Pass down the state and setter for links
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ExamCategories() {
  const { setValue, getValues } = useFormContext();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState(getValues("categorias") || []);
  const [editingIndex, setEditingIndex] = useState(null);
  const [show, setShow] = useState(false);

  const handleOpen = (index = null) => {
    setEditingIndex(index);
    setOpen(true);
  };

  const handleClose = (newCategory) => {
    setOpen(false);
    console.log("newCategory");
    console.log(newCategory);

    if (newCategory) {
      console.log("new categori");

      if (editingIndex !== null) {
        console.log("editingIndex");
        console.log(editingIndex);
        console.log(newCategory);
        const updatedCategories = [...categories];
        updatedCategories[editingIndex] = newCategory;
        console.log("last");
        console.log(updatedCategories);
        setCategories(updatedCategories);
      } else {
        setCategories([...categories, newCategory]);
      }
      updateFormValue();
    }
    setEditingIndex(null);
  };

  const handleDeleteCategory = (index) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
    updateFormValue();
  };

  const updateFormValue = () => {
    console.log("Actualizaddoooooo categories");
    console.log(categories);

    setValue("categorias", categories);
  };

  useEffect(() => {
    updateFormValue();
  }, [categories]);

  return (
    <div>
      <Paper className="p-5 mb-3">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={10}>
            <Typography variant="h6">Categorías del Examen</Typography>
          </Grid>
          <Grid item xs={2} className="flex justify-end">
            <Button
              variant="text"
              color="secondary"
              onClick={() => setShow(!show)}
            >
              {show ? (
                <>
                  <VisibilityOffIcon className="mr-3" />
                  Ocultar
                </>
              ) : (
                <>
                  <VisibilityIcon className="mr-3" />
                  Mostrar
                </>
              )}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Collapse in={show}>
        {categories.map((category, index) => (
          <Paper key={index} elevation={3} sx={{ p: 2, mb: 2 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs>
                <Typography variant="subtitle1">{category.nombre}</Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={() => handleOpen(index)} color="secondary">
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteCategory(index)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              {category.subcategorias.map((subcategory, subIndex) => (
                <Chip
                  key={subIndex}
                  label={subcategory}
                  onDelete={() => {
                    const updatedCategory = {
                      ...category,
                      subcategorias: category.subcategorias.filter(
                        (_, i) => i !== subIndex
                      ),
                    };
                    const updatedCategories = [...categories];
                    updatedCategories[index] = updatedCategory;
                    setCategories(updatedCategories);
                    updateFormValue();
                  }}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </div>
          </Paper>
        ))}
        <Grid item xs={12} md={3} lg={3}>
          <Button
            fullWidth
            variant="contained"
            className="mb-5"
            color="primary"
            onClick={() => handleOpen()}
            startIcon={<AddIcon />}
          >
            Agregar Categoría
          </Button>
        </Grid>
      </Collapse>
      <CategoryDialog
        open={open}
        onClose={handleClose}
        initialData={editingIndex !== null ? categories[editingIndex] : null}
      />
    </div>
  );
}

import useTest from "../../hook/useTest";
import { toast } from "sonner";

const URLLocal = process.env.NEXT_PUBLIC_API;

function CategoryLinkInput({ categoryLinks, setCategoryLinks }) {
  const [tests, setTests] = useState([]);
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

  const handleDeleteLink = (indexLink) => {
    setCategoryLinks((prevLinks) =>
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
      return domain + truncatedPath;
    } catch (error) {
      return link;
    }
  };

  const handleAddLink = (newLinkTest = false) => {
    try {
      let formattedLink = newLinkTest ? newLinkTest : newLink.trim();
      if (!/^https?:\/\//i.test(formattedLink)) {
        formattedLink = "https://" + formattedLink;
      }
      setCategoryLinks((prevLinks) => [...prevLinks, formattedLink]);
      setNewLink("");
    } catch (error) {
      toast.error("El enlace no tiene una estructura válida.");
    }
  };

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
        {categoryLinks.length > 0 ? (
          categoryLinks.map((link, index) => {
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
