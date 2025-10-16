"use client";

import React, { useEffect } from "react";
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
  Calendar,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useAppContext } from "./app-context";
import { cn } from "@/lib/utils";
import { useHasMounted } from "./customHook";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useAppContext();

  const pathname = usePathname();
  const hasMounted = useHasMounted();
  const t = useTranslations("Menu");

  useEffect(() => {
    toggleSidebar();
  }, []);

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
      href: "/manage/calendar",
      label: t("calendar"),
      icon: Calendar,
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
        "h-full shrink-0 bg-muted/40 text-foreground border-r border-border transition-all duration-300 w-16",
        isSidebarOpen && "w-60",
        "sm:w-60"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex justify-center md:justify-start">
        {/* Mobile: chỉ icon */}
        <span
          className={cn(
            "text-xl font-bold md:hidden",
            isSidebarOpen && "hidden"
          )}
        >
          📋
        </span>
        {/* Desktop: hiện text */}
        <h1
          className={cn(
            "hidden md:block text-lg font-bold",
            isSidebarOpen && "block"
          )}
        >
          Task Tracker
        </h1>
      </div>

      {/* Nav */}
      <nav className="px-2 py-4 space-y-2">
        <TooltipProvider delayDuration={100}>
          {navItems.map((Item, index) => {
            const isActive = pathname === Item.href;

            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={Item.href}
                    className={cn(
                      "flex items-center gap-3 py-2 px-3 rounded-lg transition-colors group",
                      "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
                      isActive && "bg-accent text-accent-foreground font-medium"
                    )}
                    onClick={(e) => {
                      if (pathname === Item.href) e.preventDefault();
                    }}
                  >
                    <Item.icon className="w-5 h-5 shrink-0" />
                    <span
                      className={cn(
                        "text-sm font-medium transition-all duration-300 overflow-hidden whitespace-nowrap",
                        isSidebarOpen ? "opacity-100" : "opacity-0 w-0",
                        "md:opacity-100 md:w-auto"
                      )}
                    >
                      {Item.label}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="text-sm font-medium md:hidden"
                >
                  {Item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>
    </aside>
  );
};

export default React.memo(Sidebar);
