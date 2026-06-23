export const authStore = {
  get isAuthenticated() {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("isAuthenticated") === "true";
  },
  setAuthenticated(value: boolean) {
    if (typeof window === "undefined") return;
    if (value) {
      localStorage.setItem("isAuthenticated", "true");
    } else {
      localStorage.removeItem("isAuthenticated");
    }
  }
};
