// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitForm } from "@/utils/submitForm";
import { useToast } from "@/components/ui/use-toast";
import { LoginForm } from "@/app/(auth)/login/page";
import { SignUpForm } from "@/app/(auth)/signup/page";
import Cookie from "js-cookie";
import axios from "axios";

interface AuthContextType {
  login: (data: LoginForm) => Promise<void>;
  signup: (data: SignUpForm) => Promise<void>;
  logout: () => void;
  user: any; // Replace with your user type
  loading: boolean;
  errorMessage: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(
    Cookie.get("Authorization") || null
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        if (authToken === null) throw new Error("Token not present");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookie.get("Authorization")}`,
            },
          }
        );
        const userData = response.data;
        setIsAuthenticated(true);
        setIsAuthenticated(true);
        setUser(userData);
        // @ts-ignore
        setRole(userData.role);
        router.push("/");
      } catch (error) {
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
        // Cookie.remove("Authorization");
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [authToken, router]);

  useEffect(() => {
    setAuthToken(Cookie.get("Authorization") || null);
  }, []);

  const login = async (data: LoginForm) => {
    setLoading(true);
    try {
      await submitForm({
        data: {
          email: data.emailOrPhone.includes("@") ? data.emailOrPhone : "",
          phone: data.emailOrPhone.includes("@") ? "" : data.emailOrPhone,
          password: data.password,
        },
        endpoint: "auth/login",
        setLoading,
        setErrorMessage,
        onSuccess: async (response) => {
          const { accessToken, ...userData } = response.data.data;
          Cookie.set("Authorization", accessToken, { expires: 7 });
          setIsAuthenticated(true);
          setUser(userData);
          // @ts-ignore
          setRole(userData.role);
          router.push("/");
        },
        onError: (error) => {
          toast({
            title: "Login Failed",
            description: error.message,
          });
        },
      });
    } catch (error) {
      setErrorMessage("Failed to login");
      toast({
        title: "Login Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignUpForm) => {
    setLoading(true);
    const { confirm_password, ...dataToSend } = data;
    try {
      await submitForm({
        data: dataToSend,
        endpoint: "auth/signup",
        setLoading,
        setErrorMessage,
        onSuccess: (response) => {
          router.push("/login"); // Redirect to a secure page after signup
          toast({
            title: "Signup Successfully",
            description: response.data.message,
          });
        },
        onError: (error) => {
          toast({
            title: "Signup Failed",
            description: error.message,
          });
        },
      });
    } catch (error) {
      setErrorMessage("Failed to signup");
    } finally {
      setLoading(false);
      setInterval(() => setErrorMessage(""), 5000);
    }
  };

  const logout = () => {
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        signup,
        logout,
        user,
        loading,
        errorMessage,
        isAuthenticated,
        authToken,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
