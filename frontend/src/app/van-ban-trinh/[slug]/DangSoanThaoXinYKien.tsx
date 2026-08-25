"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, RefreshCcw, Plus, X, ChevronDown, Paperclip } from "lucide-react";
import Pagination from "../../van-ban-den/[slug]/Pagination";
import VanBanTrinhDetailModal from "@/components/shared/VanBanTrinhDetailModal";

const allStatuses = [
  "Đang soạn thảo", "Đang xin ý kiến"
];

const phongBanList = [
  "Đơn vị đôn đốc",
  "Đại sứ quán Việt Nam tại Timor-Leste",
  "Văn phòng Bộ Trưởng",
  "Đại sứ quán Việt Nam tại Bangladesh",
  "Tổng Lãnh sự quán tại Osaka, Nhật Bản",
  "OIDA"
];

export default function DangSoanThaoXinYKien() {
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
  const [formErrors, setFormErrors] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

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
    setSelectedStatuses(["Đang soạn thảo", "Trưởng phòng trả về", "Lãnh đạo đơn vị trả về", "Đang xin ý kiến"]);
    setSelectedYear("2026");
    setCurrentPage(1);
  };

  const renderModal = (content: React.ReactNode) => {
    if (!mounted) return null;
    return createPortal(content, document.body);
  };

  const dummyData: any[] = [
    { stt: 1, so: "423/TTr-CYTT", title: "Tờ trình xin tổ chức hội thảo an toàn thông tin 2026", nguoi: "Nguyễn Văn A", ngay: "25/08/2026", phong: "Phòng An Toàn Thông Tin", doiTuong: "Cục phó", trangThai: "Đang soạn thảo" },
    { stt: 2, so: "424/TTr-CYTT", title: "Xin ý kiến về việc sửa đổi quy chế văn thư", nguoi: "Trần Thị B", ngay: "25/08/2026", phong: "Phòng Hành chính", doiTuong: "Cục trưởng", trangThai: "Đang xin ý kiến" }
  ];
  const filteredData = dummyData.filter(row => selectedStatuses.includes(row.trangThai));
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full min-h-full bg-white shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-[22px] font-normal text-gray-800">Danh sách văn bản trình đang soạn thảo/ Xin ý kiến</h1>
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
                <ChevronDown className="w-4 h-4 ml-2 opacity-80 shrink-0" />
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
                    <span className={`inline-block px-3 py-1 text-white rounded-full text-[11px] font-semibold ${row.trangThai === 'Đang soạn thảo' ? 'bg-[#0d6efd]' : 'bg-[#ffc107] text-black'}`}>
                      {row.trangThai}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-6 text-center text-gray-800 bg-gray-50/50 font-medium">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* We always render Pagination even if empty to match the design pattern in the screenshot, or conditionally. The screenshot shows "Không có dữ liệu" but I'll add Pagination */}
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
              <button onClick={() => setShowAdvancedSearch(false)} className="flex items-center px-4 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors">
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
      {showAddModal && renderModal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded shadow-xl w-[900px] max-h-[95vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 shrink-0">
              <h2 className="text-[14px] font-bold text-gray-800">Thêm mới văn bản trình</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar text-[13px] text-gray-900">
              <div className="flex justify-between items-start mb-6">
                <div className="text-center font-bold">
                  <div className="text-[12px]">BỘ NGOẠI GIAO</div>
                  <div className="text-[12px]"><span className="font-normal italic">Đơn vị: </span>Cục Cơ yếu-Công nghệ thông tin</div>
                  <div className="mt-1 flex items-center justify-center gap-1 text-[12px]">
                    <span className="font-normal italic">Số:</span>
                    <div className="border-b border-black w-[50px]"></div>
                    <span>/</span>
                    <div className="border-b border-black min-w-[70px]">TTr-CYTT</div>
                  </div>
                </div>
                <div className="italic mt-1 text-[12px]">
                  Hà Nội, Ngày <span className="ml-2">Tháng</span> <span className="ml-2">Năm 2026</span>
                </div>
              </div>
              
              <div className="text-center font-bold uppercase text-[14px] mb-6">TỜ TRÌNH GIẢI QUYẾT CÔNG VIỆC</div>
              
              <div className="flex flex-col gap-5 mb-6">
                <div className="flex items-start gap-4">
                  <div className="italic w-[120px] text-right mt-1 shrink-0">Kính gửi:</div>
                  <div className="flex-1 flex flex-col gap-0.5">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">Lãnh đạo Bộ</span>
                      <select className="border border-gray-300 rounded px-2 py-1 text-[13px] text-gray-800 focus:outline-none focus:border-[#005fb8] min-w-[220px]">
                        <option value="">Chọn lãnh đạo</option>
                        <option value="1">Bộ trưởng Lê Hoài Trung</option>
                        <option value="2">Thứ trưởng Nguyễn Minh Vũ</option>
                        <option value="3">Thứ trưởng Thường trực Nguyễn...</option>
                        <option value="4">Thứ trưởng Đặng Hoàng Giang</option>
                        <option value="5">Thứ trưởng Lê Anh Tuấn</option>
                      </select>
                      {formErrors && (
                        <div className="w-3.5 h-3.5 rounded-full border border-red-500 flex items-center justify-center text-red-500 text-[10px] font-bold">!</div>
                      )}
                    </div>
                    {formErrors && (
                      <div className="text-red-500 text-[11px] ml-24 pl-1">Vui lòng chọn lãnh đạo kính gửi!</div>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="italic w-[120px] text-right mt-1 shrink-0">Vấn đề trình:</div>
                  <div className="flex-1 relative max-w-[500px]">
                    <textarea 
                      rows={2} 
                      placeholder="Nhập vấn đề trình"
                      className="w-full border-b border-gray-300 border-x-0 border-t-0 bg-transparent px-1 py-0.5 focus:ring-0 focus:border-[#005fb8] resize-none placeholder:text-gray-400 text-[13px]"
                    />
                    {formErrors && (
                      <>
                        <div className="absolute -right-6 top-1 w-3.5 h-3.5 rounded-full border border-red-500 flex items-center justify-center text-red-500 text-[10px] font-bold">!</div>
                        <div className="text-red-500 text-[11px] mt-0.5">Vui lòng nhập dữ liệu!</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <table className="w-full border-collapse border border-black text-center text-[12px]">
                <tbody>
                  <tr>
                    <td className="w-[65%] border border-black bg-[#e9ecef] font-bold p-2 uppercase">
                      Tóm tắt nội dung và kiến nghị
                    </td>
                    <td colSpan={2} className="w-[35%] border border-black bg-[#e9ecef] font-bold p-2 uppercase">
                      Ý kiến chỉ đạo của Bộ trưởng
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-0 align-top text-left h-[380px] relative flex-col flex">
                      <div className="flex items-center gap-4 p-2 border-b border-gray-300 bg-white shrink-0">
                        <select className="border border-gray-300 rounded px-1 py-0.5 text-[12px] bg-white text-gray-900 outline-none"><option>Normal</option></select>
                        <div className="flex gap-3 font-serif font-bold text-[14px] text-gray-900">
                          <button className="hover:text-black">B</button>
                          <button className="italic hover:text-black">I</button>
                          <button className="underline hover:text-black">U</button>
                          <button className="hover:text-black strikethrough line-through">S</button>
                          <button className="hover:text-black text-[12px]">🔗</button>
                          <button className="hover:text-black text-[12px] flex flex-col gap-0.5 mt-1"><span className="w-3 h-[2px] bg-gray-600"></span><span className="w-3 h-[2px] bg-gray-600"></span><span className="w-3 h-[2px] bg-gray-600"></span></button>
                          <button className="hover:text-black text-[12px] flex flex-col gap-0.5 mt-1"><span className="w-3 h-[2px] bg-gray-600"></span><span className="w-2 h-[2px] bg-gray-600"></span><span className="w-3 h-[2px] bg-gray-600"></span></button>
                        </div>
                      </div>
                      <div className="p-2 text-gray-900 flex-1">...</div>
                    </td>
                    <td colSpan={2} className="border border-black p-0 align-top">
                      <div className="flex flex-col h-full min-h-[380px]">
                        <div className="flex-1"></div>
                        <div className="bg-white font-bold p-2 uppercase border-y border-black">
                          Giải quyết của<br/>Lãnh đạo bộ
                        </div>
                        <div className="flex-1"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 align-top text-center relative">
                      <div className="font-bold inline-flex items-center gap-1.5 mt-2">
                        Hồ sơ kèm theo 
                        <span 
                          onClick={() => fileInputRef.current?.click()} 
                          className="cursor-pointer hover:opacity-70 transition-opacity ml-1"
                          title="Đính kèm tệp (.zip, .pdf, .doc)"
                        >
                          ✏️
                        </span>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => {
                          if (e.target.files) setAttachedFiles(Array.from(e.target.files));
                        }} 
                        className="hidden" 
                        multiple 
                        accept=".zip,.pdf,.doc,.docx" 
                      />
                      {attachedFiles.length > 0 && (
                        <div className="mt-2 text-[11px] text-left px-2 font-normal text-blue-600">
                          {attachedFiles.map((f, idx) => (
                            <div key={idx} className="truncate">{f.name}</div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="w-[17.5%] border border-black p-2 align-top text-center h-[140px] relative">
                      <div className="font-bold">Cơ yếu</div>
                      <div className="font-bold absolute bottom-2 w-full left-0 text-center">Lê Nhật Minh</div>
                    </td>
                    <td className="w-[17.5%] border border-black p-2 align-top text-center h-[140px] relative">
                      <div className="font-bold">Cục trưởng</div>
                      <div className="font-bold absolute bottom-2 w-full left-0 text-center">Vũ Tiến Dũng</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="px-4 py-2 flex justify-end gap-1.5 shrink-0">
              <button onClick={() => setFormErrors(true)} className="px-3 py-1.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white rounded text-[12px] font-medium transition-colors">
                + Lưu lại và Trình ký
              </button>
              <button onClick={() => setFormErrors(true)} className="px-3 py-1.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white rounded text-[12px] font-medium transition-colors">
                + Lưu lại và Xin ý kiến
              </button>
              <button onClick={() => setFormErrors(true)} className="px-3 py-1.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white rounded text-[12px] font-medium transition-colors">
                + Lưu lại
              </button>
              <button onClick={() => setShowAddModal(false)} className="px-3 py-1.5 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[12px] font-medium transition-colors">
                x Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DOCUMENT DETAIL MODAL --- */}
      <VanBanTrinhDetailModal 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)}
      />

    </div>
  );
}
