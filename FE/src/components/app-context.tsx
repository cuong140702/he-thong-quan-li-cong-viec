"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import RefreshToken from "./refresh-token";
import {
  decodeToken,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils";

type ContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isAuth: boolean;
  role: string | undefined;
  setRole: (role?: string | undefined) => void;
};

const AppContext = createContext<ContextType | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRoleState] = useState<string | undefined>();
  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      const role = decodeToken(accessToken).roleName;
      setRoleState(role);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const setRole = useCallback((role?: string | undefined) => {
    setRoleState(role);
    if (!role) {
      removeTokensFromLocalStorage();
    }
  }, []);
  const isAuth = Boolean(role);

  return (
    <AppContext.Provider
      value={{ isSidebarOpen, toggleSidebar, setRole, role, isAuth }}
    >
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
