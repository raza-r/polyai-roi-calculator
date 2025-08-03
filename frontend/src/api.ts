import axios from 'axios';
import type { DealInputs, Results, VerticalTemplate } from './types';

// Use environment variable for API base URL, fallback to localhost for development
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const calculateROI = async (inputs: DealInputs): Promise<Results> => {
  const response = await api.post('/api/calc', inputs);
  return response.data;
};

export const getTemplates = async () => {
  const response = await api.get('/api/templates');
  return response.data;
};

export const getTemplate = async (vertical: VerticalTemplate): Promise<DealInputs> => {
  const response = await api.get(`/api/templates/${vertical}`);
  return response.data;
};

// Temporarily disable XLSX and PDF exports until dependencies are fixed
export const exportXLSX = async (_inputs: DealInputs): Promise<Blob> => {
  throw new Error('Excel export temporarily unavailable. Use CSV export instead.');
};

export const exportPDF = async (_inputs: DealInputs): Promise<Blob> => {
  throw new Error('PDF export temporarily unavailable. Use CSV export instead.');
};

export const exportCSV = async (inputs: DealInputs): Promise<Blob> => {
  const response = await api.post('/api/export/csv', inputs, {
    responseType: 'blob',
  });
  return response.data;
};