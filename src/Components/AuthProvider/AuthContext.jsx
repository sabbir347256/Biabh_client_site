import { useMemo, useState } from "react";
import { AuthProvider } from "./CreateContext";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "@tanstack/react-query";
import config from "../Pages/utilies/envconfig";

const AuthContext = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));


  const { data, isLoading, refetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () =>
      fetch(`${config.backendUrl}/user/get-profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load profile");
        }
        return res.json();
      }),
  });

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
    loading,
    data, 
    isLoading, 
    refetch
  };


  return (
    <AuthProvider.Provider value={authInfo}>
      {children}
    </AuthProvider.Provider>
  );
};

export default AuthContext;
