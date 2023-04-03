const extractToken = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");
  const expiresAt = queryParams.get("expiresAt");

  if (token && expiresAt) {
    setToken(token, expiresAt);
    window.history.replaceState(null, "", window.location.pathname);
  }
};

const setToken = (token: string, expiresAt: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("expiresAt", expiresAt);
};

const getToken = (): string | null => {
  return localStorage.getItem("token");
};

const isTokenValid = () => {
  if (getToken() == null) return false;
  const expiresAt = localStorage.getItem("expiresAt");
  if (expiresAt == null) return false;
  return Date.now() / 1000 < Number(expiresAt);
};

const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expiresAt");
};

export default {
  extractToken,
  setToken,
  getToken,
  isTokenValid,
  clearToken,
};
