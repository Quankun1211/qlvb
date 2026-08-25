"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search, RefreshCcw, ChevronDown, X
} from "lucide-react";
import Pagination from "./Pagination";
import DocumentDetailModal from "@/components/shared/DocumentDetailModal";
import { workService } from "@/services/apiService";

export default function VanBanDaGiao() {
  const [activeDateFilter, setActiveDateFilter] = useState<string>("");
  const [showTrangThaiDropdown, setShowTrangThaiDropdown] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] =
      useState<number | null>(null);
  const allTrangThai = ["Chưa xử lý", "Đang xử lý", "Đã kết thúc", "Quá hạn", "Tạm dừng", "Từ chối vào sổ"];
  const [trangThai, setTrangThai] = useState<string[]>(allTrangThai);
  
  const [selectedYear, setSelectedYear] = useState("2026");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
        const res = await workService.getAssignedByMe(0, 1000);
        
        const statusMap: Record<string, string> = {
          "IN_PROGRESS": "Đang xử lý",
          "COMPLETED": "Đã kết thúc",
          "OVERDUE": "Quá hạn",
          "SUSPENDED": "Tạm dừng"
        };
        
        const mapped = (res.content || []).map((item: any) => {
          const formatDate = (dateStr: string) => {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
          };
          return {
            id: item.id,
            soDen: item.incomingNumber || "Số đến",
            soKyHieu: item.documentNumber || "",
            tenCongViec: item.workName || "Không có tên công việc",
            hanXL: formatDate(item.deadline) || "Chưa cập nhật",
            ngayGiao: formatDate(item.assignedAt),
            nguoiGiao: item.assignedByName || "Chưa rõ",
            cbdvCT: (item.assigneeNames || []).join(", ") || "Chưa rõ",
            cbdvPH: item.collaboratorNames || [],
            trangThai: statusMap[item.status] || item.status || "Chưa xử lý"
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

  let filteredData = apiData.filter(row => trangThai.includes(row.trangThai));

  const toggleTrangThai = (val: string) => {
    setTrangThai(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  useEffect(() => {
    const max = Math.max(1, Math.ceil(filteredData.length / pageSize));
    if (currentPage > max) setCurrentPage(max);
  }, [filteredData.length, pageSize, currentPage]);
  
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full min-h-full bg-white shadow-sm border border-gray-200">
      {/* --- HEADER TOOLBAR --- */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-[22px] font-normal text-gray-800">
            Danh sách văn bản đã giao
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

        <div className="flex justify-end items-center gap-2 flex-wrap">
          <input type="text" placeholder="Nhập vào từ khóa tìm kiếm" className="w-[250px] border border-gray-300 rounded px-3 py-1.5 text-[13px] text-gray-900 placeholder:text-gray-700 focus:outline-none focus:border-[#005fb8]" />
          
          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTrangThaiDropdown(!showTrangThaiDropdown)}
              className="bg-[#0078d4] hover:bg-[#005fb8] text-white px-3 py-1.5 rounded flex items-center text-[13px] transition-colors"
            >
              Chọn trạng thái <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </button>
            {showTrangThaiDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowTrangThaiDropdown(false)}></div>
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-20 py-1 text-[13px] text-gray-900">
                  {allTrangThai.map(status => (
                    <label key={status} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                      <input type="checkbox" checked={trangThai.includes(status)} onChange={() => toggleTrangThai(status)} className="mr-2 rounded border-gray-300 text-[#0078d4] focus:ring-[#0078d4]" />
                      <span className="font-medium">{status}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="border border-gray-300 rounded px-2 py-1.5 text-[13px] text-gray-900 font-medium focus:outline-none focus:border-[#005fb8] min-w-[70px] bg-white">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      <div className="w-full">
        <table className="w-full table-fixed border-collapse text-[13px]">
          <thead>
            <tr className="bg-white border-b border-gray-300 text-gray-900">
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-20">Số đến</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-28">Số ký hiệu</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center min-w-[250px]">Tên công việc</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-24">Hạn xử lý</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-24">Ngày giao</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-28">Người giao VB</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-32">CB/ĐV chủ trì</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-32">CB/ĐV phối hợp</th>
              <th className="p-2 font-semibold text-center w-28">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row: any) => (
                <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                  <td className="p-2 border-r border-gray-200 text-center align-top pt-3 text-gray-600">{row.soDen}</td>
                  <td className="p-2 border-r border-gray-200 align-top pt-3 text-center">
                    <a href="#" className="text-[#005fb8] hover:underline block break-words">{row.soKyHieu}</a>
                  </td>
                  <td className="p-2 border-r border-gray-200 align-top pt-3 text-gray-800 font-medium">
                    <span 
                      className="text-[#005fb8] hover:underline cursor-pointer font-medium leading-relaxed"
                      onClick={() => {
                        setSelectedDocumentId(row.id)
                        setShowDetailModal(true)
                      }}
                    >
                      {row.tenCongViec}
                    </span>
                  </td>
                  <td className="p-2 border-r border-gray-200 text-center align-top pt-3 text-gray-900">{row.hanXL}</td>
                  <td className="p-2 border-r border-gray-200 text-center align-top pt-3 text-gray-900">{row.ngayGiao}</td>
                  <td className="p-2 border-r border-gray-200 align-top pt-3 text-gray-900">{row.nguoiGiao}</td>
                  <td className="p-2 border-r border-gray-200 align-top pt-3 text-gray-900">{row.cbdvCT}</td>
                  <td className="p-2 border-r border-gray-200 align-top pt-3 text-gray-900">
                    <div className="flex flex-col items-start">
                      {row.cbdvPH && row.cbdvPH.slice(0, 2).map((p: string, i: number) => <span key={i}>{p}</span>)}
                      {row.cbdvPH && row.cbdvPH.length > 2 && (
                        <div className="relative group mt-1">
                          <span className="text-[#005fb8] cursor-pointer group-hover:underline">Xem thêm</span>
                          <div className="hidden group-hover:flex absolute left-0 top-full pt-1 z-50 w-0">
                            <div className="bg-white border border-gray-300 shadow-xl p-2.5 rounded flex flex-col gap-1 text-[13px] text-gray-800 min-w-max">
                              {row.cbdvPH.map((p: string, i: number) => (
                                <span key={i} className="whitespace-nowrap">{p}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-center align-top pt-3">
                    <span className="inline-block px-3 py-1 bg-gray-500 text-white rounded-full text-xs font-semibold">{row.trangThai}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-900 bg-gray-50/50">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#005fb8] border-t-transparent rounded-full animate-spin mb-2"></div>
                      <span className="text-gray-500 text-[13px]">Đang tải dữ liệu...</span>
                    </div>
                  ) : "Không có dữ liệu"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination 
          currentPage={currentPage} 
          pageSize={pageSize} 
          totalItems={filteredData.length} 
          onPageChange={setCurrentPage} 
          onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }} 
        />
      </div>

      {/* --- ADVANCED SEARCH MODAL --- */}
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
              <div className="grid grid-cols-[120px_1fr] gap-y-5 gap-x-6 items-center text-[14px]">
                
                <div className="text-right font-semibold text-gray-900">Số ký hiệu</div>
                <div><input type="text" placeholder="Nhập số ký hiệu" className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900 placeholder:text-gray-700" /></div>

                <div className="text-right font-semibold text-gray-900">Số đến</div>
                <div><input type="number" defaultValue={0} className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900 placeholder:text-gray-700" /></div>

                <div className="text-right font-semibold text-gray-900 self-start mt-2">Tên công việc</div>
                <div><textarea placeholder="Nhập tên công việc" rows={3} className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none resize-none text-gray-900 placeholder:text-gray-700" /></div>

                <div className="text-right font-semibold text-gray-900">Hạn xử lý</div>
                <div className="flex gap-6">
                  <div className="flex-1 flex gap-3">
                    <input type="date" className="flex-1 border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900" />
                    <input type="date" className="flex-1 border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900" />
                  </div>
                  <div className="flex items-center gap-4 flex-1">
                    <span className="font-semibold text-gray-900 whitespace-nowrap ml-4">Ngày giao</span>
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

      <DocumentDetailModal 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết văn bản đã giao"
        documentId={selectedDocumentId}
      />

    </div>
  );
}
