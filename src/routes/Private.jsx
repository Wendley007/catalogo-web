/* eslint-disable react/prop-types */
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function Private({ children }) {
  const { signed, loadingAuth } = useContext(AuthContext);

  if (loadingAuth) {
    return null;
  }

  if (!signed) {
    return <Navigate to="/Admin" />;
  }

  return children;
}
