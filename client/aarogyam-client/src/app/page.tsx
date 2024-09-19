"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { isAuthenticated, role } = useAuth();
  useEffect(() => {
    if (!isAuthenticated) redirect("/login");
    else {
      if (role === "PATIENT") redirect("/patient");
      else if (role === "DOCTOR") redirect("/doctor");
      else if (role === "HOSPITAL") redirect("/hospital");
      else if (role === "ADMIN") redirect("/admin");
    }
  }, [isAuthenticated, role]);
  return <></>;
}
