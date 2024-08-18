import { ReactNode, useContext } from "react";
import { SidebarContext } from "@/components/Sidebar";

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
}

export function SidebarItem({ icon, text, active, alert }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`relative flex items-center font-medium rounded-md cursor-pointer transition-colors group
        ${active ? "text-primary" : "hover:bg-accent text-muted-foreground"} ${!expanded ? "py-1 justify-center" : "justify-between"}`}
    >
      <span>{icon}</span>
      <span
        className={`overflow-hidden transition-all p-2 ${
          expanded ? "w-52" : "hidden"
        }`}
      >
        {text}
      </span>
      {expanded && alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-secondary text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 ${active ? "text-primary" : "text-muted-foreground"}`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
