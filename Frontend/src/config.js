const backendurl =
  window.location.hostname === "localhost"
    ? import.meta.env.VITE_backendurl
    : "/api";

export { backendurl };

export const appfirstname = "Student";
export const applastname = "Saarthi";
