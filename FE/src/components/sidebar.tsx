"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Home,
  ListTodo,
  Clock,
  Users,
  Tag,
  Folder,
  ShieldCheck,
  AlarmClock,
  History,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useAppContext } from "./app-context";
import { cn } from "@/lib/utils";
import { useHasMounted } from "./customHook";

const Sidebar = () => {
  const { isSidebarOpen } = useAppContext();
  const pathname = usePathname();
  const hasMounted = useHasMounted();
  const t = useTranslations("Menu");

  if (!hasMounted) return null;

  const navItems = [
    {
      href: "/manage",
      label: t("dashboard"),
      icon: Home,
    },
    {
      href: "/manage/tasks",
      label: t("tasks"),
      icon: ListTodo,
    },
    {
      href: "/manage/project",
      label: t("projects"),
      icon: Folder,
    },
    {
      href: "/manage/time-tracking",
      label: t("timeTracking"),
      icon: Clock,
    },
    {
      href: "/manage/user",
      label: t("users"),
      icon: Users,
    },
    {
      href: "/manage/tag",
      label: t("tags"),
      icon: Tag,
    },
    {
      href: "/manage/reminder",
      label: t("reminder"),
      icon: AlarmClock,
    },
    {
      href: "/manage/activities",
      label: t("activities"),
      icon: History,
    },
    {
      href: "/manage/role-permission",
      label: t("role & permission"),
      icon: ShieldCheck,
    },
  ];

  return (
    <aside
      className={cn(
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
        {navItems.map((Item, index) => {
          const isActive = pathname === Item.href;
          return (
            <Link
              key={index}
              href={Item.href}
              className={cn(
                "flex items-center gap-3 py-2 px-3 rounded-lg text-muted-foreground transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-accent text-accent-foreground font-medium"
              )}
              onClick={(e) => {
                if (pathname === Item.href) e.preventDefault();
              }}
            >
              <Item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{Item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default React.memo(Sidebar);
