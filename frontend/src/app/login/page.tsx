"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [generatedCaptcha, setGeneratedCaptcha] = useState("");

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let c = "";
    for (let i = 0; i < 5; i++) {
      c += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(c);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password || !captcha) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (captcha !== generatedCaptcha) {
      setError("Mã xác thực không chính xác.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error("Tài khoản hoặc mật khẩu không chính xác.");
      }

      const data = await response.json().catch(() => ({}));

      localStorage.setItem("isLoggedIn", "true");
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      router.push("/");
    } catch (err) {
      setError("Tài khoản hoặc mật khẩu không chính xác.");
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: "#e6f0fa",
        backgroundImage: "radial-gradient(#b3d4f5 1px, transparent 1px)",
        backgroundSize: "20px 20px"
      }}
    >
      <div className="absolute inset-0 bg-blue-100/30 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 flex w-[900px] h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="w-1/2 relative h-full">
          <Image 
            src="/asset/login-logo-2.png"
            alt="Bộ Ngoại giao Việt Nam"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="w-1/2 p-10 flex flex-col justify-center bg-white">
          <h2 className="text-2xl font-bold text-gray-800 text-center uppercase mb-8">
            Đăng nhập tài khoản
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-2 bg-red-50 text-red-600 text-xs rounded border border-red-200 text-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700">
                Tài khoản <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Nhập tài khoản"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700">
                Mã xác thực <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã xác thực"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <div 
                  className="w-[120px] bg-blue-50 rounded border border-gray-200 flex items-center justify-center font-mono text-xl tracking-widest text-[#005fb8] font-bold select-none overflow-hidden relative cursor-pointer"
                  onClick={() => {
                    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    let c = "";
                    for (let i = 0; i < 5; i++) c += chars.charAt(Math.floor(Math.random() * chars.length));
                    setGeneratedCaptcha(c);
                  }}
                  title="Nhấn để đổi mã"
                >
                  <div className="absolute inset-0 opacity-20" style={{ background: "repeating-linear-gradient(45deg, transparent, transparent 10px, #005fb8 10px, #005fb8 11px)" }}></div>
                  <div className="absolute inset-0 opacity-20" style={{ background: "repeating-linear-gradient(-45deg, transparent, transparent 15px, #005fb8 15px, #005fb8 16px)" }}></div>
                  <span className="relative z-10 mix-blend-multiply filter drop-shadow-sm">{generatedCaptcha}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center text-[13px] text-gray-700 cursor-pointer group">
                <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="group-hover:text-blue-600 transition-colors">Giữ phiên đăng nhập</span>
              </label>
              <a href="#" className="text-[13px] text-[#005fb8] font-semibold hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-[#08428c] hover:bg-[#00316b] text-white py-2.5 rounded text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}