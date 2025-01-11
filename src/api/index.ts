import axios from "axios";

const pathname =
  import.meta.env.MODE === "production" ? "/portfolio" : "";
const baseURL = `${pathname}`;

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance
