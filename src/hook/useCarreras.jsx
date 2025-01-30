import axios from "axios";

const api = typeof window !== "undefined" ? `${window.location.origin}/` : "";

const useCarreras = () => {
  const getCarreraById = (id) => {
    console.log("[getCarreraById] Fetching carrera with ID:", id);
    const url = `${api}api/explora-tu-futuro/carreras/${id}`;
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((response) => {
          console.log(
            "[getCarreraById] Carrera fetched successfully:",
            response.data.data
          );
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log("[getCarreraById] Error fetching carrera:", err);
          reject(err);
        });
    });
  };

  const createCarrera = (data) => {
    console.log("[createCarrera] Creating new carrera with data:", data);
    const url = `${api}api/explora-tu-futuro/carreras`;
    return new Promise((resolve, reject) => {
      axios
        .post(url, data)
        .then((response) => {
          console.log(
            "[createCarrera] Carrera created successfully:",
            response.data.data
          );
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log("[createCarrera] Error creating carrera:", err);
          reject(err);
        });
    });
  };

  const updateCarrera = (id, data) => {
    console.log(
      "[updateCarrera] Updating carrera with ID:",
      id,
      "and data:",
      data
    );
    const url = `${api}api/explora-tu-futuro/carreras/${id}`;
    return new Promise((resolve, reject) => {
      axios
        .put(url, data)
        .then((response) => {
          console.log(
            "[updateCarrera] Carrera updated successfully:",
            response.data.data
          );
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log("[updateCarrera] Error updating carrera:", err);
          reject(err);
        });
    });
  };

  const deleteCarrera = (id) => {
    console.log("[deleteCarrera] Deleting carrera with ID:", id);
    const url = `${api}api/explora-tu-futuro/carreras/${id}`;
    return new Promise((resolve, reject) => {
      axios
        .delete(url)
        .then((response) => {
          console.log(
            "[deleteCarrera] Carrera deleted successfully:",
            response.data.message
          );
          resolve(response.data.message);
        })
        .catch((err) => {
          console.log("[deleteCarrera] Error deleting carrera:", err);
          reject(err);
        });
    });
  };

  const getAllCarreras = (page = 1, limit = 20) => {
    console.log(
      "[getAllCarreras] Fetching all carreras for page:",
      page,
      "with limit:",
      limit
    );
    const url = `${api}api/explora-tu-futuro/carreras?page=${page}&limit=${limit}`;
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((response) => {
          const { data, total, page, totalPages } = response.data;
          console.log("[getAllCarreras] Retrieved carreras:", {
            carreras: data,
            total,
            page,
            totalPages,
          });
          resolve({ carreras: data, total, page, totalPages });
        })
        .catch((err) => {
          console.log("[getAllCarreras] Error fetching carreras:", err);
          reject(err);
        });
    });
  };

  const searchCarreras = (searchParam, page = 1, limit = 10) => {
    console.log(
      "[searchCarreras] Searching carreras with searchParam:",
      searchParam,
      "for page:",
      page,
      "with limit:",
      limit
    );
    const url = `${api}api/explora-tu-futuro/carreras/search`;
    return new Promise((resolve, reject) => {
      axios
        .post(url, { searchParam, page, limit })
        .then((response) => {
          const { data, total, page, totalPages } = response.data;
          console.log("[searchCarreras] Retrieved carreras:", {
            carreras: data,
            total,
            page,
            totalPages,
          });
          resolve({ carreras: data, total, page, totalPages });
        })
        .catch((err) => {
          console.log("[searchCarreras] Error searching carreras:", err);
          reject(err);
        });
    });
  };

  return {
    getCarreraById,
    createCarrera,
    updateCarrera,
    deleteCarrera,
    getAllCarreras,
    searchCarreras,
  };
};

export default useCarreras;
