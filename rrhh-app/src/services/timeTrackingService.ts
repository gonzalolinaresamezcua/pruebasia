import api from './api';
import { TimeRecord } from '../types';

const timeTrackingService = {
  // Registrar entrada
  checkIn: async (): Promise<TimeRecord> => {
    try {
      const response = await api.post<TimeRecord>('/time-tracking/check-in');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Registrar salida
  checkOut: async (): Promise<TimeRecord> => {
    try {
      const response = await api.post<TimeRecord>('/time-tracking/check-out');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener registro de jornada actual
  getCurrentTimeRecord: async (): Promise<TimeRecord | null> => {
    try {
      const response = await api.get<TimeRecord>('/time-tracking/current');
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Obtener historial de registros de jornada del usuario actual
  getUserTimeRecords: async (startDate: string, endDate: string): Promise<TimeRecord[]> => {
    try {
      const response = await api.get<TimeRecord[]>('/time-tracking/history', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener registros de jornada de un usuario específico (para administradores y RRHH)
  getEmployeeTimeRecords: async (userId: string, startDate: string, endDate: string): Promise<TimeRecord[]> => {
    try {
      const response = await api.get<TimeRecord[]>(`/time-tracking/employee/${userId}`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener registros de jornada de todos los empleados (para administradores y RRHH)
  getAllTimeRecords: async (startDate: string, endDate: string, page = 1, limit = 10): Promise<{
    records: TimeRecord[];
    total: number;
    pages: number;
  }> => {
    try {
      const response = await api.get<{
        records: TimeRecord[];
        total: number;
        pages: number;
      }>('/time-tracking/all', {
        params: { startDate, endDate, page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Editar un registro de jornada (para administradores y RRHH)
  updateTimeRecord: async (recordId: string, data: Partial<TimeRecord>): Promise<TimeRecord> => {
    try {
      const response = await api.put<TimeRecord>(`/time-tracking/${recordId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear un registro de jornada manualmente (para administradores y RRHH)
  createTimeRecord: async (data: Partial<TimeRecord>): Promise<TimeRecord> => {
    try {
      const response = await api.post<TimeRecord>('/time-tracking/manual', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generar informe de jornada laboral
  generateReport: async (startDate: string, endDate: string, userId?: string): Promise<Blob> => {
    try {
      const response = await api.get('/time-tracking/report', {
        params: { startDate, endDate, userId },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default timeTrackingService;