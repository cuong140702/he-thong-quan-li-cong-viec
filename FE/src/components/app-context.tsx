"use client";

import { createContext, useContext, useState } from "react";
import RefreshToken from "./refresh-token";

type ContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const AppContext = createContext<ContextType | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <AppContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
      <RefreshToken />
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useSidebar must be used within SidebarProvider");
  return context;
};
