import api from './api';
import { CalendarEvent } from '../types';

const calendarService = {
  // Obtener eventos del calendario del usuario actual
  getUserEvents: async (startDate: string, endDate: string): Promise<CalendarEvent[]> => {
    try {
      const response = await api.get<CalendarEvent[]>('/calendar/events', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener eventos del calendario de toda la empresa (para administradores y RRHH)
  getAllEvents: async (startDate: string, endDate: string): Promise<CalendarEvent[]> => {
    try {
      const response = await api.get<CalendarEvent[]>('/calendar/all-events', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear un nuevo evento
  createEvent: async (eventData: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    try {
      const response = await api.post<CalendarEvent>('/calendar/events', eventData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un evento existente
  updateEvent: async (eventId: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    try {
      const response = await api.put<CalendarEvent>(`/calendar/events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un evento
  deleteEvent: async (eventId: string): Promise<boolean> => {
    try {
      await api.delete(`/calendar/events/${eventId}`);
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Obtener días festivos nacionales y regionales
  getHolidays: async (year: number): Promise<CalendarEvent[]> => {
    try {
      const response = await api.get<CalendarEvent[]>('/calendar/holidays', {
        params: { year }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener eventos de un empleado específico (para administradores y RRHH)
  getEmployeeEvents: async (userId: string, startDate: string, endDate: string): Promise<CalendarEvent[]> => {
    try {
      const response = await api.get<CalendarEvent[]>(`/calendar/employee/${userId}/events`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Sincronizar con calendario externo (Google Calendar, Outlook, etc.)
  syncExternalCalendar: async (provider: 'google' | 'outlook', authCode: string): Promise<boolean> => {
    try {
      await api.post('/calendar/sync', { provider, authCode });
      return true;
    } catch (error) {
      throw error;
    }
  }
};

export default calendarService;