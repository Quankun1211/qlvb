"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, RefreshCcw, Plus, X, ChevronDown, ChevronRight, UploadCloud, UserPlus, Ban, ChevronsLeft, ChevronLeft, ChevronsRight } from "lucide-react";
import Pagination from "../../van-ban-den/[slug]/Pagination";
import DocumentDetailModal from "@/components/shared/DocumentDetailModal";

const allStatuses = [
  "Đang soạn thảo", "Đang xin ý kiến", "Đang trình LĐ đơn vị", "Đã phê duyệt", 
  "Trưởng phòng trả về", "LĐ đơn vị trả về", "VT đơn vị trả về"
];

const phongBanList = [
  "Đơn vị đôn đốc",
  "Đại sứ quán Việt Nam tại Timor-Leste",
  "Văn phòng Bộ Trưởng",
  "Đại sứ quán Việt Nam tại Bangladesh",
  "Tổng Lãnh sự quán tại Osaka, Nhật Bản",
  "OIDA"
];

export default function ToanBoVanBanDuThao() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [activeDateFilter, setActiveDateFilter] = useState<string>("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([...allStatuses]);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // Advanced search form
  const [advSearch, setAdvSearch] = useState({
    noiDung: "",
    phongBan: "",
    ngayTrinhFrom: "",
    ngayTrinhTo: ""
  });
  const [showPhongBanDropdown, setShowPhongBanDropdown] = useState(false);

  // Tree view & user selection state
  const [isTreeExpanded, setIsTreeExpanded] = useState(true);
  const [selectedDept, setSelectedDept] = useState("Lãnh đạo đơn vị");
  
  const mockDeptUsers: Record<string, string[]> = {
    "Lãnh đạo đơn vị": ["Vũ Tiến Dũng", "Đỗ Mai Thanh", "Hồ Sỹ An", "Nguyễn Đăng Lâm", "Lãnh Đạo CYTT", "Nguyễn Như Trung", "Nguyễn Văn Tiến", "Trần Hữu Dũng"],
    "Phòng Quản lý hệ thống": ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"],
    "Phòng Nghiên cứu ứng dụng": ["Phạm Văn D", "Hoàng Thị E"],
    "Phòng Quản lý kỹ thuật": ["Trịnh Văn F", "Lý Thị G"],
    "Phòng Tổ chức - Tổng hợp": ["Đào Văn H", "Đinh Thị I"],
    "Phòng Mã dịch - Truyền thông": ["Vương Văn K", "Đoàn Thị L"],
    "Phòng Bảo mật và An toàn": ["Đỗ Văn M", "Lâm Thị N"],
    "Phòng Điện báo": ["Ngô Văn P", "Bùi Thị Q"],
    "Chi Đoàn thanh niên": ["Lê Văn R"],
    "Ban Đời sống": ["Trần Văn S"]
  };

  const [searchUserStr, setSearchUserStr] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(10);
  
  const currentDeptUsers = (mockDeptUsers[selectedDept] || []).filter(u => u.toLowerCase().includes(searchUserStr.toLowerCase()));
  const totalUserPages = Math.max(1, Math.ceil(currentDeptUsers.length / userPageSize));
  const paginatedDeptUsers = currentDeptUsers.slice((userPage - 1) * userPageSize, userPage * userPageSize);

  type Receiver = { name: string, type: "PD/TT" | "NK" | null };
  const [receivers, setReceivers] = useState<Receiver[]>([]);

  const addReceiver = (name: string) => {
    if (!receivers.find(r => r.name === name)) {
      setReceivers([...receivers, { name, type: null }]);
    }
  };

  const removeReceiver = (name: string) => {
    setReceivers(receivers.filter(r => r.name !== name));
  };

  const toggleReceiverType = (name: string, type: "PD/TT" | "NK") => {
    setReceivers(receivers.map(r => r.name === name ? { ...r, type: r.type === type ? null : type } : r));
  };

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const dummyData: any[] = [
    { nguoi: "Đỗ Văn Điển", doiTuong: "Nguyễn Đăng Lâm", ngay: "24/08/2026", title: "Xin ý kiến dự thảo tờ trình của BTGDV", trangThai: "Đang xin ý kiến" },
    { nguoi: "Lưu Anh Tuấn", doiTuong: "Nguyễn Như Trung", ngay: "24/08/2026", title: "Xin cấp HNCG", trangThai: "Đã phê duyệt" },
    { nguoi: "Đậu Việt Đức", doiTuong: "Nguyễn Như Trung", ngay: "23/08/2026", title: "Báo cáo tình hình triển khai nhiệm vụ", trangThai: "Đang soạn thảo" }
  ];
  
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

  let filteredData = dummyData.filter(row => selectedStatuses.includes(row.trangThai));

  if (isAdvSearchActive) {
    if (advSearch.noiDung) {
      filteredData = filteredData.filter(row => 
        (row.title && row.title.toLowerCase().includes(advSearch.noiDung.toLowerCase())) ||
        (row.noiDung && row.noiDung.toLowerCase().includes(advSearch.noiDung.toLowerCase()))
      );
    }
    if (advSearch.phongBan) {
      filteredData = filteredData.filter(row => row.phongBan && row.phongBan.toLowerCase().includes(advSearch.phongBan.toLowerCase()));
    }
    if (advSearch.ngayTrinhFrom) {
      filteredData = filteredData.filter(row => row.ngayTrinhISO && row.ngayTrinhISO >= advSearch.ngayTrinhFrom);
    }
    if (advSearch.ngayTrinhTo) {
      filteredData = filteredData.filter(row => row.ngayTrinhISO && row.ngayTrinhISO <= advSearch.ngayTrinhTo);
    }
  } else {
    // Basic search is only applied if advanced search is NOT active, or you can apply both. Let's apply both for safety.
  }

  if (searchKeyword) {
    filteredData = filteredData.filter(row => 
      (row.title && row.title.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (row.so && row.so.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (row.nguoi && row.nguoi.toLowerCase().includes(searchKeyword.toLowerCase()))
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
          <h1 className="text-[22px] font-normal text-gray-800">Danh sách văn bản dự thảo</h1>
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
                className="flex items-center justify-between w-[150px] bg-[#0078d4] text-white px-3 py-1.5 rounded text-[13px] font-medium"
              >
                <span className="truncate">Chọn trạng thái</span>
                <ChevronDown className="w-4 h-4 ml-2 shrink-0" />
              </button>
              
              {showStatusDropdown && (
                <div className="absolute right-0 top-full mt-1 w-[250px] bg-white border border-gray-200 rounded shadow-lg z-50 max-h-[300px] overflow-y-auto custom-scrollbar">
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
        <table className="w-full border-collapse text-[13px] mb-4">
          <thead>
            <tr>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[15%]">Người soạn</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[15%]">Lãnh đạo ký duyệt</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[10%]">Ngày trình</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[40%]">Về việc</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[20%]">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors text-gray-900">
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.nguoi}</td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.doiTuong}</td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.ngay}</td>
                  <td className="py-2.5 px-3 border border-gray-300">
                    <span 
                      className="text-gray-900 font-bold hover:underline cursor-pointer"
                      onClick={() => setShowDetailModal(true)}
                    >
                      {row.title}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">
                    <span className="text-[#005fb8]">{row.trangThai}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-800 bg-gray-50/50 border border-gray-200 font-medium">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
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

      {/* MODAL THÊM MỚI DỰ THẢO */}
      {showAddModal && renderModal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl w-[900px] flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
              <h2 className="text-[16px] font-bold text-gray-800">Thêm mới dự thảo</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-red-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1 custom-scrollbar text-[13px]">
              <div className="flex flex-col gap-4">
                <div className="flex items-start">
                  <label className="w-[150px] font-bold text-gray-800 pt-1.5">Loại văn bản</label>
                  <select className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:border-blue-500 focus:outline-none text-gray-900">
                    <option value="">--Chọn loại văn bản--</option>
                    <option value="Công văn">Công văn</option>
                    <option value="Công điện">Công điện</option>
                    <option value="Điều lệ Đảng">Điều lệ Đảng</option>
                    <option value="Công hàm">Công hàm</option>
                    <option value="Phiếu gửi">Phiếu gửi</option>
                    <option value="Tờ trình">Tờ trình</option>
                    <option value="Báo cáo">Báo cáo</option>
                    <option value="Kết luận">Kết luận</option>
                    <option value="Quyết định">Quyết định</option>
                    <option value="Giấy mời">Giấy mời</option>
                    <option value="Quy định">Quy định</option>
                    <option value="Thông tri">Thông tri</option>
                    <option value="Thông báo">Thông báo</option>
                    <option value="Bản tin">Bản tin</option>
                    <option value="Đề án">Đề án</option>
                    <option value="Xin ý kiến nội bộ">Xin ý kiến nội bộ</option>
                    <option value="Thông cáo">Thông cáo</option>
                    <option value="Tuyên bố">Tuyên bố</option>
                    <option value="Chiến lược">Chiến lược</option>
                  </select>
                </div>
                
                <div className="flex items-start">
                  <label className="w-[150px] font-bold text-gray-800 pt-1.5">Trích yếu<span className="text-red-500">*</span></label>
                  <textarea 
                    placeholder="Nhập trích yếu" 
                    className="flex-1 border border-gray-300 rounded px-3 py-2 min-h-[80px] focus:border-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-700 resize-y"
                  ></textarea>
                </div>
                
                <div className="flex items-start">
                  <label className="w-[150px] font-bold text-gray-800 pt-1.5">Chọn văn bản dự thảo</label>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="border border-dashed border-blue-400 rounded-sm bg-blue-50/30 p-6 flex flex-col items-center justify-center text-center relative">
                      <input type="file" id="file-upload" onChange={handleFileUpload} className="hidden" multiple accept=".doc,.docx,.pdf,.xls,.xlsx,.zip,.rar,.7z" />
                      <p className="text-gray-900 text-[13px] mb-1">
                        Kéo file vào đây để tải lên, hoặc <label htmlFor="file-upload" className="text-blue-600 cursor-pointer hover:underline">Tải lên</label> hoặc <span className="text-blue-600 cursor-pointer hover:underline">Scan</span>
                      </p>
                      <p className="text-gray-900 text-[11px] italic">
                        Chỉ hỗ trợ các đuôi: .doc, .docx, .pdf, .xls, .xlsx, .zip, .rar, .7z
                      </p>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="bg-gray-50 border border-gray-200 rounded p-2 flex flex-col gap-1.5">
                        {uploadedFiles.map((f, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[12px] bg-white border border-gray-200 px-2 py-1.5 rounded">
                            <span className="text-gray-900 font-medium truncate max-w-[400px]" title={f.name}>{f.name}</span>
                            <button onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700 font-bold" title="Xóa file">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-2">Luồng trình văn bản</label>
                  <div className="flex border border-gray-300 rounded min-h-[250px]">
                    {/* Tree View */}
                    <div className="w-[28%] border-r border-gray-300 p-2 overflow-y-auto">
                      <div className="flex items-center text-blue-600 font-bold mb-1 cursor-pointer" onClick={() => setIsTreeExpanded(!isTreeExpanded)}>
                        {isTreeExpanded ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />} 📁 Cục Cơ yếu-Công nghệ t...
                      </div>
                      {isTreeExpanded && (
                        <div className="pl-6 text-gray-900 space-y-1">
                          {Object.keys(mockDeptUsers).map(dept => (
                            <div 
                              key={dept} 
                              onClick={() => {
                                setSelectedDept(dept);
                                setUserPage(1);
                              }}
                              className={`flex items-center py-0.5 cursor-pointer hover:bg-gray-100 ${selectedDept === dept ? 'bg-blue-50 font-medium' : ''}`}
                            >
                              <div className="w-3 h-3 bg-yellow-400 mr-1.5 rounded-sm"></div> {dept}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* User List */}
                    <div className="w-[36%] border-r border-gray-300 flex flex-col text-gray-900">
                      <div className="p-2 border-b border-gray-200">
                        <input 
                          type="text" 
                          placeholder="Nhập vào từ khóa tìm kiếm" 
                          value={searchUserStr}
                          onChange={(e) => {
                            setSearchUserStr(e.target.value);
                            setUserPage(1);
                          }}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-[12px] focus:border-blue-500 focus:outline-none placeholder:text-gray-700 text-gray-900" 
                        />
                      </div>
                      <div className="flex justify-between items-center px-3 py-1.5 bg-gray-50 border-b border-gray-200 font-bold text-gray-900">
                        <span>Danh sách cán bộ</span>
                        <span>...</span>
                      </div>
                      <div className="overflow-y-auto flex-1">
                        {paginatedDeptUsers.map((user, idx) => {
                          const isAdded = receivers.some(r => r.name === user);
                          return (
                            <div key={idx} className={`flex justify-between items-center px-3 py-2 border-b border-gray-100 group text-gray-900 ${isAdded ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                              <span>{user}</span>
                              <button 
                                onClick={() => addReceiver(user)}
                                disabled={isAdded}
                                className={`${isAdded ? 'text-gray-300' : 'text-gray-600 hover:text-blue-600'}`}
                              >
                                <UserPlus className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      {/* Pagination for Users */}
                      <div className="p-2 border-t border-gray-200 flex items-center justify-between bg-gray-50 text-[11px]">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setUserPage(1)} disabled={userPage === 1} className="p-1 border border-gray-300 bg-white rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                            <ChevronsLeft className="w-3 h-3" />
                          </button>
                          <button onClick={() => setUserPage(prev => Math.max(1, prev - 1))} disabled={userPage === 1} className="p-1 border border-gray-300 bg-white rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-medium">{userPage}</span>
                          <button onClick={() => setUserPage(prev => Math.min(totalUserPages, prev + 1))} disabled={userPage === totalUserPages} className="p-1 border border-gray-300 bg-white rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                            <ChevronRight className="w-3 h-3" />
                          </button>
                          <button onClick={() => setUserPage(totalUserPages)} disabled={userPage === totalUserPages} className="p-1 border border-gray-300 bg-white rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                            <ChevronsRight className="w-3 h-3" />
                          </button>
                          <select value={userPageSize} onChange={e => { setUserPageSize(Number(e.target.value)); setUserPage(1); }} className="ml-2 border border-gray-300 rounded p-1 bg-white focus:outline-none">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="250">250</option>
                          </select>
                        </div>
                        <div className="font-medium text-gray-600">
                          {Math.min(currentDeptUsers.length, (userPage - 1) * userPageSize + 1)}-{Math.min(currentDeptUsers.length, userPage * userPageSize)} / {currentDeptUsers.length}
                        </div>
                      </div>
                    </div>
                    
                    {/* Selected List */}
                    <div className="w-[36%] p-2 flex flex-col text-gray-900">
                      <div className="border border-gray-300 max-h-[300px] overflow-y-auto">
                        <table className="w-full text-[12px] border-collapse text-gray-900">
                          <thead>
                            <tr className="border-b border-gray-300 bg-gray-50 sticky top-0">
                              <th className="py-1 px-2 text-left border-r border-gray-300 font-bold text-gray-900">Danh sách nhận văn bản</th>
                              <th className="py-1 px-1 text-center border-r border-gray-300 w-[15%] font-bold text-gray-900">PD/TT</th>
                              <th className="py-1 px-1 text-center border-r border-gray-300 w-[15%] font-bold text-gray-900">NK</th>
                              <th className="py-1 px-1 text-center w-[12%]"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {receivers.map((r, idx) => (
                              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-1.5 px-2 border-r border-gray-200">{r.name}</td>
                                <td className="py-1.5 px-1 border-r border-gray-200 text-center">
                                  <input 
                                    type="checkbox" 
                                    checked={r.type === "PD/TT"} 
                                    onChange={() => toggleReceiverType(r.name, "PD/TT")} 
                                    className="cursor-pointer"
                                  />
                                </td>
                                <td className="py-1.5 px-1 border-r border-gray-200 text-center">
                                  <input 
                                    type="checkbox" 
                                    checked={r.type === "NK"} 
                                    onChange={() => toggleReceiverType(r.name, "NK")} 
                                    className="cursor-pointer"
                                  />
                                </td>
                                <td className="py-1.5 px-1 text-center">
                                  <button onClick={() => removeReceiver(r.name)} className="text-gray-500 hover:text-red-500">
                                    <Ban className="w-3.5 h-3.5 mx-auto" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {receivers.length === 0 && (
                              <tr><td colSpan={4} className="h-[30px]"></td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-4 text-[12px] text-gray-900 p-2 bg-gray-50 rounded">
                        <p className="font-bold mb-1">Lưu ý:</p>
                        <p>- "NK": Lãnh đạo ký văn bản dự thảo</p>
                        <p>- "PD/TT": Những người có thể phê duyệt/trình tiếp VB dự thảo</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2 shrink-0 bg-gray-50">
              <button className="flex items-center px-4 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors shadow-sm">
                Lưu lại và Trình ký
              </button>
              <button className="flex items-center px-4 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors shadow-sm">
                Lưu lại và Xin ý kiến
              </button>
              <button className="flex items-center px-4 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors shadow-sm">
                Lưu lại
              </button>
              <button onClick={() => setShowAddModal(false)} className="flex items-center px-4 py-1.5 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-semibold transition-colors shadow-sm">
                <X className="w-4 h-4 mr-1" /> Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DOCUMENT DETAIL MODAL --- */}
      <DocumentDetailModal 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết văn bản dự thảo"
      />
    </div>
  );
}
