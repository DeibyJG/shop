import { createContext, useState, useEffect } from "react";
import apiClient from "../api/apiClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validacion de sesion persistente
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (token && role) {
      setUser({ token, role, name });
    }
    setLoading(false);
  }, []);

  // Proceso de inicio de sesion
  const login = async (email, password) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const { token, role, name } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (name) localStorage.setItem("name", name);
      setUser({ token, role, name });

      return { success: true, role };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Error de conexion",
      };
    }
  };

  // Proceso de cierre de sesion
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
