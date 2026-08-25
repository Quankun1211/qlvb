"use client";
import React, { useState } from "react";
import { Bell, Book, KeyRound, LogOut, Home, FileText, FileSignature, FileEdit, Briefcase, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/AppProvider";
import ProfileModal from "./ProfileModal";
import ChuyenDoiDonViModal from "./ChuyenDoiDonViModal";
import DoiMatKhauModal from "./DoiMatKhauModal";

export default function Header() {
  const { activeNav, setActiveNav } = useAppContext();
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [showDonVi, setShowDonVi] = useState(false);
  const [showDoiMatKhau, setShowDoiMatKhau] = useState(false);
  const [showNotiDropdown, setShowNotiDropdown] = useState(false);
  const [userName, setUserName] = useState("Người dùng");
  const notiRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        setShowNotiDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    // Read user from local storage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.fullName) {
          setUserName(user.fullName);
        }
      } catch (e) {}
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex flex-col w-full z-10 shrink-0 shadow-sm">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#00b0f0] via-[#0070c0] to-[#005fb8] text-white flex justify-between items-center px-4 py-2 h-16 relative z-30">
        {/* Decorative background overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                 <pattern id="polygons" width="50" height="50" patternUnits="userSpaceOnUse">
                    <polygon points="0,50 50,0 50,50" fill="white" />
                 </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#polygons)" />
           </svg>
        </div>

        {/* Left: Logo & Titles */}
        <Link href="/" onClick={() => setActiveNav("ban-lam-viec")} className="flex items-center space-x-4 relative z-10 cursor-pointer">
          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full p-0.5 overflow-hidden shadow-md shrink-0 hover:scale-105 transition-transform duration-200">
             <img src="/asset/brand-logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div className="flex flex-col justify-center mt-1">
            <h1 className="font-bold text-sm md:text-base text-yellow-400 leading-tight uppercase drop-shadow">
              CỤC CƠ YẾU-CÔNG NGHỆ THÔNG TIN
            </h1>
            <h2 className="font-extrabold text-lg md:text-xl text-white leading-tight uppercase drop-shadow-md hover:text-gray-100 transition-colors">
              HỆ THỐNG VĂN BẢN VÀ ĐIỀU HÀNH
            </h2>
          </div>
        </Link>

        {/* Right: User actions */}
        <div className="flex flex-col items-end text-xs space-y-1 relative z-10 mt-1">
          <div className="flex space-x-4">
             <div className="flex font-medium">
                <button onClick={() => setShowProfile(true)} className="text-white hover:underline cursor-pointer">{userName}</button>
                <button onClick={() => setShowDonVi(true)} className="text-yellow-400 hover:underline cursor-pointer ml-1">- Cơ yếu</button>
             </div>
             <span className="font-bold text-yellow-400">Hotline: 3799 5658</span>
          </div>
          <div className="flex items-center space-x-4 font-medium mt-1">
            <div className="relative" ref={notiRef}>
              <button 
                onClick={() => setShowNotiDropdown(!showNotiDropdown)} 
                className="flex items-center hover:text-yellow-300 transition-colors focus:outline-none"
              >
                <Bell className="w-3.5 h-3.5 mr-1" /> Thông báo
              </button>
              
              {showNotiDropdown && (
                <div className="absolute top-full right-0 mt-2 w-[250px] bg-white rounded shadow-lg border border-gray-200 flex flex-col z-[999]">
                  <div className="px-4 py-3 text-center text-gray-700 font-normal border-b border-gray-100 text-[13px]">
                    Không có thông báo nào!
                  </div>
                  <Link 
                    href="/danh-sach-thong-bao" 
                    onClick={() => {
                      setShowNotiDropdown(false);
                      setActiveNav('none'); // optional
                    }}
                    className="px-4 py-2 text-center text-gray-700 hover:bg-gray-50 transition-colors font-normal text-[13px] rounded-b bg-gray-50/30"
                  >
                    Xem tất cả
                  </Link>
                </div>
              )}
            </div>
            <button className="flex items-center hover:text-yellow-300 transition-colors">
              <Book className="w-3.5 h-3.5 mr-1" /> Tài liệu hướng dẫn
            </button>
            <button 
              onClick={() => setShowDoiMatKhau(true)}
              className="flex items-center hover:text-yellow-300 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 mr-1" /> Đổi mật khẩu
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="flex items-center hover:text-yellow-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" /> Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-[#005fb8] text-white flex items-center text-xs font-bold uppercase shadow-md relative z-20">
        <Link 
          href="/" 
          onClick={() => setActiveNav('ban-lam-viec')}
          className={`flex items-center px-4 py-2.5 transition-colors ${activeNav === 'ban-lam-viec' ? 'bg-white text-[#005fb8]' : 'hover:bg-[#0078d4]'}`}
        >
          <Home className="w-4 h-4 mr-1.5" /> BÀN LÀM VIỆC
        </Link>
        <Link 
          href="/van-ban-den/toan-bo-van-ban-den-don-vi" 
          onClick={() => setActiveNav('van-ban-den')}
          className={`flex items-center px-4 py-2.5 border-l border-white/20 transition-colors ${activeNav === 'van-ban-den' ? 'bg-white text-[#005fb8]' : 'hover:bg-[#0078d4]'}`}
        >
           <FileText className="w-4 h-4 mr-1.5" /> VĂN BẢN ĐẾN
        </Link>
        <Link 
          href="/van-ban-trinh/toan-bo-van-ban-trinh" 
          onClick={() => setActiveNav('van-ban-trinh')}
          className={`flex items-center px-4 py-2.5 border-l border-white/20 transition-colors ${activeNav === 'van-ban-trinh' ? 'bg-white text-[#005fb8]' : 'hover:bg-[#0078d4]'}`}
        >
           <FileSignature className="w-4 h-4 mr-1.5" /> VĂN BẢN TRÌNH
        </Link>
        <Link 
          href="/van-ban-du-thao/toan-bo-van-ban-du-thao" 
          onClick={() => setActiveNav('van-ban-du-thao')}
          className={`flex items-center px-4 py-2.5 border-l border-white/20 transition-colors ${activeNav === 'van-ban-du-thao' ? 'bg-white text-[#005fb8]' : 'hover:bg-[#0078d4]'}`}
        >
           <FileEdit className="w-4 h-4 mr-1.5" /> VĂN BẢN DỰ THẢO
        </Link>
        <Link 
          href="/cong-viec/cong-viec-duoc-giao" 
          onClick={() => setActiveNav('cong-viec')}
          className={`flex items-center px-4 py-2.5 border-l border-white/20 transition-colors ${activeNav === 'cong-viec' ? 'bg-white text-[#005fb8]' : 'hover:bg-[#0078d4]'}`}
        >
           <Briefcase className="w-4 h-4 mr-1.5" /> CÔNG VIỆC - HỒ SƠ CÔNG VIỆC
        </Link>
        <Link 
          href="/van-ban-di/toan-bo-van-ban-di" 
          onClick={() => setActiveNav('van-ban-di')}
          className={`flex items-center px-4 py-2.5 border-l border-white/20 transition-colors ${activeNav === 'van-ban-di' ? 'bg-white text-[#005fb8]' : 'hover:bg-[#0078d4]'}`}
        >
           <Send className="w-4 h-4 mr-1.5" /> VĂN BẢN ĐI
        </Link>
      </nav>

      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <ChuyenDoiDonViModal isOpen={showDonVi} onClose={() => setShowDonVi(false)} />
      <DoiMatKhauModal isOpen={showDoiMatKhau} onClose={() => setShowDoiMatKhau(false)} />
    </header>
  );
}
