import axios from "axios";

const axiosInstance = axios.create({
  baseURL: " http://localhost:5000" || process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  },
});

axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("echotoken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      // If the request contains FormData, set Content-Type to 'multipart/form-data'
      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      }
  
      return config;
    },
    (error) => Promise.reject(error)
  );
  
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

const api = {
  get: (url, params = {}) => axiosInstance.get(url, { params }),
  post: (url, data) => axiosInstance.post(url, data),
  put: (url, data) => axiosInstance.put(url, data),
  delete: (url) => axiosInstance.delete(url),
};

export default api;