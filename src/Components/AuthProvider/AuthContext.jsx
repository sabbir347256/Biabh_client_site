import { useMemo, useState } from "react";
import { AuthProvider } from "./CreateContext";
import { jwtDecode } from "jwt-decode";

const AuthContext = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));

  const user = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("JWT Decode Error:", error);
      return null;
    }
  }, [token]);

  const loading = false;
  
  const authInfo = {
    setToken,
    user,
    role: user?.role,
    loading
  };


  return (
    <AuthProvider.Provider value={authInfo}>
      {children}
    </AuthProvider.Provider>
  );
};

export default AuthContext;
