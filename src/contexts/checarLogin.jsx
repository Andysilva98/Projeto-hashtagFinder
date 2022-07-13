import { Navigate } from "react-router-dom";

export const ChecarLogin = ({ children }) => {
  if (localStorage.getItem("Login") !== null) {
    return <Navigate to="/lista" />;
  }

  return children;
};
