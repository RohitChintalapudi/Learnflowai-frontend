import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import type { ReactNode } from "react";
import { tourSteps } from "../lib/tourConfig";
import type { TourStep } from "../lib/tourConfig";

interface TourState {
  isActive: boolean;
  currentStepIndex: number;
  isNavigating: boolean;
}

interface TourContextValue {
  tourState: TourState;
  currentStep: TourStep | null;
  totalSteps: number;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  setNavigating: (v: boolean) => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function ProductTourProvider({ children }: { children: ReactNode }) {
  const [tourState, setTourState] = useState<TourState>({
    isActive: false,
    currentStepIndex: 0,
    isNavigating: false,
  });
  const tourStateRef = useRef(tourState);

  useEffect(() => {
    tourStateRef.current = tourState;
  }, [tourState]);

  const startTour = useCallback(() => {
    localStorage.setItem("lf_tour_completed", "true");
    setTourState({
      isActive: true,
      currentStepIndex: 0,
      isNavigating: false,
    });
  }, []);

  const endTour = useCallback(() => {
    setTourState({
      isActive: false,
      currentStepIndex: 0,
      isNavigating: false,
    });
  }, []);

  const handleNext = useCallback(() => {
    setTourState((prev) => {
      if (!prev.isActive) return prev;
      const next = prev.currentStepIndex + 1;
      if (next >= tourSteps.length) {
        return { ...prev, isActive: false, currentStepIndex: 0 };
      }
      return { ...prev, currentStepIndex: next };
    });
  }, []);

  const handlePrev = useCallback(() => {
    setTourState((prev) => {
      if (!prev.isActive) return prev;
      const prevIdx = prev.currentStepIndex - 1;
      if (prevIdx < 0) return prev;
      return { ...prev, currentStepIndex: prevIdx };
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!tourStateRef.current.isActive) return;
      if (e.key === "Escape") {
        setTourState((prev) => ({ ...prev, isActive: false }));
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleNext, handlePrev]);

  const goToStep = useCallback((index: number) => {
    setTourState((prev) => {
      if (!prev.isActive) return prev;
      return { ...prev, currentStepIndex: index };
    });
  }, []);

  const setNavigating = useCallback((v: boolean) => {
    setTourState((prev) => ({ ...prev, isNavigating: v }));
  }, []);

  const currentStep = tourSteps[tourState.currentStepIndex] ?? null;

  return (
    <TourContext.Provider
      value={{
        tourState,
        currentStep,
        totalSteps: tourSteps.length,
        startTour,
        endTour,
        nextStep: handleNext,
        prevStep: handlePrev,
        goToStep,
        setNavigating,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useProductTour() {
  const ctx = useContext(TourContext);
  if (!ctx) {
    throw new Error("useProductTour must be used within ProductTourProvider");
  }
  return ctx;
}
