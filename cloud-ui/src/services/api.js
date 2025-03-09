import axios from "axios";

const API_URL = "http://localhost:3001/api"; // Cambia si el backend está en otro host

export const getSystemStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/status`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el estado del sistema:", error);
    return null;
  }
};


