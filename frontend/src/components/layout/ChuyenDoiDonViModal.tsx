"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Check } from "lucide-react";

interface ChuyenDoiDonViModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChuyenDoiDonViModal({ isOpen, onClose }: ChuyenDoiDonViModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedDonVi, setSelectedDonVi] = useState("cy");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div 
        className="bg-white shadow-2xl rounded flex flex-col overflow-hidden relative w-[600px] max-w-[95vw]" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 shrink-0 bg-white">
          <h2 className="text-[16px] font-semibold text-gray-800">
            Chuyển đổi đơn vị
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 text-[13px] text-gray-900 bg-white">
          <div className="font-bold mb-4 text-[14px]">Đơn vị người dùng</div>
          
          <div className="flex items-center gap-2">
            <input 
              type="radio" 
              id="donvi_cy" 
              name="donvi" 
              value="cy"
              checked={selectedDonVi === "cy"}
              onChange={() => setSelectedDonVi("cy")}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="donvi_cy" className="cursor-pointer text-gray-800">
              Cục Cơ yếu-Công nghệ thông tin<span className="text-[#005fb8]">(active)</span>
            </label>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
          <button 
            onClick={() => {
              alert("Lưu đơn vị thành công!");
              onClose();
            }}
            className="flex items-center px-4 py-1.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white rounded text-[13px] font-medium transition-colors"
          >
            <Check className="w-4 h-4 mr-1.5" /> Lưu
          </button>
          <button onClick={onClose} className="flex items-center px-4 py-1.5 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-medium transition-colors">
            <X className="w-4 h-4 mr-1.5" /> Đóng
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
