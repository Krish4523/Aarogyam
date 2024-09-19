"use client";
import React, { ReactNode } from "react";
import { BriefcaseMedical, House, User } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { SidebarItem } from "@/components/SidebarItem";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BottomNav from "@/components/BottomNav";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function HospitalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hospitalNavItems = [
    { text: "Dashboard", icon: <House size={24} />, href: "/hospital" },
    {
      text: "Doctors",
      icon: <BriefcaseMedical size={24} />,
      href: "/hospital/doctor",
    },
  ];

  return (
    <ProtectedRoute requiredRole={"HOSPITAL"}>
      <main>
        <div className="max-h-screen flex flex-col">
          <div className="sm:grid sm:grid-cols-[auto,1fr] flex-grow-1 overflow-auto pb-[3.5rem] sm:pb-0">
            <Sidebar>
              {hospitalNavItems.map(({ text, icon, href }) => (
                <Link key={text} href={href} passHref>
                  <SidebarItem
                    icon={icon}
                    text={text}
                    active={pathname === href} // Determine active state
                  />
                </Link>
              ))}
            </Sidebar>
            <div className="overflow-x-hidden md:px-4 lg:px-16 pb-4">
              {/*header bar*/}
              <div className="sm:hidden fixed w-full top-0 z-10 flex items-center justify-between p-2 bg-white shadow-md">
                <Link href="/hospital">
                  <Image
                    src="/logo.svg"
                    className="overflow-hidden transition-all delay-200"
                    width={128}
                    height={64}
                    alt="Logo"
                  />
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Image
                      src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
                      alt="User Avatar"
                      className="w-10 h-10 rounded-md"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link
                        href="/patient/profile"
                        className="flex items-center gap-2"
                      >
                        <User size={16} /> Profile
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="sm:px-4 md:px-0 mt-16 sm:mt-2">{children}</div>
            </div>
          </div>
          <BottomNav />
        </div>
      </main>
    </ProtectedRoute>
  );
}

export default HospitalLayout;
