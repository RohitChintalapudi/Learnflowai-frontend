let _isAuthenticated = false;

export const authStore = {
  get isAuthenticated() {
    return _isAuthenticated;
  },
  setAuthenticated(value: boolean) {
    _isAuthenticated = value;
  }
};
