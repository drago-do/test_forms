import jsCookie from "js-cookie";
import axios from "axios";
const api = process.env.NEXT_PUBLIC_API;

const useUser = () => {
  const getAllTest = async () => {
    const res = await axios.get(`${api}/test`);
    return res.data;
  };

  return {
    getAllTest,
  };
};

export default useUser;
