"use client";

import Link from "next/link";
import {
  Home,
  ListTodo,
  Clock,
  Users,
  Tag,
  Folder,
  ShieldCheck,
} from "lucide-react";
import clsx from "clsx";
import { useAppContext } from "./app-context";

const navItems = [
  { href: "/manage", label: "Dashboard", icon: Home },
  { href: "/manage/tasks", label: "Tasks", icon: ListTodo },
  { href: "/manage/project", label: "Projects", icon: Folder },
  { href: "/manage/time-tracking", label: "Time Tracking", icon: Clock },
  { href: "/users", label: "Users", icon: Users },
  { href: "/manage/tag", label: "Tags", icon: Tag },
  {
    href: "/manage/role-permission",
    label: "Role & Permissions",
    icon: ShieldCheck,
  },
];

const Sidebar = () => {
  const { isSidebarOpen } = useAppContext();

  return (
    <aside
      className={clsx(
        "h-full w-60 shrink-0 bg-muted/40 text-foreground border-r border-border transition-all duration-300",
        {
          "hidden lg:block": !isSidebarOpen,
          block: isSidebarOpen,
        }
      )}
    >
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-bold">Task Tracker</h1>
      </div>

      <nav className="px-4 py-6 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 py-2 px-3 rounded-lg text-muted-foreground transition-colors",
              "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
