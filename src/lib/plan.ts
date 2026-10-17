import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlanAPI, type PlanStatus } from "./api";

const FREE_PLAN: PlanStatus = {
  plan: "free",
  interval: null,
  startedAt: null,
  expiresAt: null,
  isActive: false,
};

export function usePlan(enabled = true) {
  const query = useQuery({
    queryKey: ["plan"],
    queryFn: PlanAPI.getPlan,
    enabled,
    retry: false,
    staleTime: 30_000,
  });

  return {
    plan: query.data ?? FREE_PLAN,
    isLoading: query.isLoading,
  };
}

export function useUpgradePlan() {
  const queryClient = useQueryClient();

  return async (interval: "monthly" | "yearly"): Promise<PlanStatus> => {
    const plan = await PlanAPI.upgradeToPro(interval);
    queryClient.setQueryData(["plan"], plan);
    return plan;
  };
}

export function formatPlanExpiry(expiresAt: string): string {
  return new Date(expiresAt).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
