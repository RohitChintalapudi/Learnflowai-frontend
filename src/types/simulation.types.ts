export interface SimulationEntity {
  id: string;
  label: string;
  role: string;
}

export interface SimulationStep {
  stepNumber: number;
  title: string;
  description: string;
  activeEntities: string[];
  explanation: string;
}

export interface SimulationData {
  id: string;
  title: string;
  simulationType: "visual-flow" | "step-by-step" | "real-world";
  difficulty: "beginner" | "intermediate" | "advanced";
  overview: string;
  entities: SimulationEntity[];
  steps: SimulationStep[];
  summary: string;
}

export interface GenerateSimulationRequest {
  documentId: string;
  highlightedText: string;
  simulationType: "visual-flow" | "step-by-step" | "real-world";
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface GenerateSimulationResponse {
  success: boolean;
  message: string;
  simulation: SimulationData;
}
