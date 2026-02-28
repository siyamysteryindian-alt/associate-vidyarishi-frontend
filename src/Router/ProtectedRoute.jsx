import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRole }) => {
  const role = useSelector((state) => state?.user?.role);
  const LocalstorageToken = localStorage.getItem("LoggedUser");

  return role === allowedRole ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
