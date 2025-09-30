import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "https://localhost:7029/api";

const api = axios.create({
  baseURL,
 
});

export default api;
