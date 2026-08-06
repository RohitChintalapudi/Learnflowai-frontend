import { createAuthClient } from "better-auth/react";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://learnflowai-backend-k32r.onrender.com";

export const authClient = createAuthClient({
  baseURL: BACKEND_URL,
});
