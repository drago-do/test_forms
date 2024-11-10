import axios from "axios";
const api = process.env.NEXT_PUBLIC_API;
import { toast } from "sonner";

const useResults = () => {
  const getAllResults = async (page = 1, limit = 30) => {
    const res = await axios.get(
      `${api}/api/results?page=${page}&limit=${limit}`
    );
    if (res.data.success) {
      return res?.data;
    } else {
      toast.error(`Error al obtener los test. ${res.message}`);
      return [];
    }
  };

  const createResult = async (data) => {
    const res = await axios.post(`${api}/api/results`, data);
    if (res.data.success) {
      return res?.data;
    } else {
      toast.error(`Error al crear test. ${res.message}`);
      return [];
    }
  };

  const getResultById = async (id) => {
    const res = await axios.get(`${api}/api/results/viewresults/${id}`);
    if (res.data.success) {
      return res?.data;
    } else {
      toast.error(`Error al obtener los resultados. ${res.message}`);
      return [];
    }
  };

  const getSummariOfTestResults = async (idPrueba) => {
    const res = await axios.get(`${api}/api/results/summarize/${idPrueba}`);
    if (res.data.success) {
      return res?.data;
    } else {
      toast.error(`Error al obtener los resumenes del test. ${res.message}`);
      return [];
    }
  };

  const updateResult = async (id, data) => {
    const res = await axios.put(`${api}/api/results/${id}`, data);
    if (res.data.success) {
      return res?.data;
    } else {
      toast.error(`Error al actualizar el test. ${res.message}`);
      return [];
    }
  };

  const deleteResult = async (id) => {
    const res = await axios.delete(`${api}/api/results/${id}`);
    if (res.data.success) {
      return res?.data;
    } else {
      toast.error(`Error al eliminar el test. ${res.message}`);
      return [];
    }
  };

  return {
    getAllResults,
    createResult,
    getResultById,
    updateResult,
    deleteResult,
    getSummariOfTestResults,
  };
};

export default useResults;
