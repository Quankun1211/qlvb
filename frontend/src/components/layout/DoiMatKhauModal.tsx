"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface DoiMatKhauModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DoiMatKhauModal({ isOpen, onClose }: DoiMatKhauModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div 
        className="bg-white shadow-2xl rounded flex flex-col overflow-hidden relative w-[550px] max-w-[95vw]" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 shrink-0 bg-white">
          <h2 className="text-[15px] font-semibold text-gray-800">
            Đổi mật khẩu
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 text-[13px] text-gray-900 bg-white flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-700">Mật khẩu cũ</label>
            <input 
              type="password" 
              placeholder="Nhập mật khẩu cũ"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:border-[#005fb8] focus:outline-none text-gray-900"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-700">Mật khẩu mới</label>
            <input 
              type="password" 
              placeholder="Nhập mật khẩu mới"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:border-[#005fb8] focus:outline-none text-gray-900"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-700">Nhập lại mật khẩu mới</label>
            <input 
              type="password" 
              placeholder="Nhập lại mật khẩu mới"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:border-[#005fb8] focus:outline-none text-gray-900"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
          <button 
            onClick={() => {
              alert("Đổi mật khẩu thành công!");
              onClose();
            }}
            className="px-5 py-1.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white rounded text-[13px] font-medium transition-colors"
          >
            Cập nhật
          </button>
          <button onClick={onClose} className="px-5 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded text-[13px] font-medium transition-colors">
            Hủy
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
