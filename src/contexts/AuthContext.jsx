
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { registerUserApi, loginUserApi } from '@/services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
      // Here you might want to fetch user details if the token is present
      // For now, we'll assume the token itself means the user is "logged in"
      // A proper implementation would verify the token with the backend
      // and fetch user data.
      // For simplicity, we'll just set a placeholder user if token exists.
      // This part would ideally involve a /me endpoint call.
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
          localStorage.removeItem('authUser');
        }
      } else if (token) {
         // If no user data but token exists, maybe set a generic user or try to fetch
         // For this example, if there's a token, we assume a user context might be needed.
         // A real app would fetch user details using the token.
      }

    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginUserApi(email, password);
      setToken(data.token); // Assuming API returns { token: "...", user: {...} } or just token
      // If API returns user data along with token:
      if (data.user) {
         setUser(data.user);
         localStorage.setItem('authUser', JSON.stringify(data.user));
      } else {
        // If no user data, perhaps set a generic one or leave it null for now
        // This depends on your API response structure for login
        setUser({ email }); // Placeholder
        localStorage.setItem('authUser', JSON.stringify({ email }));
      }
      toast({ title: "Login Successful", description: "Welcome back!" });
      return true;
    } catch (error) {
      toast({ title: "Login Failed", description: error.message || "Invalid credentials", variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      await registerUserApi(name, email, password);
      toast({ title: "Registration Successful", description: "You can now log in." });
      return true;
    } catch (error) {
      toast({ title: "Registration Failed", description: error.message || "Could not register user.", variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
