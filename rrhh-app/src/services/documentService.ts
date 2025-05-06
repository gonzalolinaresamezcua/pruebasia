import api from './api';
import { Document, DocumentSignature } from '../types';

const documentService = {
  // Obtener todos los documentos
  getAllDocuments: async (page = 1, limit = 10): Promise<{
    documents: Document[];
    total: number;
    pages: number;
  }> => {
    try {
      const response = await api.get<{
        documents: Document[];
        total: number;
        pages: number;
      }>('/documents', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener documentos que requieren firma del usuario actual
  getDocumentsRequiringSignature: async (): Promise<Document[]> => {
    try {
      const response = await api.get<Document[]>('/documents/pending-signature');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener un documento específico por ID
  getDocumentById: async (documentId: string): Promise<Document> => {
    try {
      const response = await api.get<Document>(`/documents/${documentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Subir un nuevo documento
  uploadDocument: async (
    formData: FormData
  ): Promise<Document> => {
    try {
      const response = await api.post<Document>('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar información de un documento
  updateDocument: async (
    documentId: string,
    data: Partial<Document>
  ): Promise<Document> => {
    try {
      const response = await api.put<Document>(`/documents/${documentId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un documento
  deleteDocument: async (documentId: string): Promise<boolean> => {
    try {
      await api.delete(`/documents/${documentId}`);
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Firmar un documento
  signDocument: async (
    documentId: string,
    signatureData: string
  ): Promise<DocumentSignature> => {
    try {
      const response = await api.post<DocumentSignature>(`/documents/${documentId}/sign`, {
        signatureData
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener todas las firmas de un documento
  getDocumentSignatures: async (documentId: string): Promise<DocumentSignature[]> => {
    try {
      const response = await api.get<DocumentSignature[]>(`/documents/${documentId}/signatures`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Descargar un documento
  downloadDocument: async (documentId: string): Promise<Blob> => {
    try {
      const response = await api.get(`/documents/${documentId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Compartir un documento con otros usuarios
  shareDocument: async (
    documentId: string,
    userIds: string[],
    requireSignature: boolean
  ): Promise<boolean> => {
    try {
      await api.post(`/documents/${documentId}/share`, {
        userIds,
        requireSignature
      });
      return true;
    } catch (error) {
      throw error;
    }
  }
};

export default documentService;