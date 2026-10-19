import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_API;

export const httpClient = axios.create({
  baseURL,
});

httpClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let refreshPromise = null;

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post(`${baseURL}/auth/refresh`, {
    refresh_token: refreshToken,
  });

  const data = response.data?.data || response.data;

  if (data?.access_token) {
    localStorage.setItem("accessToken", data.access_token);

    if (data.refresh_token) {
      localStorage.setItem("refreshToken", data.refresh_token);
    }

    return data.access_token;
  }

  throw new Error("Failed to refresh access token");
};

const handleForceLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  if (!window.location.pathname.includes("/login")) {
    window.location.href = `${import.meta.env.BASE_URL}login`;
  }
};

httpClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isVerifyEmailRequest =
      originalRequest.url?.includes("auth/verify-email");
    if (status === 401 && isVerifyEmailRequest) {
      return Promise.reject(error);
    }

    const isRefreshEndpoint = originalRequest.url?.includes("/auth/refresh");
    if (isRefreshEndpoint && (status === 401 || status === 403)) {
      handleForceLogout();
      return Promise.reject(error);
    }

    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      handleForceLogout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return httpClient(originalRequest);
    } catch (refreshError) {
      handleForceLogout();
      return Promise.reject(refreshError);
    }
  },
);

const _send = async (method, path, data, config) => {
  const response = await httpClient.request({
    ...config,
    method,
    url: path,
    data,
  });

  return response.data;
};

const get = async (path, config) => _send("get", path, null, config);
const post = async (path, data, config) => _send("post", path, data, config);
const put = async (path, data, config) => _send("put", path, data, config);
const patch = async (path, data, config) => _send("patch", path, data, config);
const del = async (path, config) => _send("delete", path, null, config);

const http = {
  get,
  post,
  put,
  patch,
  del,
};

export default http;
