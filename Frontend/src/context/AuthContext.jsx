import { createContext, useState, useEffect } from "react";
import authService from "../features/auth/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const data = await authService.register(userData);
      setUser(data);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    setIsLoading(true);
    try {
      const data = await authService.login(userData);
      setUser(data);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
