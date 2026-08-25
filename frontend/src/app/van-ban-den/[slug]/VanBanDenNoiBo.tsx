"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search, RefreshCcw, ChevronDown, Paperclip, X, Info, FileText
} from "lucide-react";
import { AttachmentModal, PDFDetailModal } from "./SharedModals";
import Pagination from "./Pagination";
import DocumentDetailModal from "@/components/shared/DocumentDetailModal";
import { incomingService } from "@/services/apiService";

export default function VanBanDenNoiBo() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [activeDateFilter, setActiveDateFilter] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState("2026");

  const renderModal = (content: React.ReactNode) => {
    if (!mounted) return null;
    return createPortal(content, document.body);
  };

  const [apiData, setApiData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await incomingService.getInternal(0, 1000);
        
        const statusMap: Record<string, string> = {
          "UNPROCESSED": "Chưa xử lý",
          "IN_PROGRESS": "Đang xử lý",
          "COMPLETED": "Hoàn thành",
          "SUSPENDED": "Tạm dừng"
        };
        
        const mapped = (res.content || []).map((item: any, index: number) => {
          const formatDate = (dateStr: string) => {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
          };
          return {
            id: item.id,
            soDen: item.incomingNumber || "",
            soKyHieu: item.documentNumber || "",
            trichYeu: item.summary || "Không có",
            ngayDen: formatDate(item.receivedDate) || "Chưa cập nhật",
            coQuan: item.issuingAgency || "Chưa rõ",
            trangThai: statusMap[item.status] || item.status
          };
        });
        setApiData(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const dummyData = apiData;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  useEffect(() => {
    const max = Math.max(1, Math.ceil(dummyData.length / pageSize));
    if (currentPage > max) setCurrentPage(max);
  }, [dummyData.length, pageSize, currentPage]);
  
  const paginatedData = dummyData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full min-h-full bg-white shadow-sm border border-gray-200 flex flex-col">
      {/* HEADER TOOLBAR */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-[22px] font-normal text-gray-800">
            Danh sách văn bản đến
          </h1>
          <div className="flex items-center text-[13px] text-[#005fb8]">
            <button onClick={() => setActiveDateFilter(activeDateFilter === "today" ? "" : "today")} className={`hover:underline ${activeDateFilter === 'today' ? 'font-bold' : ''}`}>Hôm nay</button>
            <span className="mx-1.5 text-gray-400">-</span>
            <button onClick={() => setActiveDateFilter(activeDateFilter === "yesterday" ? "" : "yesterday")} className={`hover:underline ${activeDateFilter === 'yesterday' ? 'font-bold' : ''}`}>Hôm qua</button>
            <span className="mx-1.5 text-gray-400">-</span>
            <button onClick={() => setActiveDateFilter(activeDateFilter === "week" ? "" : "week")} className={`hover:underline ${activeDateFilter === 'week' ? 'font-bold' : ''}`}>Tuần này</button>
            <span className="mx-1.5 text-gray-400">-</span>
            <button onClick={() => setShowSearchModal(true)} className="hover:underline">Tìm kiếm nâng cao</button>
            <button onClick={() => setActiveDateFilter("")} className="ml-3 text-[#005fb8] hover:bg-blue-50 p-1.5 rounded-full transition-colors">
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-end items-center gap-2">
          <input type="text" placeholder="Nhập vào từ khóa tìm kiếm" className="w-[280px] border border-gray-300 rounded px-3 py-1.5 text-[13px] text-gray-900 placeholder:text-gray-700 focus:outline-none focus:border-[#005fb8]" />
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="border border-gray-300 rounded px-2 py-1.5 text-[13px] text-gray-900 font-medium focus:outline-none focus:border-[#005fb8] min-w-[70px] bg-white">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="w-full">
        <table className="w-full table-fixed border-collapse text-[13px]">
          <thead>
            <tr className="bg-white border-b border-gray-300 text-gray-900">
              <th className="p-2 border-r border-gray-200 w-12 text-center">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-20">Số đến</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-28">Số ký hiệu</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center min-w-[300px]">Trích yếu</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-28">Ngày đến</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-56">Cơ quan ban hành</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-32">Trạng thái</th>
              <th className="p-2 font-semibold text-center w-12">
                <Paperclip className="w-4 h-4 mx-auto text-gray-900" />
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-20 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005fb8]"></div>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
            paginatedData.map((row) => (
              <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                <td className="p-2 border-r border-gray-200 text-center align-top pt-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="p-2 border-r border-gray-200 text-center align-top pt-3 text-gray-600">{row.soDen}</td>
                <td className="p-2 border-r border-gray-200 align-top pt-3 text-center">
                  <a href="#" className="text-[#005fb8] hover:underline block break-words">{row.soKyHieu}</a>
                </td>
                <td className="p-2 border-r border-gray-200 align-top pt-3">
                  <div className="flex items-start">
                    <Info className="w-4 h-4 text-[#005fb8] mt-0.5 mr-1.5 shrink-0" fill="#e0f2fe" />
                    <span 
                      className="text-[#005fb8] hover:underline cursor-pointer font-medium leading-relaxed"
                      onClick={() => setShowDetailModal(true)}
                    >
                      {row.trichYeu}
                    </span>
                  </div>
                </td>
                <td className="p-2 border-r border-gray-200 text-center align-top pt-3 text-gray-900">{row.ngayDen}</td>
                <td className="p-2 border-r border-gray-200 align-top pt-3 text-gray-900">{row.coQuan}</td>
                <td className="p-2 border-r border-gray-200 text-center align-top pt-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    row.trangThai === 'Đang xử lý' ? 'bg-[#0d6efd] text-white' : 'bg-[#198754] text-white'
                  }`}>{row.trangThai}</span>
                </td>
                <td className="p-2 text-center align-top pt-3">
                  <button onClick={() => setShowAttachModal(true)} className="text-gray-600 hover:text-black">
                    <FileText className="w-4 h-4 mx-auto" />
                  </button>
                </td>
              </tr>
            ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-800 bg-gray-50/50 border border-gray-200 font-medium">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {dummyData.length > 0 && (
        <Pagination 
          currentPage={currentPage} 
          pageSize={pageSize} 
          totalItems={dummyData.length} 
          onPageChange={setCurrentPage} 
          onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }} 
        />
        )}
      </div>

      {/* ADVANCED SEARCH MODAL */}
      {showSearchModal && renderModal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={() => setShowSearchModal(false)}>
          <div className="bg-white rounded shadow-xl w-[1000px] max-w-[95vw] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Tìm kiếm nâng cao</h2>
              <button onClick={() => setShowSearchModal(false)} className="text-gray-900 hover:text-gray-900">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-[140px_1fr] gap-y-5 gap-x-6 items-center text-[14px]">
                <div className="text-right font-semibold text-gray-900">Số ký hiệu</div>
                <div><input type="text" placeholder="Nhập số ký hiệu" className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900 placeholder:text-gray-700" /></div>

                <div className="text-right font-semibold text-gray-900">Số đến</div>
                <div><input type="number" defaultValue={0} className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900 placeholder:text-gray-700" /></div>

                <div className="text-right font-semibold text-gray-900 self-start mt-2">Trích yếu</div>
                <div><textarea placeholder="Nhập trích yếu" rows={3} className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none resize-none text-gray-900 placeholder:text-gray-700" /></div>

                <div className="text-right font-semibold text-gray-900">Chọn cơ quan ban hành</div>
                <div className="flex gap-6">
                  <select className="flex-1 border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900 font-medium bg-white">
                    <option value="">Nhập tên cơ quan ban hành...</option>
                    <option value="1">Tỉnh ủy Quảng Ngãi (Nội tỉnh)</option>
                    <option value="2">Văn phòng tỉnh ủy Quảng Ngãi (Nội tỉnh)</option>
                    <option value="3">Phòng Nghiệp vụ và tổ chức thi hành án dân sự</option>
                    <option value="4">Ngân hàng Phát triển Việt Nam</option>
                    <option value="5">Cơ quan báo và phát thanh, truyền hình TPHCM</option>
                    <option value="6">Đài Truyền hình Việt Nam</option>
                  </select>
                  <div className="flex items-center gap-4 flex-1">
                    <span className="font-semibold text-gray-900 whitespace-nowrap">Sổ công văn</span>
                    <select className="flex-1 border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900 font-medium bg-white">
                      <option value="">Chọn sổ công văn</option>
                      <option value="0">Sổ công văn</option>
                      <option value="1">Sổ công văn đến thường</option>
                      <option value="2">Văn bản đến trong Bộ</option>
                    </select>
                  </div>
                </div>

                <div className="text-right font-semibold text-gray-900">Ngày đến</div>
                <div className="flex gap-6">
                  <div className="flex-1 flex gap-3">
                    <input type="date" className="flex-1 border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900" />
                    <input type="date" className="flex-1 border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900" />
                  </div>
                  <div className="flex items-center gap-4 flex-1">
                    <span className="font-semibold text-gray-900 whitespace-nowrap ml-6">Hạn xử lý</span>
                    <div className="flex-1 flex gap-3">
                      <input type="date" className="flex-1 border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900" />
                      <input type="date" className="flex-1 border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
              <button className="flex items-center px-5 py-2 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[14px] font-semibold transition-colors">
                <Search className="w-4 h-4 mr-2" /> Tìm kiếm
              </button>
              <button onClick={() => setShowSearchModal(false)} className="flex items-center px-5 py-2 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[14px] font-semibold transition-colors">
                <X className="w-4 h-4 mr-2" /> Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <AttachmentModal 
        isOpen={showAttachModal} 
        onClose={() => setShowAttachModal(false)}
        onPreview={(file) => setPreviewFile(file)}
      />

      <PDFDetailModal 
        fileName={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      <DocumentDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết văn bản đến nội bộ"
      />
    </div>
  );
}
