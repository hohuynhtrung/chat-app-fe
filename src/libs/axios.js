import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_API || "";

// Các endpoint này trả 401 là lỗi nghiệp vụ (sai mật khẩu, hết hạn refresh...),
// không được kích hoạt cơ chế refresh token.
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];
const PUBLIC_PATHS = ["/login", "/register"];

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // gửi/nhận cookie refresh_token
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token"); // dọn token cũ nếu còn
};

// Refresh token nằm trong cookie, backend tự đọc, FE không cần gửi gì trong body
const refreshToken = async () => {
  const response = await axios.post(`${BASE_URL}/auth/refresh`, null, {
    withCredentials: true,
  });
  const data = response.data?.data ?? response.data;
  const newAccessToken = data?.accessToken ?? data?.access_token;
  if (!newAccessToken) throw new Error("Refresh không trả về access token");
  localStorage.setItem("access_token", newAccessToken);
  return newAccessToken;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    const apiData =
      response.data?.data !== undefined ? response.data.data : response.data;
    return { ...response, data: apiData };
  },
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || "";
    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => url.includes(path));

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint
    ) {
      return Promise.reject(error);
    }

    // Đang có một lần refresh chạy: xếp hàng chờ rồi gọi lại với token mới
    if (isRefreshing) {
      try {
        const token = await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await refreshToken();
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearTokens();
      if (
        typeof window !== "undefined" &&
        !PUBLIC_PATHS.includes(window.location.pathname)
      ) {
        window.location.href = "/login";
      }
      return Promise.reject(error); // trả lỗi 401 gốc để nơi gọi vẫn đọc được err.response
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
