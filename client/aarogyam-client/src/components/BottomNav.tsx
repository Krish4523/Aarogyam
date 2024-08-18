import React from "react";
import {
  BellDot,
  CalendarDays,
  House,
  History,
  PillBottle,
  SquareLibrary,
} from "lucide-react";
import Link from "next/link";

function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full py-4 z-10 bg-zinc-100 dark:bg-zinc-950 border-t dark:border-zinc-800 border-zinc-200 shadow-lg sm:hidden ">
      <ul className="flex flex-row justify-around items-center bg-transparent w-full">
        <li>
          <Link href="/" className="flex flex-col items-center">
            <House size={24} />
          </Link>
        </li>
        <li>
          <Link href="/" className="flex flex-col items-center">
            <SquareLibrary size={24} />
          </Link>
        </li>
        <li>
          <Link href="/" className="flex items-center">
            <CalendarDays size={24} />
          </Link>
        </li>
        <li>
          <Link href="/" className="flex items-center">
            <PillBottle size={24} />
          </Link>
        </li>
        <li>
          <Link href="/" className="flex items-center">
            <BellDot size={24} />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default BottomNav;
