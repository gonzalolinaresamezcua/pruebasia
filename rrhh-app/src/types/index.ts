// Definición de tipos para la aplicación de RRHH

// Roles de usuario
export enum UserRole {
  EMPLOYEE = 'employee',
  HR_MANAGER = 'hr_manager',
  ADMIN = 'admin',
}

// Interfaz de usuario
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department: string;
  position: string;
  hireDate: string;
  profileImage?: string;
}

// Tipos de ausencia
export enum AbsenceType {
  VACATION = 'vacation',
  SICK_LEAVE = 'sick_leave',
  PERSONAL_LEAVE = 'personal_leave',
  MATERNITY_LEAVE = 'maternity_leave',
  PATERNITY_LEAVE = 'paternity_leave',
  OTHER = 'other',
}

// Estado de solicitud
export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Interfaz para solicitudes de ausencia
export interface AbsenceRequest {
  id: string;
  userId: string;
  type: AbsenceType;
  startDate: string;
  endDate: string;
  reason: string;
  status: RequestStatus;
  approvedBy?: string;
  approvedAt?: string;
  comments?: string;
}

// Interfaz para registro de jornada
export interface TimeRecord {
  id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: number;
  status: 'complete' | 'incomplete';
  comments?: string;
}

// Interfaz para documentos
export interface Document {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  requiresSignature: boolean;
  signatures: DocumentSignature[];
}

// Interfaz para firmas de documentos
export interface DocumentSignature {
  id: string;
  documentId: string;
  userId: string;
  signatureDate: string;
  signatureImage: string;
}

// Interfaz para eventos del calendario
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  userId?: string;
  type: 'absence' | 'meeting' | 'holiday' | 'training' | 'other';
  description?: string;
  location?: string;
}

// Interfaz para notificaciones
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  link?: string;
}

// Interfaz para el estado de autenticación
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}