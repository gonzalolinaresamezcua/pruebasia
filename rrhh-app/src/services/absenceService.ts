import api from './api';
import { AbsenceRequest, AbsenceType, RequestStatus } from '../types';

const absenceService = {
  // Crear una nueva solicitud de ausencia
  createRequest: async (data: {
    type: AbsenceType;
    startDate: string;
    endDate: string;
    reason: string;
  }): Promise<AbsenceRequest> => {
    try {
      const response = await api.post<AbsenceRequest>('/absences', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener todas las solicitudes del usuario actual
  getUserRequests: async (): Promise<AbsenceRequest[]> => {
    try {
      const response = await api.get<AbsenceRequest[]>('/absences/my-requests');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener una solicitud específica por ID
  getRequestById: async (requestId: string): Promise<AbsenceRequest> => {
    try {
      const response = await api.get<AbsenceRequest>(`/absences/${requestId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar una solicitud de ausencia (solo el propietario y antes de ser aprobada/rechazada)
  updateRequest: async (
    requestId: string,
    data: Partial<AbsenceRequest>
  ): Promise<AbsenceRequest> => {
    try {
      const response = await api.put<AbsenceRequest>(`/absences/${requestId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancelar una solicitud de ausencia (solo el propietario y antes de ser aprobada/rechazada)
  cancelRequest: async (requestId: string): Promise<boolean> => {
    try {
      await api.delete(`/absences/${requestId}`);
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Obtener todas las solicitudes pendientes (para administradores y RRHH)
  getPendingRequests: async (page = 1, limit = 10): Promise<{
    requests: AbsenceRequest[];
    total: number;
    pages: number;
  }> => {
    try {
      const response = await api.get<{
        requests: AbsenceRequest[];
        total: number;
        pages: number;
      }>('/absences/pending', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener todas las solicitudes (para administradores y RRHH)
  getAllRequests: async (
    page = 1,
    limit = 10,
    status?: RequestStatus,
    type?: AbsenceType,
    startDate?: string,
    endDate?: string
  ): Promise<{
    requests: AbsenceRequest[];
    total: number;
    pages: number;
  }> => {
    try {
      const response = await api.get<{
        requests: AbsenceRequest[];
        total: number;
        pages: number;
      }>('/absences', {
        params: { page, limit, status, type, startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Aprobar una solicitud de ausencia (para administradores y RRHH)
  approveRequest: async (requestId: string, comments?: string): Promise<AbsenceRequest> => {
    try {
      const response = await api.put<AbsenceRequest>(`/absences/${requestId}/approve`, { comments });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Rechazar una solicitud de ausencia (para administradores y RRHH)
  rejectRequest: async (requestId: string, comments: string): Promise<AbsenceRequest> => {
    try {
      const response = await api.put<AbsenceRequest>(`/absences/${requestId}/reject`, { comments });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener el balance de días de vacaciones del usuario actual
  getVacationBalance: async (): Promise<{
    total: number;
    used: number;
    pending: number;
    remaining: number;
  }> => {
    try {
      const response = await api.get<{
        total: number;
        used: number;
        pending: number;
        remaining: number;
      }>('/absences/vacation-balance');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generar informe de ausencias
  generateReport: async (
    startDate: string,
    endDate: string,
    type?: AbsenceType,
    userId?: string
  ): Promise<Blob> => {
    try {
      const response = await api.get('/absences/report', {
        params: { startDate, endDate, type, userId },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default absenceService;