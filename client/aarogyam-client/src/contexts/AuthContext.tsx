// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import axios from "axios";
//
// interface User {
//   name: string;
//   email: string;
//   phone: string;
// }
//
// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// }
//
// const AuthContext = createContext<AuthContextType | undefined>(undefined);
//
// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//
//   useEffect(() => {
//     const verifyUser = async () => {
//       try {
//         const response = await axios.get("/api/auth/verify");
//         setUser(response.data.user);
//       } catch (error) {
//         setUser(null);
//       }
//     };
//
//     verifyUser();
//   }, []);
//
//   // const login = async (email: string, password: string) => {
//   //   const response = await axios.post("/api/auth/login", { email, password });
//   //   setUser(response.data.user);
//   // };
//   //
//   // const logout = async () => {
//   //   await axios.post("/api/auth/logout");
//   //   setUser(null);
//   // };
//
//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
//
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
