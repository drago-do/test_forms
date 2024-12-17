import axios from "axios";
const api = process.env.NEXT_PUBLIC_API;
import { toast } from "sonner";

const useResults = () => {
  const getAllResults = async (page = 1, limit = 30) => {
    console.log(
      `[getAllResults] Fetching results with page=${page} and limit=${limit}`
    );
    const res = await axios.get(
      `${api}/api/results?page=${page}&limit=${limit}`
    );
    if (res.data.success) {
      console.log("[getAllResults] Response:", res?.data);
      return res?.data;
    } else {
      console.error("[getAllResults] Error:", res.message);
      toast.error(`Error al obtener los test. ${res.message}`);
      return [];
    }
  };

  const createResult = async (data) => {
    console.log("[createResult] Creating result with data:", data);
    const res = await axios.post(`${api}/api/results`, data);
    if (res.data.success) {
      console.log("[createResult] Response:", res?.data);
      return res?.data;
    } else {
      console.error("[createResult] Error:", res.message);
      toast.error(`Error al crear test. ${res.message}`);
      return [];
    }
  };

  const getResultById = async (id) => {
    console.log(`[getResultById] Fetching result with id=${id}`);
    const res = await axios.get(`${api}/api/results/viewresults/${id}`);
    if (res.data.success) {
      console.log("[getResultById] Response:", res?.data);
      return res?.data;
    } else {
      console.error("[getResultById] Error:", res.message);
      toast.error(`Error al obtener los resultados. ${res.message}`);
      return [];
    }
  };

  const getSummariOfTestResults = async (idPrueba) => {
    console.log(
      `[getSummariOfTestResults] Fetching summary for test id=${idPrueba}`
    );
    const res = await axios.get(`${api}/api/results/summarize/${idPrueba}`);
    if (res.data.success) {
      console.log("[getSummariOfTestResults] Response:", res?.data);
      return res?.data;
    } else {
      console.error("[getSummariOfTestResults] Error:", res.message);
      toast.error(`Error al obtener los resumenes del test. ${res.message}`);
      return [];
    }
  };

  const updateResult = async (id, data) => {
    console.log(`[updateResult] Updating result ${id} with data:`, data);
    const res = await axios.put(`${api}/api/results/${id}`, data);
    if (res.data.success) {
      console.log("[updateResult] Response:", res?.data);
      return res?.data;
    } else {
      console.error("[updateResult] Error:", res.message);
      toast.error(`Error al actualizar el test. ${res.message}`);
      return [];
    }
  };

  const deleteResult = async (id) => {
    console.log(`[deleteResult] Deleting result with id=${id}`);
    const res = await axios.delete(`${api}/api/results/${id}`);
    if (res.data.success) {
      console.log("[deleteResult] Response:", res?.data);
      return res?.data;
    } else {
      console.error("[deleteResult] Error:", res.message);
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
