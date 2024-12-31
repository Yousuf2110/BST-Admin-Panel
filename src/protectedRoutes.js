import { useAuth } from "context/AuthContext";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/authentication/sign-in" />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
