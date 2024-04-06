import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from '../firebase'; 

const ProtectedRoute = ({ path, element }) => {
  return (
    <Route
      path={path}
      element={isAuthenticated() ? element : <Navigate to="/login" replace />}
    />
  );
};

export default ProtectedRoute;
