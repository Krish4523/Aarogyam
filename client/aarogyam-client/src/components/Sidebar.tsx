"use client";

import { ChevronLeft, MoreVertical } from "lucide-react";
import { createContext, ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const SidebarContext = createContext({ expanded: true });

export default function Sidebar({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 1024) {
        setExpanded(false); // Collapse on smaller screens
      } else {
        setExpanded(true); // Expand on larger screens
      }
    }

    window.addEventListener("resize", handleResize);

    // Set initial state based on the current window size
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <aside
      className={`h-screen ${expanded ? "w-[14rem]" : "w-16"} transition-all duration-200 ease-in-out hidden sm:block`}
    >
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-2.5 flex justify-between items-center">
          {expanded && (
            <Link href="/">
              <Image
                src="/logo.svg"
                className="overflow-hidden transition-all delay-200"
                width={128}
                height={64}
                alt="Logo"
              />
            </Link>
          )}
          <Button
            onClick={() => setExpanded((curr) => !curr)}
            className={expanded ? "p-1.5" : "p-0.5"}
            variant="ghost"
          >
            {expanded ? (
              <ChevronLeft />
            ) : (
              <Image
                src="/logo-icon.svg"
                className="overflow-hidden transition-all delay-200"
                width={70}
                height={70}
                alt="Logo Icon"
              />
            )}
          </Button>
        </div>
        <hr className="border-r border-gray-200 mx-2" />
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 flex flex-col gap-1 px-4 my-2">{children}</ul>
        </SidebarContext.Provider>

        <Link href="/patient/profile">
          <div className="border-t flex p-3">
            <img
              src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
              alt="User Avatar"
              className="w-10 h-10 rounded-md"
            />
            <div
              className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
            >
              <div className="leading-4">
                <h4 className="text-sm font-semibold">John Doe</h4>
                <span className="text-xs text-gray-600">johndoe@gmail.com</span>
              </div>
              <MoreVertical size={20} />
            </div>
          </div>
        </Link>
      </nav>
    </aside>
  );
}
