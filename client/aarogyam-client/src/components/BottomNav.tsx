import React from "react";
import {
  Apple,
  CalendarDays,
  CircleEllipsis,
  House,
  MessagesSquare,
  PillBottle,
  SquareLibrary,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full py-4 z-10 bg-zinc-100 dark:bg-zinc-950 border-t dark:border-zinc-800 border-zinc-200 shadow-lg sm:hidden ">
      <ul className="flex flex-row justify-around items-center bg-transparent w-full">
        <li className="flex items-center">
          <Link href="/patient/">
            <House size={24} /> {/*Dashboard*/}
          </Link>
        </li>
        <li className="flex items-center">
          <Link href="/patient/medical-records">
            <SquareLibrary size={24} />
            {/*Medical Records*/}
          </Link>
        </li>
        <li className="flex items-center">
          <Link href="/patient/appointments">
            <CalendarDays size={24} />
            {/*Appointments*/}
          </Link>
        </li>
        <li className="flex items-center">
          <Link href="/patient/medications">
            <PillBottle size={24} />
            {/*Medications*/}
          </Link>
        </li>
        <li className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <CircleEllipsis size={24} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel></DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href="/patient/ai-chat"
                  className="flex items-center gap-2"
                >
                  <MessagesSquare size={16} /> AI Chats
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/patient/know-your-food"
                  className="flex items-center gap-2"
                >
                  <Apple size={16} /> Food Insights
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
    </nav>
  );
}

export default BottomNav;
