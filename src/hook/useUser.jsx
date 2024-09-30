import jsCookie from "js-cookie";
import axios from "axios";
const api = process.env.NEXT_PUBLIC_API;

const useUser = () => {
  const isAuthenticated = () => {
    return !!jsCookie.get("_id");
  };

  const getUserRole = () => {
    if (isAuthenticated()) {
      return jsCookie.get("role"); // Updated to use 'role' instead of 'puesto'
    }
    return null;
  };

  const authenticateUser = (email, password) => {
    const url = `${api}api/authenticator`;
    return new Promise((resolve, reject) =>
      axios
        .post(url, { email, password })
        .then((response) => {
          const data = response.data;
          jsCookie.set("firstName", data.firstName);
          jsCookie.set("lastName", data.lastName);
          jsCookie.set("email", data.email);
          jsCookie.set("role", data.role);
          jsCookie.set("phone", data.phone);
          jsCookie.set("currentSchool", data.currentSchool);
          jsCookie.set("educationLevel", data.educationLevel);
          jsCookie.set("generation", data.generation);
          jsCookie.set("grade", data.grade);
          jsCookie.set("group", data.group);
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
      firstName: jsCookie.get("firstName"),
      lastName: jsCookie.get("lastName"),
      email: jsCookie.get("email"),
      role: jsCookie.get("role"),
      phone: jsCookie.get("phone"),
      currentSchool: jsCookie.get("currentSchool"),
      educationLevel: jsCookie.get("educationLevel"),
      generation: jsCookie.get("generation"),
      grade: jsCookie.get("grade"),
      group: jsCookie.get("group"),
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
          resolve(response.data.user);
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
    jsCookie.remove("role");
    jsCookie.remove("phone");
    jsCookie.remove("currentSchool");
    jsCookie.remove("educationLevel");
    jsCookie.remove("generation");
    jsCookie.remove("grade");
    jsCookie.remove("group");
    jsCookie.remove("email");
    jsCookie.remove("lastName");
    jsCookie.remove("firstName");
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
