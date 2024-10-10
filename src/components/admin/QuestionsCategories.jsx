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
  DialogContent,
  DialogActions,
  List,
  ListItem,
  IconButton,
  Chip,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

function CategoryDialog({ open, onClose, initialData }) {
  const [categoryName, setCategoryName] = useState(initialData?.nombre || "");
  const [subcategories, setSubcategories] = useState(
    initialData?.subcategorias || []
  );
  const [newSubcategory, setNewSubcategory] = useState("");

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
      onClose({ nombre: categoryName.trim(), subcategorias: subcategories });
    }
    setCategoryName("");
    setSubcategories([]);
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

  const handleOpen = (index = null) => {
    setEditingIndex(index);
    setOpen(true);
  };

  const handleClose = (newCategory) => {
    setOpen(false);
    if (newCategory) {
      if (editingIndex !== null) {
        const updatedCategories = [...categories];
        updatedCategories[editingIndex] = newCategory;
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
    // if (categories.length === 0) {
    //   setCategories(getValues("categories") || []);
    // }
    setValue("categorias", categories);
  };

  useEffect(() => {
    updateFormValue();
  }, [categories]);

  return (
    <div>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs>
          <Typography variant="h6">Categorías del Examen</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
            startIcon={<AddIcon />}
          >
            Agregar Categoría
          </Button>
        </Grid>
      </Grid>

      {categories.map((category, index) => (
        <Paper key={index} elevation={3} sx={{ p: 2, mb: 2 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs>
              <Typography variant="subtitle1">{category.nombre}</Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={() => handleOpen(index)} color="secondary">
                <AddIcon />
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

      <CategoryDialog
        open={open}
        onClose={handleClose}
        initialData={editingIndex !== null ? categories[editingIndex] : null}
      />
    </div>
  );
}
