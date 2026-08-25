import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { AppProvider } from "./AppProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hệ thống Quản lý Văn bản và Điều hành",
  description: "Cục Cơ yếu - Công nghệ Thông tin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <AppProvider>
          <div className="flex flex-col h-screen overflow-hidden bg-white">
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 relative z-0">
                {children}
              </main>
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
