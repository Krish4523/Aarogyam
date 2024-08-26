// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { submitForm } from "@/utils/submitForm";
import { useToast } from "@/components/ui/use-toast";
import { LoginForm } from "@/app/(auth)/login/page";
import { SignUpForm } from "@/app/(auth)/signup/page";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const login = async (data: LoginForm) => {
    setLoading(true);
    try {
      await submitForm({
        data: {
          email: data.emailOrPhone.includes("@") ? data.emailOrPhone : "",
          phone: data.emailOrPhone.includes("@") ? "" : data.emailOrPhone,
          password: data.password,
        },
        endpoint: "api/login",
        setLoading,
        setErrorMessage,
        onSuccess: (response) => {
          setUser(response.user); // Assuming response contains user data
          router.push("/dashboard"); // Redirect to a secure page after login
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
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignUpForm) => {
    setLoading(true);
    try {
      await submitForm({
        data,
        endpoint: "auth/signup",
        setLoading,
        setErrorMessage,
        onSuccess: (response) => {
          setUser(response.user); // Assuming response contains user data
          router.push("/patient"); // Redirect to a secure page after signup
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
    }
  };

  const logout = () => {
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ login, signup, logout, user, loading, errorMessage }}
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
