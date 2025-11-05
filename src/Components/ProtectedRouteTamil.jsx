// Components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const isLoggedIn = () => localStorage.getItem("user") !== null;

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    // பயனர் உள்நுழையவில்லை என்றால், அவரை உள்நுழைவு பக்கத்திற்கு மாற்றவும்
    return <Navigate to="/Sign" replace />;
  }
  // பயனர் உள்நுழைந்திருந்தால், பக்கத்தைக் காண்பிக்கவும்
  return children;
}

export default ProtectedRoute;
