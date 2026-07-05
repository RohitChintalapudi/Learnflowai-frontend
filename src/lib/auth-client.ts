import { createAuthClient } from "better-auth/react";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://ai-doubt-clarification-backend-production.up.railway.app";

export const authClient = createAuthClient({
  baseURL: BACKEND_URL,
});
