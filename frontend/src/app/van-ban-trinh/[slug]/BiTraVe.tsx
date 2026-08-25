"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, RefreshCcw, Plus, X, ChevronDown, Paperclip } from "lucide-react";
import Pagination from "../../van-ban-den/[slug]/Pagination";
import VanBanTrinhDetailModal from "@/components/shared/VanBanTrinhDetailModal";
import ThemMoiVanBanTrinhModal from "@/components/shared/ThemMoiVanBanTrinhModal";
import { submissionService } from "@/services/apiService";

const allStatuses = [
  "Trưởng phòng trả về", "LĐ đơn vị trả về", "VT đơn vị trả về", "VT Bộ trả về", "Thư ký Bộ trả về"
];

const phongBanList = [
  "Đơn vị đôn đốc",
  "Đại sứ quán Việt Nam tại Timor-Leste",
  "Văn phòng Bộ Trưởng",
  "Đại sứ quán Việt Nam tại Bangladesh",
  "Tổng Lãnh sự quán tại Osaka, Nhật Bản",
  "OIDA"
];

export default function BiTraVe() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [activeDateFilter, setActiveDateFilter] = useState<string>("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([...allStatuses]);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Advanced search form
  const [advSearch, setAdvSearch] = useState({
    noiDung: "",
    phongBan: "",
    ngayTrinhFrom: "",
    ngayTrinhTo: ""
  });
  const [showPhongBanDropdown, setShowPhongBanDropdown] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const statusRef = useRef<HTMLDivElement>(null);
  const pbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (pbRef.current && !pbRef.current.contains(event.target as Node)) {
        setShowPhongBanDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleRefresh = () => {
    setActiveDateFilter("");
    setSearchKeyword("");
    setSelectedStatuses([...allStatuses]);
    setSelectedYear("2026");
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
        const res = await submissionService.getReturned(0, 1000);
        
        const mapped = (res.content || []).map((item: any, index: number) => {
          const formatDate = (dateStr: string) => {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
          };
          
          let mappedStatus = "Trưởng phòng trả về"; // Default fallback
          if (item.status === "RETURNED_BY_MANAGER") mappedStatus = "Trưởng phòng trả về";
          else if (item.status === "RETURNED_BY_LEADER") mappedStatus = "LĐ đơn vị trả về";
          // We can map more as needed based on the enum returned by backend
          
          return {
            stt: index + 1,
            so: item.submissionNumber || "Chưa có số",
            title: item.subject || "Không có tiêu đề",
            nguoi: item.draftedByName || "Chưa rõ",
            ngay: formatDate(item.submittedAt),
            phong: item.departmentName || "Phòng Hành chính",
            doiTuong: item.target || "Lãnh đạo bộ",
            trangThai: mappedStatus
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
  
  const [isAdvSearchActive, setIsAdvSearchActive] = useState(false);

  const handleAdvancedSearch = () => {
    setIsAdvSearchActive(true);
    setShowAdvancedSearch(false);
    setCurrentPage(1);
  };

  const clearAdvancedSearch = () => {
    setAdvSearch({ noiDung: "", phongBan: "", ngayTrinhFrom: "", ngayTrinhTo: "" });
    setIsAdvSearchActive(false);
    setCurrentPage(1);
  };

  let filteredData = apiData.filter(row => selectedStatuses.includes(row.trangThai));

  if (isAdvSearchActive) {
    if (advSearch.noiDung) {
      filteredData = filteredData.filter(row => 
        removeAccents(row.title).includes(removeAccents(advSearch.noiDung)) ||
        removeAccents(row.noiDung).includes(removeAccents(advSearch.noiDung))
      );
    }
    if (advSearch.phongBan) {
      filteredData = filteredData.filter(row => removeAccents(row.phongBan).includes(removeAccents(advSearch.phongBan)));
    }
    if (advSearch.ngayTrinhFrom) {
      filteredData = filteredData.filter(row => row.ngayTrinhISO && row.ngayTrinhISO >= advSearch.ngayTrinhFrom);
    }
    if (advSearch.ngayTrinhTo) {
      filteredData = filteredData.filter(row => row.ngayTrinhISO && row.ngayTrinhISO <= advSearch.ngayTrinhTo);
    }
  }

    const removeAccents = (str: string | undefined | null) => {
    if (!str) return "";
    return str.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };
  if (searchKeyword) {
    const kw = removeAccents(searchKeyword);
    filteredData = filteredData.filter(row => 
      removeAccents(row.title).includes(kw) ||
      removeAccents(row.so).includes(kw) ||
      removeAccents(row.nguoi).includes(kw)
    );
  }

  if (activeDateFilter === "today") {
    filteredData = filteredData.filter(row => row.ngay === "25/08/2026");
  } else if (activeDateFilter === "yesterday") {
    filteredData = filteredData.filter(row => row.ngay === "24/08/2026");
  } else if (activeDateFilter === "this_week") {
    filteredData = filteredData.filter(row => row.ngay === "25/08/2026" || row.ngay === "24/08/2026");
  }

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full min-h-full bg-white shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-[22px] font-normal text-gray-800">Danh sách văn bản trình bị trả về</h1>
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

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors">
              <Plus className="w-4 h-4 mr-1.5" /> Thêm mới
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Nhập vào từ khóa tìm kiếm" 
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="w-[200px] border border-gray-300 rounded px-3 py-1.5 text-[13px] focus:border-[#005fb8] focus:outline-none placeholder:text-gray-700 text-gray-900"
              />
            </div>
            
            <div className="relative" ref={statusRef}>
              <button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center justify-between w-[180px] bg-[#0078d4] text-white px-3 py-1.5 rounded text-[13px] font-medium"
              >
                <span className="truncate">Chọn trạng thái</span>
                <ChevronDown className="w-4 h-4 ml-2 shrink-0" />
              </button>
              
              {showStatusDropdown && (
                <div className="absolute right-0 top-full mt-1 w-[320px] bg-white border border-gray-200 rounded shadow-lg z-50 max-h-[400px] overflow-y-auto custom-scrollbar">
                  <div className="p-2">
                    {allStatuses.map(status => (
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
              className="border border-gray-300 rounded px-3 py-1.5 text-[13px] focus:border-[#005fb8] focus:outline-none bg-white text-gray-900 font-medium"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full">
        <table className="w-full table-fixed border-collapse text-[13px]">
          <thead>
            <tr className="bg-white border-b border-gray-200 text-gray-800 text-center">
              <th className="p-2 border-r border-gray-200 font-bold w-[50px]">STT</th>
              <th className="p-2 border-r border-gray-200 font-bold w-[120px]">Số tờ trình</th>
              <th className="p-2 border-r border-gray-200 font-bold">Về việc</th>
              <th className="p-2 border-r border-gray-200 font-bold w-[150px]">Người soạn</th>
              <th className="p-2 border-r border-gray-200 font-bold w-[120px]">Ngày trình</th>
              <th className="p-2 border-r border-gray-200 font-bold w-[150px]">Phòng ban</th>
              <th className="p-2 border-r border-gray-200 font-bold w-[150px]">Đối tượng</th>
              <th className="p-2 border-r border-gray-200 font-bold w-[50px]">
                <Paperclip className="w-4 h-4 mx-auto" />
              </th>
              <th className="p-2 font-bold w-[160px]">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-gray-800">
                  <td className="p-3 border-r border-gray-200 text-center">{row.stt}</td>
                  <td className="p-3 border-r border-gray-200 text-center">{row.so}</td>
                  <td className="p-3 border-r border-gray-200 text-left">
                    <span 
                      className="text-[#005fb8] hover:underline hover:text-blue-800 block text-[13px] cursor-pointer"
                      onClick={() => setShowDetailModal(true)}
                    >
                      {row.title}
                    </span>
                  </td>
                  <td className="p-3 border-r border-gray-200 text-center">{row.nguoi}</td>
                  <td className="p-3 border-r border-gray-200 text-center">{row.ngay}</td>
                  <td className="p-3 border-r border-gray-200 text-center">{row.phong}</td>
                  <td className="p-3 border-r border-gray-200 text-center">{row.doiTuong}</td>
                  <td className="p-3 border-r border-gray-200 text-center">
                    <button className="text-gray-900 hover:text-black">
                      <Paperclip className="w-4 h-4 mx-auto" />
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-block px-3 py-1 bg-[#dc3545] text-white rounded-full text-[11px] font-semibold">
                      {row.trangThai}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-800 bg-gray-50/50 font-medium">
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
              <div className="flex items-start gap-4 mb-4">
                <div className="w-[120px] font-bold shrink-0 mt-1.5 text-right">Nội dung trình</div>
                <div className="flex-1">
                  <textarea 
                    rows={2} 
                    placeholder="Nhập nội dung trình" 
                    value={advSearch.noiDung}
                    onChange={e => setAdvSearch({...advSearch, noiDung: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none resize-none placeholder:text-gray-700 text-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-[120px] font-bold shrink-0 text-right">Chọn phòng ban</div>
                <div className="flex-1 relative" ref={pbRef}>
                  <input 
                    type="text" 
                    placeholder="Nhập tên đơn vị..." 
                    value={advSearch.phongBan}
                    onChange={e => {
                      setAdvSearch({...advSearch, phongBan: e.target.value});
                      setShowPhongBanDropdown(true);
                    }}
                    onFocus={() => setShowPhongBanDropdown(true)}
                    className="w-[280px] border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none placeholder:text-gray-700 text-gray-900"
                  />
                  {showPhongBanDropdown && (
                    <div className="absolute left-0 top-full mt-1 w-[350px] bg-white border border-gray-200 rounded shadow-lg z-50 max-h-[250px] overflow-y-auto">
                      <div className="py-1">
                        {phongBanList.filter(p => p.toLowerCase().includes(advSearch.phongBan.toLowerCase())).map((pb, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => {
                              setAdvSearch({...advSearch, phongBan: pb});
                              setShowPhongBanDropdown(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[13px] text-gray-800"
                          >
                            {pb}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="font-bold shrink-0">Ngày trình</div>
                <div className="flex gap-2">
                  <input 
                    type="date" 
                    value={advSearch.ngayTrinhFrom}
                    onChange={e => setAdvSearch({...advSearch, ngayTrinhFrom: e.target.value})}
                    className="w-[130px] border border-gray-300 rounded px-2 py-1.5 focus:border-[#005fb8] focus:outline-none"
                  />
                  <input 
                    type="date" 
                    value={advSearch.ngayTrinhTo}
                    onChange={e => setAdvSearch({...advSearch, ngayTrinhTo: e.target.value})}
                    className="w-[130px] border border-gray-300 rounded px-2 py-1.5 focus:border-[#005fb8] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50/50 rounded-b">
              <button onClick={handleAdvancedSearch} className="flex items-center px-4 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors">
                <Search className="w-4 h-4 mr-1.5" /> Tìm kiếm
              </button>
              <button onClick={() => setShowAdvancedSearch(false)} className="flex items-center px-4 py-1.5 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-semibold transition-colors">
                <X className="w-4 h-4 mr-1.5" /> Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD MODAL --- */}
      <ThemMoiVanBanTrinhModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onSuccess={() => handleRefresh()}
      />

      {/* --- DOCUMENT DETAIL MODAL --- */}
      <VanBanTrinhDetailModal 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)}
      />

    </div>
  );
}
