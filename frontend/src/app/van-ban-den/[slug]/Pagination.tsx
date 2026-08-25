import React from "react";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function Pagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange
}: PaginationProps) {
  const maxPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;

  return (
    <div className="border-t border-gray-200 px-4 py-3 flex justify-between items-center bg-white text-[13px] mt-auto shrink-0 w-full">
      <div className="flex items-center gap-4">
        <div className="flex border border-gray-300 rounded overflow-hidden">
          <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="px-2 py-1.5 hover:bg-gray-100 border-r border-gray-300 text-gray-600 focus:outline-none disabled:opacity-50"><ChevronsLeft className="w-4 h-4" /></button>
          <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-2 py-1.5 hover:bg-gray-100 border-r border-gray-300 text-gray-600 focus:outline-none disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
          <div className="px-4 py-1.5 border-r border-gray-300 bg-gray-50 font-medium">{currentPage}</div>
          <button onClick={() => onPageChange(Math.min(maxPages, currentPage + 1))} disabled={currentPage === maxPages} className="px-2 py-1.5 hover:bg-gray-100 border-r border-gray-300 text-gray-600 focus:outline-none disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
          <button onClick={() => onPageChange(maxPages)} disabled={currentPage === maxPages} className="px-2 py-1.5 hover:bg-gray-100 text-gray-600 focus:outline-none disabled:opacity-50"><ChevronsRight className="w-4 h-4" /></button>
        </div>
        <select 
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1.5 outline-none text-gray-900 bg-white"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="250">250</option>
        </select>
      </div>
      <div className="text-gray-600 font-medium">
        {totalItems > 0 
          ? `${startIndex + 1}-${Math.min(startIndex + pageSize, totalItems)} / ${totalItems}` 
          : '0-0 / 0'}
      </div>
    </div>
  );
}
