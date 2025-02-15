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
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import LinkInput from "./LinksTesting";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import useCarreras from "../../hook/useCarreras";
import { toast } from "sonner";
import useTest from "../../hook/useTest";

function CareerLinkModal({
  open,
  onClose,
  subcategory,
  onSave,
  initialCareer,
}) {
  const [selectedCareer, setSelectedCareer] = useState(initialCareer || null);
  const { getAllCarreras } = useCarreras();
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const response = await getAllCarreras();
        if (response.carreras) {
          setCarreras(response.carreras);
        }
        setLoading(false);
      } catch (error) {
        toast.error("Error al cargar las carreras");
        setLoading(false);
      }
    };
    fetchCarreras();
  }, []);

  const handleSave = () => {
    onSave(selectedCareer);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Vincular Carrera a {subcategory}</DialogTitle>
      <DialogContent>
        <Autocomplete
          value={selectedCareer}
          onChange={(event, newValue) => setSelectedCareer(newValue)}
          options={carreras}
          getOptionLabel={(option) => option.nombre || ""}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccionar Carrera"
              variant="outlined"
              margin="normal"
              fullWidth
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        {selectedCareer && (
          <Button
            onClick={() => {
              setSelectedCareer(null);
              onSave(null);
              onClose();
            }}
            color="error"
          >
            Desvincular
          </Button>
        )}
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function CategoryDialog({ open, onClose, initialData }) {
  const [categoryName, setCategoryName] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoriesData, setSubcategoriesData] = useState(new Map());
  const [newSubcategory, setNewSubcategory] = useState("");
  const [links, setLinks] = useState([]);
  const [careerModalOpen, setCareerModalOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    if (initialData) {
      setCategoryName(initialData.nombre || "");
      setSubcategories(initialData.subcategorias || []);
      setLinks(initialData.link || []);
      setSubcategoriesData(
        new Map(Object.entries(initialData.subcategoriasData || {}))
      );
    } else {
      setCategoryName("");
      setSubcategories([]);
      setLinks([]);
      setSubcategoriesData(new Map());
    }
  }, [initialData]);

  const handleAddSubcategory = () => {
    if (newSubcategory.trim()) {
      setSubcategories([...subcategories, newSubcategory.trim()]);
      setNewSubcategory("");
    }
  };

  const handleRemoveSubcategory = (index) => {
    const subcategory = subcategories[index];
    const newSubcategories = subcategories.filter((_, i) => i !== index);
    setSubcategories(newSubcategories);

    // Remove data for the deleted subcategory
    const newSubcategoriesData = new Map(subcategoriesData);
    newSubcategoriesData.delete(subcategory);
    setSubcategoriesData(newSubcategoriesData);
  };

  const handleCareerLink = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setCareerModalOpen(true);
  };

  const handleCareerSave = (career) => {
    const newSubcategoriesData = new Map(subcategoriesData);
    if (career) {
      newSubcategoriesData.set(selectedSubcategory, { carreraId: career._id });
    } else {
      newSubcategoriesData.delete(selectedSubcategory);
    }
    setSubcategoriesData(newSubcategoriesData);
  };

  const handleSubmit = () => {
    if (categoryName.trim()) {
      onClose({
        nombre: categoryName.trim(),
        subcategorias: subcategories,
        subcategoriasData: Object.fromEntries(subcategoriesData),
        link: links,
      });
    }
    setCategoryName("");
    setSubcategories([]);
    setLinks([]);
    setSubcategoriesData(new Map());
  };

  return (
    <>
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
                  <div key={index} className="flex items-center m-2">
                    <Chip
                      label={subcategory}
                      onDelete={() => handleRemoveSubcategory(index)}
                      variant="outlined"
                      color="secondary"
                      icon={
                        subcategoriesData.has(subcategory) ? (
                          <LinkIcon />
                        ) : undefined
                      }
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleCareerLink(subcategory)}
                      color={
                        subcategoriesData.has(subcategory)
                          ? "primary"
                          : "default"
                      }
                    >
                      {subcategoriesData.has(subcategory) ? (
                        <LinkIcon />
                      ) : (
                        <LinkOffIcon />
                      )}
                    </IconButton>
                  </div>
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
                setCategoryLinks={setLinks}
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
      <CareerLinkModal
        open={careerModalOpen}
        onClose={() => setCareerModalOpen(false)}
        subcategory={selectedSubcategory}
        onSave={handleCareerSave}
        initialCareer={
          selectedSubcategory
            ? subcategoriesData.get(selectedSubcategory)?.carreraId
            : null
        }
      />
    </>
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

const URLLocal =
  typeof window !== "undefined" ? `${window.location.origin}/` : "";

function CategoryLinkInput({ categoryLinks, setCategoryLinks }) {
  const [tests, setTests] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [newLink, setNewLink] = useState("");
  const { getAllTests } = useTest();
  const { getAllCarreras } = useCarreras();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsRes, carrerasRes] = await Promise.all([
          getAllTests(),
          getAllCarreras(),
        ]);
        setTests(testsRes.data);
        setCarreras(carrerasRes.carreras);
      } catch (error) {
        toast.error("Error cargando recursos");
      }
    };
    fetchData();
  }, []);

  const handleDeleteLink = (indexLink) => {
    setCategoryLinks((prevLinks) =>
      prevLinks.filter((_, index) => index !== indexLink)
    );
  };

  const formatLink = (link) => {
    try {
      const url = new URL(link);
      return (
        url.hostname +
        url.pathname.slice(0, 20) +
        (url.pathname.length > 20 ? "..." : "")
      );
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
      toast.error("Enlace inválido");
    }
  };

  const combinedOptions = [
    ...tests.map((test) => ({ type: "test", data: test })),
    ...carreras.map((carrera) => ({ type: "carrera", data: carrera })),
  ];

  return (
    <Grid item xs={12} className="mt-4">
      <section className="flex flex-col md:flex-row justify-between">
        <Autocomplete
          freeSolo
          fullWidth
          options={combinedOptions}
          getOptionLabel={(option) => {
            console.log(option);
            if (typeof option === "string") return option;
            return option.type === "test"
              ? `[Test] ${option.data.titulo}`
              : `[Carrera] ${option.data.nombre}`;
          }}
          onInputChange={(event, newInputValue) => setNewLink(newInputValue)}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              setNewLink(newValue);
            } else if (newValue?.type === "test") {
              handleAddLink(`${URLLocal}test/${newValue.data._id}`);
            } else if (newValue?.type === "carrera") {
              handleAddLink(
                `${URLLocal}explora-tu-futuro/carreras/${newValue.data._id}`
              );
            }
          }}
          renderOption={(props, option) => (
            <li {...props} key={option.data._id}>
              {option.type === "test"
                ? `[Test] ${option.data.titulo}`
                : `[Carrera] ${option.data.nombre}`}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Agregar enlace de test, carrera o externo"
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
            const testMatch = link.match(/test\/([a-f\d]{24})$/);
            const carreraMatch = link.match(/carreras\/([a-f\d]{24})$/);

            const test = testMatch
              ? tests.find((t) => t._id === testMatch[1])
              : null;
            const carrera = carreraMatch
              ? carreras.find((c) => c._id === carreraMatch[1])
              : null;

            return (
              <Chip
                key={index}
                label={
                  test
                    ? `[Test] ${test.titulo}`
                    : carrera
                    ? `[Carrera] ${carrera.nombre}`
                    : formatLink(link)
                }
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
