import authService from "@/services/authService";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { useState } from "react";

interface GlobalContextType {
  user: any;
  loading: boolean;
  login: any;
  register: any;
  logout: any;
}

const AuthContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: GlobalProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const _checkUser = async () => {
    try {
      setLoading(true);

      const res = await authService?.getUser();

      // if (res?.error) {
      //   console.error(res?.error);
      //   setUser(null);
      // } else {
      //   setUser(res);
      // }
      setUser(res);

      setLoading(false);
    } catch (err) {
      console.log({ err });
      setLoading(false);
    }
  };

  useEffect(() => {
    _checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService?.login(email, password);

    // if (response?.error) {
    //   return response;
    // }

    await _checkUser();
    return { success: true };
  };

  const register = async (email: string, password: string) => {
    const response = await authService.register(email, password);

    // if (response?.error) {
    //   return response;
    // }

    return login(email, password); // Auto-login after register
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    await _checkUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
