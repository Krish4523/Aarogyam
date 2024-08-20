"use client";
import Sidebar from "@/components/Sidebar";
import {
  BellDot,
  CalendarDays,
  House,
  PillBottle,
  SquareLibrary,
  MessagesSquare,
} from "lucide-react";
import { SidebarItem } from "@/components/SidebarItem";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import BottomNav from "@/components/BottomNav";

export default function PatientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname(); // Get the current pathname

  // Define the sidebar items with text, icon, and route
  const sidebarItems = [
    { text: "Dashboard", icon: <House size={24} />, href: "/patient" },
    {
      text: "Medical Records",
      icon: <SquareLibrary size={24} />,
      href: "/patient/medical-records",
    },
    {
      text: "Appointments",
      icon: <CalendarDays size={24} />,
      href: "/patient/appointments",
    },
    {
      text: "Medications",
      icon: <PillBottle size={24} />,
      href: "/patient/medications",
    },
    {
      text: "Reminders",
      icon: <BellDot size={24} />,
      href: "/patient/reminders",
      alert: true,
    },
    {
      text: "AI Chats",
      icon: <MessagesSquare size={24} />,
      href: "/patient/chat-history",
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
          <div className="overflow-x-hidden px-8 md:px-10 lg:px-16 pb-4">
            {children}
          </div>
        </div>
        <BottomNav />
      </div>
    </main>
  );
}
