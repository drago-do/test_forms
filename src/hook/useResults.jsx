import axios from "axios";
const api = process.env.NEXT_PUBLIC_API;

const useResults = () => {
  const getAllResults = async (page = 1, limit = 30) => {
    const res = await axios.get(
      `${api}/api/results?page=${page}&limit=${limit}`
    );
    return res?.data;
  };

  const createResult = async (data) => {
    const res = await axios.post(`${api}/api/results`, data);
    return res.data;
  };

  const getResultById = async (id) => {
    const res = await axios.get(`${api}/api/results/viewresults/${id}`);
    return res.data;
  };

  const updateResult = async (id, data) => {
    const res = await axios.put(`${api}/api/results/${id}`, data);
    return res.data;
  };

  const deleteResult = async (id) => {
    const res = await axios.delete(`${api}/api/results/${id}`);
    return res.data;
  };

  return {
    getAllResults,
    createResult,
    getResultById,
    updateResult,
    deleteResult,
  };
};

export default useResults;
