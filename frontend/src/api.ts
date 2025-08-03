import axios from 'axios';
import type { DealInputs, Results, VerticalTemplate } from './types';

const API_BASE = 'http://localhost:8000';

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

export const exportXLSX = async (inputs: DealInputs): Promise<Blob> => {
  const response = await api.post('/api/export/xlsx', inputs, {
    responseType: 'blob',
  });
  return response.data;
};

export const exportPDF = async (inputs: DealInputs): Promise<Blob> => {
  const response = await api.post('/api/export/pdf', inputs, {
    responseType: 'blob',
  });
  return response.data;
};

export const exportCSV = async (inputs: DealInputs): Promise<Blob> => {
  const response = await api.post('/api/export/csv', inputs, {
    responseType: 'blob',
  });
  return response.data;
};