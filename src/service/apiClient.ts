// src/services/apiClient.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL 

// axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to set token automatically
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;