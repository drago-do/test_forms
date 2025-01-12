import axios from "axios";
const api = `${window.location.origin}/`;

const useTest = () => {
  const getAllTests = async (page = 1, limit = 30) => {
    console.log(
      `[getAllTests] Fetching tests with page=${page} and limit=${limit}`
    );
    const res = await axios.get(`/api/testing?page=${page}&limit=${limit}`);
    console.log("[getAllTests] Response:", res?.data);
    return res?.data;
  };

  const createTest = async (data) => {
    console.log("[createTest] Creating test with data:", data);
    const res = await axios.post(`/api/testing`, data);
    console.log("[createTest] Response:", res.data);
    return res.data;
  };

  const getTestById = async (id) => {
    console.log(`[getTestById] Fetching test with id=${id}`);
    const res = await axios.get(`/api/testing/${id}`);
    console.log("[getTestById] Response:", res.data);
    return res.data;
  };

  const getTestByType = async (type) => {
    console.log(`[getTestByType] Fetching tests with type=${type}`);
    const res = await axios.get(`/api/testing/type/${type}`);
    console.log("[getTestByType] Response:", res.data);
    return res.data;
  };

  const getUserCompletedTest = async (id) => {
    console.log(
      `[getUserCompletedTest] Fetching completed tests for user=${id}`
    );
    const res = await axios.get(`/api/testing/userAnswer/${id}`);
    console.log("[getUserCompletedTest] Response:", res.data);
    return res.data;
  };

  const updateTest = async (id, data) => {
    console.log(`[updateTest] Updating test ${id} with data:`, data);
    const res = await axios.put(`/api/testing/${id}`, data);
    console.log("[updateTest] Response:", res.data);
    return res.data;
  };

  const deleteTest = async (id) => {
    console.log(`[deleteTest] Deleting test with id=${id}`);
    const res = await axios.delete(`/api/testing/${id}`);
    console.log("[deleteTest] Response:", res.data);
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
