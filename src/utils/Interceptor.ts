import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const navigate = error.config.navigate;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        if (navigate) navigate("/l");
        return;
      }

      try {
        const res = await axios.post("http://localhost:5000/auth/refresh", {
          refreshToken,
        });

        const newAccessToken = res.data.token;

        localStorage.setItem("token", newAccessToken);

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        if (navigate) navigate("/");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
