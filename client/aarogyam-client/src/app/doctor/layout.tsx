"use client";
import Sidebar from "@/components/Sidebar";
import {
  Apple,
  BellDot,
  CalendarDays,
  House,
  MessagesSquare,
  PillBottle,
  SquareLibrary,
  User,
} from "lucide-react";
import { SidebarItem } from "@/components/SidebarItem";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import BottomNav from "@/components/BottomNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DoctorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Define the sidebar items with text, icon, and route
  const sidebarItems = [
    { text: "Dashboard", icon: <House size={24} />, href: "/doctor" },
    {
      text: "Medical Records",
      icon: <SquareLibrary size={24} />,
      href: "/doctor/medical-records",
    },
    {
      text: "Appointments",
      icon: <CalendarDays size={24} />,
      href: "/doctor/appointments",
    },
    {
      text: "Medications",
      icon: <PillBottle size={24} />,
      href: "/doctor/medications",
    },
    {
      text: "Reminders",
      icon: <BellDot size={24} />,
      href: "/doctor/reminders",
      alert: true,
    },
    {
      text: "AI Chats",
      icon: <MessagesSquare size={24} />,
      href: "/patient/ai-chat",
    },
    {
      text: "Food Insights",
      icon: <Apple size={24} />,
      href: "/patient/know-your-food",
    },
  ];

  return (
    <main>
      <div className="max-h-screen flex flex-col">
        <div className="sm:grid sm:grid-cols-[auto,1fr] flex-grow-1 overflow-auto pb-[3.5rem] sm:pb-0">
          <Sidebar>
            {sidebarItems.map(({ text, icon, href, alert }) => (
              <Link key={text} href={href} passHref>
                <SidebarItem
                  icon={icon}
                  text={text}
                  active={pathname === href} // Determine active state
                  alert={alert}
                />
              </Link>
            ))}
          </Sidebar>
          <div className="overflow-x-hidden md:px-10 lg:px-16 pb-4">
            {/*header bar*/}
            <div className="sm:hidden fixed w-full top-0 z-10 flex items-center justify-between p-2 bg-white shadow-md">
              <Link href="/doctor">
                <img
                  src="/logo.svg"
                  className="overflow-hidden transition-all delay-200"
                  width={128}
                  height={64}
                  alt="Logo"
                />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <img
                    src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-md"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/*<DropdownMenuLabel></DropdownMenuLabel>*/}
                  {/*<DropdownMenuSeparator />*/}
                  <DropdownMenuItem>
                    <Link
                      href="/patient/profile"
                      className="flex items-center gap-2"
                    >
                      <User size={16} /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/patient/reminders"
                      className="flex items-center gap-2"
                    >
                      <BellDot size={16} /> Reminders
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="px-8 mt-16 sm:mt-2">{children}</div>
          </div>
        </div>
        <BottomNav />
      </div>
    </main>
  );
}
