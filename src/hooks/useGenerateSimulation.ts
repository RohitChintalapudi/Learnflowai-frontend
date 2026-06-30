import { useMutation } from '@tanstack/react-query';
import { SimulationService } from '../services/simulation.service';
import type { GenerateSimulationRequest, GenerateSimulationResponse } from '../types/simulation.types';

export const useGenerateSimulation = () => {
  return useMutation<GenerateSimulationResponse, Error, GenerateSimulationRequest>({
    mutationFn: (data: GenerateSimulationRequest) => SimulationService.generateSimulation(data),
  });
};
