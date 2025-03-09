import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    localStorage.setItem("token", response.data.token); // Guardar token en localStorage
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Error de autenticación" };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token"); // Eliminar token al cerrar sesión
};

export const getToken = () => {
  return localStorage.getItem("token");
};
