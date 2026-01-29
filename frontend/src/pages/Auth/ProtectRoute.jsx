// import React, { useContext } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';

// const ProtectedRoute = ({ allowedRoles }) => {
//   const { user, token } = useContext(AuthContext);

//   // 1. Check if user is logged in
//   if (!token || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   // 2. Check if user has the correct role for this route
//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     // If they are a 'user' trying to access 'admin', send them to their own dashboard
//     return <Navigate to={`/${user.role}/dashboard`} replace />;
//   }

//   // 3. If everything is fine, render the child components (Outlet)
//   return <Outlet />;
// };

// export default ProtectedRoute;