import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const SelectedProtectedRoute = () => {
  const selectedUniversity = useSelector((state) => state.university);

  const blockedUniversities = [
    "SWAMI VIVEKANAND SUBHARTI UNIVERSITY",
    "ASIAN INTERNATIONAL UNIVERSITY",
  ];

  if (
    selectedUniversity?.name &&
    !blockedUniversities.includes(selectedUniversity.name)
  ) {
    return <Outlet />;
  } else {
    return <Navigate to="dashboard" replace />;
  }
};

export default SelectedProtectedRoute;
