"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type AppContextType = {
  activeNav: string;
  setActiveNav: (nav: string) => void;
};

const AppContext = createContext<AppContextType>({
  activeNav: "ban-lam-viec",
  setActiveNav: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeNav, setActiveNav] = useState("ban-lam-viec");
  const pathname = usePathname();

  // If the user lands on the site directly via URL (e.g. F5 refresh), we should try to guess the active nav
  // But to keep it simple and match the exact requirement, if they are at "/", it's always "ban-lam-viec".
  useEffect(() => {
    if (pathname === "/") {
      setActiveNav("ban-lam-viec");
    }
  }, [pathname]);

  return (
    <AppContext.Provider value={{ activeNav, setActiveNav }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
