"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import RefreshToken from "./refresh-token";
import {
  decodeToken,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils";
import { generateMultipleSocketInstances, Sockets } from "@/lib/socket";

export type ContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isAuth: boolean;
  role: string | undefined;
  setRole: (role?: string | undefined) => void;
  sockets: Sockets | null;
  setSockets: (accessToken: string) => void;
  disconnectSocket: () => void;
};

const AppContext = createContext<ContextType | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRoleState] = useState<string | undefined>();
  const [sockets, setSocketsState] = useState<Sockets | null>(null);
  const count = useRef(0);

  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage();
      if (accessToken) {
        const decoded = decodeToken(accessToken);
        setRoleState(decoded.roleName);
        setSocketsState(generateMultipleSocketInstances(accessToken));
      }
      count.current++;
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const setRole = useCallback((role?: string | undefined) => {
    setRoleState(role);
    if (!role) {
      removeTokensFromLocalStorage();
    }
  }, []);

  const setSockets = useCallback((accessToken: string) => {
    setSocketsState(generateMultipleSocketInstances(accessToken));
  }, []);

  const disconnectSocket = useCallback(() => {
    if (sockets) {
      Object.values(sockets).forEach((sock) => sock.disconnect());
      setSocketsState(null);
    }
  }, [sockets]);

  const isAuth = Boolean(role);

  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        isAuth,
        role,
        setRole,
        sockets,
        setSockets,
        disconnectSocket,
      }}
    >
      {children}
      <RefreshToken />
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }
  return context;
};
