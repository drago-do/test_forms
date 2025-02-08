import axios from "axios";

const api = typeof window !== "undefined" ? `${window.location.origin}/` : "";

const useEscuelas = () => {
  const getEscuelaById = (id) => {
    console.log("[getEscuelaById] Fetching escuela with ID:", id);
    const url = `${api}api/explora-tu-futuro/escuelas/${id}`;
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((response) => {
          console.log(
            "[getEscuelaById] Escuela fetched successfully:",
            response.data.data
          );
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log("[getEscuelaById] Error fetching escuela:", err);
          reject(err);
        });
    });
  };

  const createEscuela = (data) => {
    console.log("[createEscuela] Creating new escuela with data:", data);
    const url = `${api}api/explora-tu-futuro/escuelas`;
    return new Promise((resolve, reject) => {
      axios
        .post(url, data)
        .then((response) => {
          console.log(
            "[createEscuela] Escuela created successfully:",
            response.data.data
          );
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log("[createEscuela] Error creating escuela:", err);
          reject(err);
        });
    });
  };

  const updateEscuela = (id, data) => {
    console.log(
      "[updateEscuela] Updating escuela with ID:",
      id,
      "and data:",
      data
    );
    const url = `${api}api/explora-tu-futuro/escuelas/${id}`;
    return new Promise((resolve, reject) => {
      axios
        .put(url, data)
        .then((response) => {
          console.log(
            "[updateEscuela] Escuela updated successfully:",
            response.data.data
          );
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log("[updateEscuela] Error updating escuela:", err);
          reject(err);
        });
    });
  };

  const deleteEscuela = (id) => {
    console.log("[deleteEscuela] Deleting escuela with ID:", id);
    const url = `${api}api/explora-tu-futuro/escuelas/${id}`;
    return new Promise((resolve, reject) => {
      axios
        .delete(url)
        .then((response) => {
          console.log(
            "[deleteEscuela] Escuela deleted successfully:",
            response.data.message
          );
          resolve(response.data.message);
        })
        .catch((err) => {
          console.log("[deleteEscuela] Error deleting escuela:", err);
          reject(err);
        });
    });
  };

  const getAllEscuelas = (page = 1, limit = 20) => {
    console.log(
      "[getAllEscuelas] Fetching all escuelas for page:",
      page,
      "with limit:",
      limit
    );
    const url = `${api}api/explora-tu-futuro/escuelas?page=${page}&limit=${limit}`;
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((response) => {
          const { data, total, page, totalPages } = response.data;
          console.log("[getAllEscuelas] Retrieved escuelas:", {
            escuelas: data,
            total,
            page,
            totalPages,
          });
          resolve({ escuelas: data, total, page, totalPages });
        })
        .catch((err) => {
          console.log("[getAllEscuelas] Error fetching escuelas:", err);
          reject(err);
        });
    });
  };

  const searchEscuelas = (searchParam, page = 1, limit = 10) => {
    console.log(
      "[searchEscuelas] Searching escuelas with searchParam:",
      searchParam,
      "for page:",
      page,
      "with limit:",
      limit
    );
    const url = `${api}api/explora-tu-futuro/escuelas/search`;
    return new Promise((resolve, reject) => {
      axios
        .post(url, { searchParam, page, limit })
        .then((response) => {
          const { data, total, page, totalPages } = response.data;
          console.log("[searchEscuelas] Retrieved escuelas:", {
            escuelas: data,
            total,
            page,
            totalPages,
          });
          resolve({ escuelas: data, total, page, totalPages });
        })
        .catch((err) => {
          console.log("[searchEscuelas] Error searching escuelas:", err);
          reject(err);
        });
    });
  };

  return {
    getEscuelaById,
    createEscuela,
    updateEscuela,
    deleteEscuela,
    getAllEscuelas,
    searchEscuelas,
  };
};

export default useEscuelas;
