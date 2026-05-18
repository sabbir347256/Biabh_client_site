import { AuthProvider } from "./CreateContext";

const AuthContext = ({ children }) => {
  // const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  // const [loading, setLoading] = useState(true);

  // const user = useMemo(() => {
  //   if (!token) {
  //     setLoading(false);
  //     return null;
  //   }
  //   try {
  //     const decoded = jwtDecode(token);
  //     setLoading(false);
  //     return decoded;
  //   } catch (error) {
  //     console.error("JWT Decode Error:", error);
  //     setLoading(false);
  //     return null;
  //   }
  // }, [token]);

  // useEffect(() => {
  //   const storedToken = localStorage.getItem("accessToken");
  //   if (storedToken !== token) {
  //     setToken(storedToken);
  //   }
  //   setLoading(false);
  // }, [token]);

  const authInfo = {
    // setToken,
    // user,
    // role: user?.role,
    // loading
  };

  return (
    <AuthProvider.Provider value={authInfo}>{children}</AuthProvider.Provider>
  );
};

export default AuthContext;
