export type ProPlanInterval = "monthly" | "yearly";

export function getIsPro(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem("lf_is_pro") === "true";
}

export function getProPlan(): ProPlanInterval | null {
  if (typeof localStorage === "undefined") return null;
  const plan = localStorage.getItem("lf_pro_plan");
  return plan === "monthly" || plan === "yearly" ? plan : null;
}
