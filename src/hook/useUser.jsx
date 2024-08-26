import jsCookie from "js-cookie";
import axios from "axios";
const api = process.env.NEXT_PUBLIC_API;

//TODO: modificar para adaptar a app

const useUser = () => {
  const { getToken } = useAuthJWT();
  const config = getToken();

  const getFullUserInfo = () => {
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
    const url = `${api}iso/formatos/system/FSY2_0/${id}`;
    return new Promise((resolve, reject) =>
      axios
        .get(url, config)
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        })
    );
  };

  const getUserImage = (_id) => {
    const url = `${api}iso/formatos/system/FSY2_0/${_id}/obtener/foto`;
    return new Promise((resolve, reject) =>
      axios
        .get(url, config)
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        })
    );
  };

  const getUserID = () => {
    const id = jsCookie.get("_id");
    return id;
  };

  const getUserBasicInfo = (id) => {
    const url = `${api}iso/formatos/system/FSY2_0/${id}`;
    return new Promise((resolve, reject) =>
      axios
        .get(url, config)
        .then((response) => {
          const userBasicInfo = {
            nombre: response.data.data.documento.nombre,
            apellidoPaterno: response.data.data.documento.apellidoPaterno,
            apellidoMaterno: response.data.data.documento.apellidoMaterno,
            correo: response.data.data.documento.correo,
            especialidad: response.data.data.documento.especialidad,
            puesto: response.data.data.documento.puesto,
            area: response.data.data.documento.area,
            _id: response.data.data._id,
          };
          resolve(userBasicInfo);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        })
    );
  };

  const getUserPerArea = (area) => {
    const url = `${api}colaborador/area/${area}`;
    return new Promise((resolve, reject) =>
      axios
        .get(url, config)
        .then((response) => {
          let colaboradorResponse = response.data.data;
          // filter only _id, nombre, apellidoPaterno, apellidoMaterno
          colaboradorResponse = colaboradorResponse.map((colaborador) => {
            return {
              _id: colaborador._id,
              nombre: colaborador.nombre,
              apellidoPaterno: colaborador.apellidoPaterno,
              apellidoMaterno: colaborador.apellidoMaterno,
              foto: colaborador.foto,
              correo: colaborador.correo,
              estado: colaborador.estado,
              contratista: colaborador.contratista,
            };
          });
          resolve(colaboradorResponse);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        })
    );
  };

  const updateUserInfo = (id, data) => {
    const url = `${api}iso/formatos/system/FSY2_0/${id}`;
    return new Promise((resolve, reject) =>
      axios
        .put(url, data, config)
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        })
    );
  };

  const getSignature = (id = jsCookie.get("_id")) => {
    const url = `${api}iso/formatos/system/FSY2_0/${id}/obtener/firmaDigital`;
    return new Promise((resolve, reject) =>
      axios
        .get(url, config)
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        })
    );
  };

  const getAllUser = () => {
    const url = `${api}iso/formatos/system/FSY2_0`;
    return new Promise((resolve, reject) =>
      axios
        .get(url, config)
        .then((response) => {
          let colaboradorResponse = response.data.data;
          // filter only _id, nombre, apellidoPaterno, apellidoMaterno
          colaboradorResponse = colaboradorResponse.map((colaborador) => {
            return {
              _id: colaborador._id,
              nombre: colaborador.nombre,
              apellidoPaterno: colaborador.apellidoPaterno,
              apellidoMaterno: colaborador.apellidoMaterno,
              foto: colaborador.foto,
              correo: colaborador.correo,
              estado: colaborador.estado,
            };
          });
          resolve(colaboradorResponse);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        })
    );
  };

  const createNewUser = (data) => {
    const url = `${api}colaborador/system`;
    return new Promise((resolve, reject) =>
      axios
        .post(url, data, config)
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
    const url = `${api}colaborador/${id}`;
    return new Promise((resolve, reject) => {
      axios
        .delete(url, config)
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
    getSignature,
    getSpecificUserFullInfo,
    getFullUserInfo,
    getUserImage,
    getUserID,
    getUserBasicInfo,
    updateUserInfo,
    logout,
    getAllUser,
    createNewUser,
    deleteUser,
    getUserPerArea,
  };
};

export default useUser;
