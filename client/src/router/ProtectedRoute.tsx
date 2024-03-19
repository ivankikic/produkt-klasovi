import { useEffect, useState } from "react";
import AuthService from "../auth/Auth";
import { Outlet, Navigate } from "react-router-dom";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  const checkAuth = async () => {
    setIsLoading(true); // Begin loading
    const hasTokens = AuthService.hasTokens();
    if (!hasTokens) {
      setIsAuthenticated(false);
      setIsLoading(false); // End loading
      return;
    }
    try {
      await AuthService.refreshTokens(); // Attempt to refresh tokens
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false); // Ensure loading is false after auth check
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { isAuthenticated, isLoading }; // Return isLoading as well
};

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
