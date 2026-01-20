import axios from "axios";

const api = axios.create({
    // baseURL: "http://192.168.0.20:8000/api/auth/",
    baseURL: "http://192.168.8.248:8000/api/auth/",
});

export default api;