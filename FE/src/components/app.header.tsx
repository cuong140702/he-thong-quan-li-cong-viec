"use client";

import Link from "next/link";
import { useAppContext } from "./app-context";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import DarkModeToggle from "./dark-mode-toggle";

export const AppHeader = () => {
  const { toggleSidebar } = useAppContext();

  return (
    <header className="flex items-center justify-between h-[61px] p-4 border-b bg-muted/40 text-foreground shadow-sm">
      <div className="flex items-center gap-4">
        {/* Hamburger toggle on mobile */}
        <Button variant="ghost" className="lg:hidden " onClick={toggleSidebar}>
          <Menu className="w-5 h-5 " />
        </Button>
        <Link href="/" className="text-xl font-bold">
          TaskTracker
        </Link>
      </div>

      <DarkModeToggle />
    </header>
  );
};
