import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // If we are still checking if the user is logged in, show a loading spinner or nothing
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  // If checking is done and no user is found, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user is found, show the requested page
  return <Outlet />;
};