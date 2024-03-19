import { createContext, useContext, useEffect, useState } from "react";
import AuthService from "./Auth";

interface AuthContextType {
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({ isLoggedIn: false });

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(AuthService.hasTokens());
    // Optionally, listen for changes in authentication state
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  return useContext(AuthContext);
};
