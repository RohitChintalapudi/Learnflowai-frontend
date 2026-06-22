import axios from 'axios';
import type { GenerateSimulationRequest, GenerateSimulationResponse } from '../types/simulation.types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const API_BASE_URL = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const SimulationService = {
  async generateSimulation(data: GenerateSimulationRequest): Promise<GenerateSimulationResponse> {
    const response = await api.post<GenerateSimulationResponse>('/workflow/simulation', data);
    return response.data;
  }
};
