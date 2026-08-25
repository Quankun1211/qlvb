"use client";

import { Clock, Plus, Search } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="w-full bg-white min-h-full p-4 md:p-6 rounded-md shadow-sm border border-gray-100">
      
      {/* Top action */}
      <div className="flex justify-end mb-4">
        <button className="bg-[#0070c0] hover:bg-[#005fb8] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center shadow-sm transition-colors">
          <Plus className="w-3.5 h-3.5 mr-1" /> Văn bản dự thảo
        </button>
      </div>

      {/* CÔNG VIỆC CỦA TÔI */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <h2 className="text-sm font-bold text-gray-800 uppercase whitespace-nowrap mr-4">
            Công việc của tôi
          </h2>
          <div className="flex-grow border-t border-dotted border-gray-400"></div>
        </div>
        
        <div className="flex justify-end items-center mb-4 space-x-2">
          <select className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#0070c0]">
            <option>2026</option>
            <option>2025</option>
          </select>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-1 rounded text-xs font-bold flex items-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 2.63-6.37L12 8"></path></svg>
            Làm mới
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card: Xử lý văn bản đến */}
          <div className="border border-gray-300 rounded overflow-hidden shadow-sm">
            <div className="bg-[#1b64f2] text-white px-3 py-2 font-bold text-xs uppercase">
              Xử lý văn bản đến
            </div>
            <div className="bg-white px-3 py-2 flex justify-between items-center hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center text-xs text-gray-700 font-medium">
                <Clock className="w-3.5 h-3.5 mr-2 text-gray-500" />
                Văn bản đến chưa xử lý
              </div>
              <span className="text-red-600 font-bold text-sm">15</span>
            </div>
          </div>
        </div>
      </div>

      {/* TÁC VỤ NHANH */}
      <div>
        <div className="flex items-center mb-4 mt-8">
          <h2 className="text-sm font-bold text-gray-800 uppercase whitespace-nowrap mr-4">
            Tác vụ nhanh
          </h2>
          <div className="flex-grow border-t border-dotted border-gray-400"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="border-2 border-[#1b64f2] rounded p-6 flex flex-col items-center justify-center bg-white shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1b64f2] mb-3">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-4">Tìm kiếm văn bản đến</h3>
            <input 
              type="text" 
              placeholder="Tìm kiếm văn bản theo số hiệu, trích yếu..."
              className="w-full border border-gray-200 rounded px-3 py-2 text-xs mb-3 focus:outline-none focus:border-[#1b64f2]"
            />
            <button className="w-full bg-[#1b64f2] hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors text-xs">
              Tìm kiếm
            </button>
          </div>

          {/* Card 2 */}
          <div className="border-2 border-green-600 rounded p-6 flex flex-col items-center justify-center bg-white shadow-sm">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-3">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-4">Tìm kiếm văn bản đi</h3>
            <input 
              type="text" 
              placeholder="Tìm kiếm văn bản theo số hiệu, trích yếu..."
              className="w-full border border-gray-200 rounded px-3 py-2 text-xs mb-3 focus:outline-none focus:border-green-600"
            />
            <button className="w-full bg-[#1b64f2] hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors text-xs">
              Tìm kiếm
            </button>
          </div>

          {/* Card 3 */}
          <div className="border-2 border-cyan-400 rounded p-6 flex flex-col items-center justify-center bg-white shadow-sm">
            <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-400 mb-3">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-4">Tìm kiếm công việc</h3>
            <input 
              type="text" 
              placeholder="Tìm kiếm công việc theo số hiệu, tên công việc..."
              className="w-full border border-gray-200 rounded px-3 py-2 text-xs mb-3 focus:outline-none focus:border-cyan-400"
            />
            <button className="w-full bg-[#1b64f2] hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors text-xs">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
