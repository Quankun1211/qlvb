"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import { Search, RefreshCcw, ChevronDown, CheckCircle, XCircle, X } from "lucide-react";
import CongViecDetailModal from "@/components/shared/CongViecDetailModal";
import { workService } from "@/services/apiService";
import DocumentDetailModal from "@/components/shared/DocumentDetailModal";
import Pagination from "../../van-ban-den/[slug]/Pagination";

const loaiThongBaoList = ["Quá hạn", "Sắp hết hạn"];
const trangThaiList = ["Chưa xử lý", "Đang xử lý", "Đã kết thúc", "Tạm dừng"];

export default function CongViecDuocGiao() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const searchParams = useSearchParams();
  const queryQ = searchParams.get("q") || "";
  const [activeDateFilter, setActiveDateFilter] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [searchKeyword, setSearchKeyword] = useState(queryQ);

  useEffect(() => {
    setSearchKeyword(queryQ);
  }, [queryQ]);

  const removeAccents = (str: string | undefined | null) => {
    if (!str) return "";
    return str.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };
  
  // Dropdowns
  const [showLoaiThongBaoDropdown, setShowLoaiThongBaoDropdown] = useState(false);
  const [selectedLoaiThongBao, setSelectedLoaiThongBao] = useState<string[]>([...loaiThongBaoList]);
  
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([...trangThaiList]);
  
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Advanced search form
  const [advSearch, setAdvSearch] = useState({
    soDen: "",
    tenCongViec: "",
    hanXuLyFrom: "",
    hanXuLyTo: "",
    ngayGiaoFrom: "",
    ngayGiaoTo: ""
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const ltbRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ltbRef.current && !ltbRef.current.contains(event.target as Node)) {
        setShowLoaiThongBaoDropdown(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLoaiThongBao = (ltb: string) => {
    setSelectedLoaiThongBao(prev =>
      prev.includes(ltb) ? prev.filter(s => s !== ltb) : [...prev, ltb]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleRefresh = () => {
    setActiveDateFilter("");
    setSearchKeyword("");
    setSelectedYear("2026");
    setSelectedLoaiThongBao([...loaiThongBaoList]);
    setSelectedStatuses([...trangThaiList]);
    setCurrentPage(1);
  };

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
        const res = await workService.getAssignedToMe(0, 1000);
        
        const statusMap: Record<string, string> = {
          "UNPROCESSED": "Chưa xử lý",
          "IN_PROGRESS": "Đang xử lý",
          "COMPLETED": "Đã kết thúc",
          "REJECTED": "Đã từ chối"
        };
        
        const mapped = (res.content || []).map((item: any) => {
          const formatDate = (dateStr: string) => {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
          };
          return {
            id: item.id,
            tenCongViec: item.name || "Không có tên",
            hanXuLy: formatDate(item.dueAt),
            ngayGiao: formatDate(item.assignedAt),
            ngNc: item.assignerName || "Chưa rõ",
            chuTri: (item.assigneeNames || []).join(", ") || "Chưa rõ",
            phoiHop: (item.collaboratorNames || []).join(", "),
            trangThai: statusMap[item.status] || item.status
          };
        });
        setApiData(mapped);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const dummyData = apiData;

  let filteredData = dummyData.filter(row => selectedStatuses.includes(row.trangThai));

  if (searchKeyword) {
    const kw = removeAccents(searchKeyword);
    filteredData = filteredData.filter(row => 
      removeAccents(row.tenCongViec).includes(kw)
    );
  }

  if (activeDateFilter === "today") {
    filteredData = filteredData.filter(row => row.ngayGiao === "25/08/2026");
  } else if (activeDateFilter === "yesterday") {
    filteredData = filteredData.filter(row => row.ngayGiao === "24/08/2026");
  } else if (activeDateFilter === "this_week") {
    filteredData = filteredData.filter(row => row.ngayGiao === "25/08/2026" || row.ngayGiao === "24/08/2026" || row.ngayGiao === "23/08/2026");
  }

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full min-h-full bg-white shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-[22px] font-normal text-gray-800">Danh sách công việc được giao</h1>
          <div className="flex items-center text-[13px] text-[#005fb8]">
            <button onClick={() => setActiveDateFilter(activeDateFilter === "today" ? "" : "today")} className={`hover:underline ${activeDateFilter === 'today' ? 'font-bold' : ''}`}>Hôm nay</button>
            <span className="mx-1.5 text-gray-400">-</span>
            <button onClick={() => setActiveDateFilter(activeDateFilter === "yesterday" ? "" : "yesterday")} className={`hover:underline ${activeDateFilter === 'yesterday' ? 'font-bold' : ''}`}>Hôm qua</button>
            <span className="mx-1.5 text-gray-400">-</span>
            <button onClick={() => setActiveDateFilter(activeDateFilter === "this_week" ? "" : "this_week")} className={`hover:underline ${activeDateFilter === 'this_week' ? 'font-bold' : ''}`}>Tuần này</button>
            <span className="mx-1.5 text-gray-400">-</span>
            <button onClick={() => setShowAdvancedSearch(true)} className="hover:underline flex items-center font-medium">Tìm kiếm nâng cao</button>
            <button onClick={handleRefresh} className="ml-2 text-[#005fb8] hover:text-[#004a94] p-1"><RefreshCcw className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex justify-end items-center mt-2">
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Nhập vào từ khóa tìm kiếm"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              className="w-[250px] border border-gray-300 rounded px-3 py-1.5 text-[13px] focus:border-[#005fb8] focus:outline-none placeholder:text-gray-500 text-gray-900"
            />
            <div className="relative" ref={ltbRef}>
              <button 
                onClick={() => setShowLoaiThongBaoDropdown(!showLoaiThongBaoDropdown)}
                className="flex items-center justify-between w-[160px] bg-[#0078d4] text-white px-3 py-1.5 rounded text-[13px] font-medium"
              >
                <span className="truncate">Chọn loại thông báo</span>
                <ChevronDown className="w-4 h-4 ml-2 shrink-0" />
              </button>
              
              {showLoaiThongBaoDropdown && (
                <div className="absolute right-0 top-full mt-1 w-[200px] bg-white border border-gray-200 rounded shadow-lg z-50 overflow-y-auto">
                  <div className="p-2">
                    {loaiThongBaoList.map(ltb => (
                      <label key={ltb} className="flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer rounded">
                        <input 
                          type="checkbox" 
                          checked={selectedLoaiThongBao.includes(ltb)} 
                          onChange={() => toggleLoaiThongBao(ltb)} 
                          className="mr-2.5 rounded border-gray-300 text-[#005fb8] w-3.5 h-3.5 focus:ring-[#005fb8]"
                        />
                        <span className="text-[13px] text-gray-900">{ltb}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={statusRef}>
              <button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center justify-between w-[140px] bg-[#0078d4] text-white px-3 py-1.5 rounded text-[13px] font-medium"
              >
                <span className="truncate">Chọn trạng thái</span>
                <ChevronDown className="w-4 h-4 ml-2 shrink-0" />
              </button>
              
              {showStatusDropdown && (
                <div className="absolute right-0 top-full mt-1 w-[200px] bg-white border border-gray-200 rounded shadow-lg z-50 overflow-y-auto">
                  <div className="p-2">
                    {trangThaiList.map(status => (
                      <label key={status} className="flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer rounded">
                        <input 
                          type="checkbox" 
                          checked={selectedStatuses.includes(status)} 
                          onChange={() => toggleStatus(status)} 
                          className="mr-2.5 rounded border-gray-300 text-[#005fb8] w-3.5 h-3.5 focus:ring-[#005fb8]"
                        />
                        <span className="text-[13px] text-gray-900">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <select 
              value={selectedYear} 
              onChange={e => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-[13px] focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005fb8]"></div>
          </div>
        ) : (
        <table className="w-full border-collapse text-[13px] mb-4">
          <thead>
            <tr>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white">Tên công việc</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[12%]">Hạn xử lý</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[12%]">Ngày giao</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[10%]">NG/NC</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[12%]">CB/ĐV chủ trì</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[12%]">CB/ĐV phối hợp</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[12%]">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors text-gray-900">
                  <td className="py-2.5 px-3 border border-gray-300">
                    <span 
                      className="text-[#005fb8] hover:underline cursor-pointer font-bold"
                      onClick={() => setShowDetailModal(true)}
                    >
                      {row.tenCongViec}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.hanXuLy}</td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.ngayGiao}</td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.ngNc}</td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.chuTri}</td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.phoiHop}</td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">
                    <span className="text-[#005fb8]">{row.trangThai}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-800 bg-gray-50/50 border border-gray-200 font-medium">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
        
        {filteredData.length > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / pageSize)}
            totalItems={filteredData.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>

      {/* MODAL TÌM KIẾM NÂNG CAO */}
      {showAdvancedSearch && renderModal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={() => setShowAdvancedSearch(false)}>
          <div className="bg-white rounded shadow-xl w-[900px] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
              <h2 className="text-[15px] font-bold text-gray-800">Tìm kiếm nâng cao</h2>
              <button onClick={() => setShowAdvancedSearch(false)} className="text-gray-900 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-[13px] text-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-[120px] font-bold shrink-0 text-right">Số đến</div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="0" 
                    value={advSearch.soDen}
                    onChange={e => setAdvSearch({...advSearch, soDen: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none placeholder:text-gray-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className="w-[120px] font-bold shrink-0 mt-1.5 text-right">Tên công việc</div>
                <div className="flex-1">
                  <textarea 
                    rows={2} 
                    placeholder="Nhập tên công việc" 
                    value={advSearch.tenCongViec}
                    onChange={e => setAdvSearch({...advSearch, tenCongViec: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none resize-none placeholder:text-gray-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-[120px] font-bold shrink-0 text-right">Hạn xử lý</div>
                <div className="flex gap-2 w-[280px]">
                  <input 
                    type="date" 
                    value={advSearch.hanXuLyFrom}
                    onChange={e => setAdvSearch({...advSearch, hanXuLyFrom: e.target.value})}
                    className="w-[130px] border border-gray-300 rounded px-2 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900"
                  />
                  <input 
                    type="date" 
                    value={advSearch.hanXuLyTo}
                    onChange={e => setAdvSearch({...advSearch, hanXuLyTo: e.target.value})}
                    className="w-[130px] border border-gray-300 rounded px-2 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900"
                  />
                </div>
                
                <div className="font-bold shrink-0 ml-4">Ngày giao</div>
                <div className="flex gap-2">
                  <input 
                    type="date" 
                    value={advSearch.ngayGiaoFrom}
                    onChange={e => setAdvSearch({...advSearch, ngayGiaoFrom: e.target.value})}
                    className="w-[130px] border border-gray-300 rounded px-2 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900"
                  />
                  <input 
                    type="date" 
                    value={advSearch.ngayGiaoTo}
                    onChange={e => setAdvSearch({...advSearch, ngayGiaoTo: e.target.value})}
                    className="w-[130px] border border-gray-300 rounded px-2 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900"
                  />
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50/50 rounded-b">
              <button onClick={() => {
                setShowAdvancedSearch(false);
                setCurrentPage(1);
              }} className="flex items-center px-4 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors">
                <Search className="w-4 h-4 mr-1.5" /> Tìm kiếm
              </button>
              <button onClick={() => setShowAdvancedSearch(false)} className="flex items-center px-4 py-1.5 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-semibold transition-colors">
                <X className="w-4 h-4 mr-1.5" /> Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DOCUMENT DETAIL MODAL --- */}
      <DocumentDetailModal 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết công việc"
      />

    </div>
  );
}
