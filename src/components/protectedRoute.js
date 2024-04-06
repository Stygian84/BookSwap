import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from '../firebase'; // Assuming you have a function to check authentication status

const ProtectedRoute = ({ path, element }) => {
  return (
    <Route
      path={path}
      element={isAuthenticated() ? element : <Navigate to="/login" replace />}
    />
  );
};

export default ProtectedRoute;
