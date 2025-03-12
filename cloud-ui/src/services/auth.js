import api from "./api";

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    console.error("⚠️ Error al iniciar sesión:", error.response?.data || error.message);
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};


export const register = async (name, email, password, role = "user") => {
  try {
    const response = await api.post("/auth/register", { name, email, password, role });
    return response.data;
  } catch (error) {
    console.error("⚠️ Error al registrar usuario:", error.response?.data || error.message);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token almacenado");

    const response = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("⚠️ Error al obtener el usuario actual:", error.response?.data || error.message);
    return null;
  }
};
