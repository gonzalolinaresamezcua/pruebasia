import api from './api';
import { User } from '../types';
import jwt_decode from 'jwt-decode';

interface LoginResponse {
  token: string;
  user: User;
}

interface DecodedToken {
  userId: string;
  role: string;
  exp: number;
}

const authService = {
  // Iniciar sesión
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Registrar un nuevo usuario (solo para administradores)
  register: async (userData: Partial<User>, password: string): Promise<User> => {
    try {
      const response = await api.post<User>('/auth/register', { ...userData, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cerrar sesión
  logout: (): void => {
    localStorage.removeItem('token');
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded = jwt_decode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      
      // Verificar si el token ha expirado
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        return false;
      }
      
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }
  },

  // Obtener el usuario actual
  getCurrentUser: async (): Promise<User | null> => {
    try {
      if (!authService.isAuthenticated()) return null;
      
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  },

  // Cambiar contraseña
  changePassword: async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      await api.post('/auth/change-password', { oldPassword, newPassword });
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Solicitar restablecimiento de contraseña
  requestPasswordReset: async (email: string): Promise<boolean> => {
    try {
      await api.post('/auth/request-reset', { email });
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Restablecer contraseña con token
  resetPassword: async (token: string, newPassword: string): Promise<boolean> => {
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      return true;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;