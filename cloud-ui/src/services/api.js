import axios from "axios";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" }
});

const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000
});

export const getMetricsLive = (callback) => {
  socket.on("metrics", callback);
};

export const listenToClusterScaling = (callback) => {
  socket.on("escalado", callback);
};

export const listenToUserUpdates = (callback) => {
  socket.on("usuarios", callback);
};

export const getSystemStatus = async () => {
  try {
    const response = await api.get("/status");
    return response.data;
  } catch (error) {
    console.error("⚠️ Error al obtener el estado del sistema:", error.response?.data || error.message);
    return null;
  }
};

export const getClusters = async () => {
  try {
    const response = await api.get("/clusters");
    return response.data || [];
  } catch (error) {
    console.error("⚠️ Error al obtener clústeres:", error.response?.data || error.message);
    return [];
  }
};

export const scaleCluster = async (id, replicas) => {
  if (!id || replicas === undefined || replicas === null || replicas < 1) {
    console.error("⚠️ Error: ID y número de réplicas válidos son obligatorios.");
    return;
  }

  console.log(`📡 Enviando solicitud para escalar clúster ID=${id}, Réplicas=${replicas}`);

  try {
    const response = await api.post("/clusters/scale", { id, replicas });
    console.log(`✅ Clúster ${id} escalado a ${replicas} réplicas.`);
    return response.data;
  } catch (error) {
    console.error("⚠️ Error al escalar clúster:", error.response?.data || error.message);
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data || [];
  } catch (error) {
    console.error("⚠️ Error al obtener usuarios:", error.response?.data || error.message);
    return [];
  }
};

export const addUser = async (userData) => {
  if (!userData.name || !userData.email || !userData.role) {
    console.error("⚠️ Error: Todos los campos del usuario son obligatorios.");
    return;
  }

  console.log(`📡 Enviando solicitud para agregar usuario:`, userData);

  try {
    const response = await api.post("/users", userData);
    console.log(`✅ Usuario agregado correctamente.`);
    return response.data;
  } catch (error) {
    console.error("⚠️ Error al agregar usuario:", error.response?.data || error.message);
  }
};

export const deleteUser = async (id) => {
  if (!id) {
    console.error("⚠️ Error: ID de usuario es obligatorio para eliminar.");
    return;
  }

  console.log(`📡 Enviando solicitud para eliminar usuario ID=${id}`);

  try {
    const response = await api.delete(`/users/${id}`);
    console.log(`✅ Usuario ${id} eliminado correctamente.`);
    return response.data;
  } catch (error) {
    console.error("⚠️ Error al eliminar usuario:", error.response?.data || error.message);
  }
};

export default api;
