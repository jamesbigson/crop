// Components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const isLoggedIn = () => localStorage.getItem("user") !== null;

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/Sign" replace />;
  }
  return children;
}

export default ProtectedRoute;
