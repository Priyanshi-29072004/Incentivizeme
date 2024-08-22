import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const refreshAuthToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    const response = await instance.post("token/refresh/", {
      refresh: refreshToken,
    });
    localStorage.setItem("access_token", response.data.access);
    instance.defaults.headers[
      "Authorization"
    ] = `Bearer ${response.data.access}`;
    return response.data.access;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    let errorMessage =
      error.response.data.message || "An error occurred. Please try again.";

    if (axios.isAxiosError(error)) {
      console.log(">>>>>error", error);
      if (error.response) {
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newAccessToken = await refreshAuthToken();
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return instance(originalRequest);
          } catch (refreshError) {
            errorMessage =
              "User verification failed. Token is invalid or expired. Please log in again.";
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
          }
        } else if (error.response.status === 404) {
          errorMessage =
            "The requested resource was not found. Please contact the administrator.";
        } else {
          errorMessage =
            error.response.data.message ||
            "An error occurred. Please try again later.";
        }
      } else if (error.request) {
        errorMessage =
          "Something went wrong. Please contact the administrator.";
      } else {
        errorMessage = error.response.data.message;
      }
    }
    console.log(">>>>>>>>>>", errorMessage);
    return Promise.reject(errorMessage);
  }
);

export default instance;
