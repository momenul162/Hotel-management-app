// import { Navigate, useLocation } from "react-router-dom";
// import { useAppSelector } from "../../redux/hooks";

// interface AuthGuardProps {
//   children: React.ReactNode;
// }

// export const AuthGuard = ({ children }: AuthGuardProps) => {
//   const { isAuthenticated } = useAppSelector((state) => state.auth);
//   const location = useLocation();

//   if (!isAuthenticated) {
//     // Redirect to login with a return url
//     return <Navigate to="/login" state={{ from: location.pathname }} replace />;
//   }

//   return <>{children}</>;
// };
