// auth/ProtectedRouteWithRole.tsx
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext";

interface ProtectedRouteWithRoleProps {
  allowedRoles: string[];
}

const ProtectedRouteWithRole: React.FC<ProtectedRouteWithRoleProps> = ({ allowedRoles }) => {
  const {logout} = useContext(AuthContext)!
  const userData = localStorage.getItem('userData')
    if (userData){
    const parsedData = JSON.parse(userData);
  console.log(parsedData)
  
  if (!parsedData ) {
    logout();
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(parsedData.role)) {
    return <Navigate to="/" replace />;
  }
}
  return <Outlet />;
};

export default ProtectedRouteWithRole;

// // auth/ProtectedRouteWithRole.tsx
// import React, { useContext } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { AuthContext } from "./AuthContext";

// interface ProtectedRouteWithRoleProps {
//   allowedRoles: string[];
// }

// const ProtectedRouteWithRole: React.FC<ProtectedRouteWithRoleProps> = ({ allowedRoles }) => {
//   const { user, logout } = useContext(AuthContext)!;

//   if (!user) {
//     logout();
//     return <Navigate to="/login" replace />;
//   }

//   if (!allowedRoles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRouteWithRole;
