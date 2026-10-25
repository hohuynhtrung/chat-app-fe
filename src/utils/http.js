import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_API;

export const httpClient = axios.create({
  baseURL,
  withCredentials: true,
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
  const response = await axios.post(`${baseURL}/auth/refresh`, null, {
    withCredentials: true,
  });

  const data = response.data?.data || response.data;
  const accessToken = data?.accessToken;

  if (!accessToken) {
    throw new Error("Failed to refresh access token");
  }

  localStorage.setItem("accessToken", accessToken);
  return accessToken;
};

const handleForceLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  if (!window.location.pathname.includes("/login")) {
    window.location.href = `${import.meta.env.BASE_URL}login`;
  }
};

const SKIP_REFRESH_URLS = [
  "auth/login",
  "auth/register",
  "auth/refresh",
  "auth/verify-email",
];

httpClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || "";
    const skipRefresh = SKIP_REFRESH_URLS.some((path) => url.includes(path));

    if (status !== 401 || originalRequest._retry || skipRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return httpClient(originalRequest);
    } catch (error) {
      handleForceLogout();
      return Promise.reject(ReferenceError);
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
