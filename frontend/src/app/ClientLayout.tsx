"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (pathname !== '/login' && !isLoggedIn) {
      router.push('/login');
    }
  }, [pathname, router]);

  if (!mounted) {
    return null; // Prevents hydration mismatch and flashes
  }

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 relative z-0">
          {children}
        </main>
      </div>
    </div>
  );
}
