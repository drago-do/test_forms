import axios from "axios";
const api = process.env.NEXT_PUBLIC_API;

const useTest = () => {
  const getAllTests = async (page = 1, limit = 30) => {
    const res = await axios.get(`/api/testing?page=${page}&limit=${limit}`);
    return res?.data;
  };

  const createTest = async (data) => {
    const res = await axios.post(`/api/testing`, data);
    return res.data;
  };

  const getTestById = async (id) => {
    const res = await axios.get(`/api/testing/${id}`);
    return res.data;
  };

  const getTestByType = async (type) => {
    const res = await axios.get(`/api/testing/type/${type}`);
    return res.data;
  };

  const getUserCompletedTest = async (id) => {
    const res = await axios.get(`/api/testing/userAnswer/${id}`);
    return res.data;
  };

  const updateTest = async (id, data) => {
    const res = await axios.put(`/api/testing/${id}`, data);
    return res.data;
  };

  const deleteTest = async (id) => {
    const res = await axios.delete(`/api/testing/${id}`);
    return res.data;
  };

  return {
    getAllTests,
    createTest,
    getTestById,
    updateTest,
    deleteTest,
    getTestByType,
    getUserCompletedTest,
  };
};

export default useTest;
