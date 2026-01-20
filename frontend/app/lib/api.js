import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  storeTokens,
  clearTokens,
} from "./authStorage";

// Base URL to your Django backend (adjust for emulator/device)
const BASE = "http://192.168.100.4:8000/api/"; // replace YOUR_MACHINE_IP when testing on device
// const BASE = "http://192.168.137.1:8000/api/"; // replace YOUR_MACHINE_IP when testing on device
// const BASE = "http://192.168.8.248:8000/api/"; // replace YOUR_MACHINE_IP when testing on device
// const BASE = "http://192.168.251.50:8000/api/"; // replace YOUR_MACHINE_IP when testing on device

const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request (if available)
api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Robust refresh-handler:
 * - If a request gets 401 (token expired), attempt refresh
 * - Queue concurrent requests while refreshing to avoid multiple refresh calls
 */

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Handle expired access tokens automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccess = await refreshAccessToken();
      if (newAccess) {
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest); // retry the request
      } else {
        await clearTokens(); // force logout if refresh also fails
      }
    }

    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no response or not 401, just reject
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    // If already refreshing, queue the request and replay it when done
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Otherwise, attempt token refresh
    isRefreshing = true;
    try {
      const refresh = await getRefreshToken();
      if (!refresh) {
        // No refresh token => logout flow
        await clearTokens();
        isRefreshing = false;
        return Promise.reject(error);
      }

      const response = await axios.post(
        `${BASE}auth/refresh/`,
        { refresh },
        { headers: { "Content-Type": "application/json" } }
      );

      const newAccess = response.data.access;
      // Keep same refresh token (SimpleJWT does not always rotate refresh by default)
      await storeTokens({ access: newAccess, refresh });

      api.defaults.headers.common.Authorization = "Bearer " + newAccess;
      processQueue(null, newAccess);

      originalRequest.headers.Authorization = "Bearer " + newAccess;
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      // Refresh failed -> clear stored tokens (forces login)
      await clearTokens();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
