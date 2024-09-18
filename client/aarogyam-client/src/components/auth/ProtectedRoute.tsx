import { redirect, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

function LoadingSpinner({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (requiredRole && role !== requiredRole) {
        toast({
          title: "Unauthorized",
          description: "redirecting",
        });
        if (role === "PATIENT") redirect("/patient");
        else if (role === "DOCTOR") redirect("/doctor");
        else if (role === "HOSPITAL") redirect("/hospital");
        else if (role === "ADMIN") redirect("/admin");
      }
    }
  }, [isAuthenticated, role, loading, requiredRole, router, toast]);

  if (loading) {
    return <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
