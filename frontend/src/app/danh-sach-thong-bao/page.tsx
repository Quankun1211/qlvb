"use client";
import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";

export default function DanhSachThongBaoPage() {
  const [mounted, setMounted] = useState(false);
  const [showRead, setShowRead] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full min-h-full bg-white shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-[20px] font-normal text-gray-800 mb-4">Danh sách thông báo</h1>
        <div className="flex items-center gap-3 text-[13px]">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setShowRead(!showRead)}>
            <input 
              type="checkbox" 
              checked={showRead}
              onChange={(e) => setShowRead(e.target.checked)}
              className="w-3 h-3 text-blue-600 rounded border-gray-300"
            />
            <span className="text-gray-700">Hiển thị thông báo đã đọc</span>
          </div>
          <button className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white px-3 py-1 rounded text-[13px] font-medium transition-colors">
            Đánh dấu tất cả là đã đọc
          </button>
        </div>
      </div>

      <div className="p-4">
        <table className="w-full border-collapse text-[13px] border border-gray-200">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-2.5 px-3 text-center font-bold text-gray-800 w-[5%] border-r border-gray-200">#</th>
              <th className="py-2.5 px-3 text-center font-bold text-gray-800 w-[55%] border-r border-gray-200">Nội dung</th>
              <th className="py-2.5 px-3 text-center font-bold text-gray-800 w-[20%] border-r border-gray-200">Thời gian nhận</th>
              <th className="py-2.5 px-3 text-center font-bold text-gray-800 w-[20%]">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="py-8 text-center text-gray-500 bg-gray-50/50">
                Không có dữ liệu
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
