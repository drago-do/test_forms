import jsCookie from "js-cookie";
import axios from "axios";
const api = process.env.NEXT_PUBLIC_API;

const useUser = () => {
  const isAuthenticated = () => {
    return !!jsCookie.get("_id");
  };

  const getUserRole = () => {
    if (isAuthenticated()) {
      return jsCookie.get("puesto"); // Assuming 'puesto' represents the user's role
    }
    return null;
  };
  const authenticateUser = (email, password) => {
    const url = `${api}api/authenticator`;
    return new Promise((resolve, reject) =>
      axios
        .post(url, { email, password })
        .then((response) => {
          const { data } = response.data;
          jsCookie.set("token", data.token);
          jsCookie.set("nombre", data.nombre);
          jsCookie.set("apellidoPaterno", data.apellidoPaterno);
          jsCookie.set("apellidoMaterno", data.apellidoMaterno);
          jsCookie.set("correo", data.correo);
          jsCookie.set("puesto", data.puesto);
          jsCookie.set("area", data.area);
          jsCookie.set("_id", data._id);
          resolve(data);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        })
    );
  };

  const getLoggedUserInfo = () => {
    const user = {
      nombre: jsCookie.get("nombre"),
      apellidoPaterno: jsCookie.get("apellidoPaterno"),
      apellidoMaterno: jsCookie.get("apellidoMaterno"),
      correo: jsCookie.get("correo"),
      puesto: jsCookie.get("puesto"),
      area: jsCookie.get("area"),
      _id: jsCookie.get("_id"),
    };
    return user;
  };

  const getSpecificUserFullInfo = (id) => {
    const url = `${api}api/user/${id}`;
    return new Promise((resolve, reject) =>
      axios
        .get(url)
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        })
    );
  };

  const updateUserInfo = (id, data) => {
    const url = `${api}api/user/${id}`;
    return new Promise((resolve, reject) =>
      axios
        .put(url, data)
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        })
    );
  };

  const getAllUser = (page = 1) => {
    const url = `${api}api/user?page=${page}`;
    return new Promise((resolve, reject) =>
      axios
        .get(url)
        .then((response) => {
          const { data, total, page, totalPages } = response.data;
          resolve({ users: data, total, page, totalPages });
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        })
    );
  };

  const createNewUser = (data) => {
    const url = `${api}api/user`;
    return new Promise((resolve, reject) =>
      axios
        .post(url, data)
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        })
    );
  };

  const deleteUser = (id) => {
    const url = `${api}api/user/${id}`;
    return new Promise((resolve, reject) => {
      axios
        .delete(url)
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  };

  const logout = () => {
    jsCookie.remove("token");
    jsCookie.remove("expireTime");
    jsCookie.remove("puesto");
    jsCookie.remove("apellidoMaterno");
    jsCookie.remove("correo");
    jsCookie.remove("area");
    jsCookie.remove("especialidad");
    jsCookie.remove("apellidoPaterno");
    jsCookie.remove("nombre");
    jsCookie.remove("_id");
  };

  return {
    authenticateUser,
    getLoggedUserInfo,
    getSpecificUserFullInfo,
    updateUserInfo,
    logout,
    getAllUser,
    createNewUser,
    deleteUser,
    getUserRole,
    isAuthenticated,
  };
};

export default useUser;
