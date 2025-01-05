import jsCookie from "js-cookie";
import axios from "axios";
const api = process.env.NEXT_PUBLIC_API;

const useUser = () => {
  const isAuthenticated = () => {
    console.log("[isAuthenticated] Checking if user is authenticated");
    const result = !!jsCookie.get("_id");
    console.log("[isAuthenticated] Result:", result);
    return result;
  };

  const getUserRole = () => {
    console.log("[getUserRole] Getting user role");
    if (isAuthenticated()) {
      const role = jsCookie.get("role");
      console.log("[getUserRole] Role found:", role);
      return role;
    }
    console.log("[getUserRole] No role found - user not authenticated");
    return null;
  };

  const authenticateUser = (email, password) => {
    console.log(
      "[authenticateUser] Attempting authentication for email:",
      email
    );
    const url = `${api}api/authenticator`;
    return new Promise((resolve, reject) =>
      axios
        .post(url, { email, password })
        .then((response) => {
          console.log("[authenticateUser] Authentication successful");
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
          console.log("[authenticateUser] Authentication failed:", err);
          reject(err);
        })
    );
  };

  const getLoggedUserInfo = () => {
    console.log("[getLoggedUserInfo] Getting logged user information");
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
    console.log("[getLoggedUserInfo] User info:", user);
    return user;
  };

  const getSpecificUserFullInfo = (id) => {
    console.log("[getSpecificUserFullInfo] Getting full info for user:", id);
    const url = `${api}api/user/${id}`;
    return new Promise((resolve, reject) =>
      axios
        .get(url)
        .then((response) => {
          console.log(
            "[getSpecificUserFullInfo] User info retrieved:",
            response.data.user
          );
          resolve(response.data.user);
        })
        .catch((err) => {
          console.log(
            "[getSpecificUserFullInfo] Error getting user info:",
            err
          );
          reject(err);
        })
    );
  };

  const updateUserInfo = (id, data) => {
    console.log(
      "[updateUserInfo] Updating info for user:",
      id,
      "with data:",
      data
    );
    const url = `${api}api/user/${id}`;
    return new Promise((resolve, reject) =>
      axios
        .put(url, data)
        .then((response) => {
          console.log(
            "[updateUserInfo] Update successful:",
            response.data.data
          );
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log("[updateUserInfo] Update failed:", err);
          reject(err);
        })
    );
  };

  const getAllUser = (page = 1) => {
    console.log("[getAllUser] Getting all users for page:", page);
    const url = `${api}api/user?page=${page}`;
    return new Promise((resolve, reject) =>
      axios
        .get(url)
        .then((response) => {
          const { data, total, page, totalPages } = response.data;
          console.log("[getAllUser] Retrieved users:", {
            users: data,
            total,
            page,
            totalPages,
          });
          resolve({ users: data, total, page, totalPages });
        })
        .catch((err) => {
          console.log("[getAllUser] Error getting users:", err);
          reject(err);
        })
    );
  };

  const createNewUser = (data) => {
    console.log("[createNewUser] Creating new user with data:", data);
    const url = `${api}api/user`;
    return new Promise((resolve, reject) =>
      axios
        .post(url, data)
        .then((response) => {
          console.log(
            "[createNewUser] User created successfully:",
            response.data.data
          );
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log("[createNewUser] Error creating user:", err);
          reject(err);
        })
    );
  };

  const deleteUser = (id) => {
    console.log("[deleteUser] Deleting user:", id);
    const url = `${api}api/user/${id}`;
    return new Promise((resolve, reject) => {
      axios
        .delete(url)
        .then((response) => {
          console.log(
            "[deleteUser] User deleted successfully:",
            response.data.data
          );
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log("[deleteUser] Error deleting user:", err);
          reject(err);
        });
    });
  };

  const logout = () => {
    console.log("[logout] Logging out user");
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
    console.log("[logout] All cookies removed");
  };

  const downloadIdentityProfile = (userId) => {
    console.log(
      "[downloadIdentityProfile] Initiating download for user:",
      userId
    );
    const url = `${api}api/user/perfil-identidad/${userId}`;
    console.log("[downloadIdentityProfile] Constructed URL:", url);
    let attempts = 0;
    const maxAttempts = 5;

    const attemptDownload = () => {
      console.log(
        "[downloadIdentityProfile] Attempting download, attempt number:",
        attempts + 1
      );
      return new Promise((resolve, reject) => {
        axios
          .get(url, { responseType: "blob" })
          .then((response) => {
            console.log(
              "[downloadIdentityProfile] Download successful, response status:",
              response.status
            );
            const file = new Blob([response.data], { type: "application/pdf" });
            console.log(
              "[downloadIdentityProfile] Blob created, size:",
              file.size
            );
            const fileURL = URL.createObjectURL(file);
            console.log("[downloadIdentityProfile] File URL created:", fileURL);
            resolve(fileURL);
          })
          .catch((err) => {
            attempts++;
            console.log(
              `[downloadIdentityProfile] Attempt ${attempts} failed with error:`,
              err
            );
            if (attempts < maxAttempts) {
              console.log(
                "[downloadIdentityProfile] Retrying download, attempt number:",
                attempts + 1
              );
              attemptDownload().then(resolve).catch(reject);
            } else {
              console.log(
                "[downloadIdentityProfile] Max attempts reached. Download failed with error:",
                err
              );
              reject(err);
            }
          });
      });
    };

    return attemptDownload();
  };

  const searchUsers = (searchParam) => {
    console.log("[searchUsers] Searching users with param:", searchParam);
    const url = `${api}api/user/search`;
    return new Promise((resolve, reject) => {
      axios
        .post(url, { searchParam })
        .then((response) => {
          console.log(
            "[searchUsers] Search successful, users found:",
            response.data.data
          );
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log("[searchUsers] Search failed with error:", err);
          reject(err);
        });
    });
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
    downloadIdentityProfile,
    searchUsers,
  };
};

export default useUser;
