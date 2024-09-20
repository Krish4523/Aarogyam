"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { LoginForm } from "@/app/(auth)/login/page";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { SignUpForm } from "@/app/(auth)/signup/page";

/**
 * Interface representing a User object.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  address: string | null;
  profileImage: string | null;
  patient:
    | {
        id: number;
        gender: string | null;
        emergencyContacts: [
          {
            id: number;
            name: string;
            phone: string;
            relation: string;
          },
        ];
      }
    | undefined;
  doctor:
    | {
        id: number;
        gender: string | null;
        hospitalId: number;
        rating: number | null;
        specialties: [
          {
            id: number;
            name: string;
          },
        ];
      }
    | undefined;
  hospital:
    | {
        id: number;
        website: string | null;
        services: [
          {
            id: number;
            name: string;
          },
        ];
      }
    | undefined;
}

/**
 * Interface representing the AuthContext type.
 */
interface AuthContextType {
  login: (data: LoginForm) => Promise<void>;
  signup: (data: SignUpForm) => Promise<void>;
  logout: () => void;
  user: User | null;
  loading: boolean;
  errorMessage: string | null;
  isAuthenticated: boolean;
}

/**
 * Creates the AuthContext with an undefined default value.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component that provides authentication context to its children.
 * @param children - The child components that will consume the AuthContext.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * useEffect hook to load user from cookies on component mount.
   */
  useEffect(() => {
    async function loadUserFromCookies() {
      const accessToken = Cookies.get("accessToken");
      console.log(accessToken);
      if (accessToken) {
        api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        try {
          const { data: authUser } = await api.get("user");
          if (authUser) setUser(authUser);
          else {
            Cookies.remove("accessToken");
            router.push("/login");
          }
        } catch (error) {
          Cookies.remove("accessToken");
          router.push("/login");
        }
      }
      setLoading(false);
    }

    loadUserFromCookies();
  }, [router]);

  /**
   * useEffect hook to handle user redirection based on authentication status and role.
   */
  useEffect(() => {
    if (loading) return;

    if (!user) {
      if (pathname !== "/login" && pathname !== "/signup") {
        router.push("/login");
      }
      return;
    }

    const rolePaths: Record<string, string> = {
      PATIENT: "/patient",
      DOCTOR: "/doctor",
      HOSPITAL: "/hospital",
      ADMIN: "/admin",
    };

    const allowedPath = rolePaths[user.role] || "/";

    if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
      if (user) {
        router.push(allowedPath);
        return;
      }
    }

    if (!pathname.startsWith(allowedPath)) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
      });
      router.push(allowedPath);
    }
  }, [loading, user, pathname, router, toast]);

  /**
   * Function to handle user login.
   * @param data - The login form data.
   */
  const login = async (data: LoginForm) => {
    setLoading(true);
    try {
      const {
        data: {
          data: { accessToken, ...authUser },
        },
      } = await api.post("auth/login", {
        email: data.emailOrPhone.includes("@") ? data.emailOrPhone : "",
        phone: data.emailOrPhone.includes("@") ? "" : data.emailOrPhone,
        password: data.password,
      });

      if (accessToken) {
        Cookies.set("accessToken", accessToken, { expires: 60 });
        api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        // @ts-ignore
        setUser(authUser);
        router.push("/");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
      });
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Function to handle user signup.
   * @param data - The signup form data.
   */
  const signup = async (data: SignUpForm) => {
    setLoading(true);
    const { confirm_password, ...dataToSend } = data;
    try {
      const {
        data: { message },
      } = await api.post("auth/signup", {
        ...dataToSend,
      });
      router.push("/login");
      toast({
        title: "Signup Successfully",
        description: message,
      });
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message,
      });
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Function to handle user logout.
   */
  const logout = async () => {
    Cookies.remove("accessToken");
    setUser(null);
    delete api.defaults.headers.Authorization;
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        login,
        logout,
        signup,
        user,
        loading,
        errorMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the AuthContext.
 * @throws Error if used outside of AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
