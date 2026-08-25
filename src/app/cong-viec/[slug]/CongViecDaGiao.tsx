"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, RefreshCcw, X, ChevronDown, Plus, UploadCloud } from "lucide-react";
import Pagination from "../../van-ban-den/[slug]/Pagination";
import DocumentDetailModal from "@/components/shared/DocumentDetailModal";

const loaiThongBaoList = ["Quá hạn", "Sắp hết hạn"];
const trangThaiList = ["Chưa xử lý", "Đang xử lý", "Đã kết thúc", "Tạm dừng"];
const nguonCongViecList = [
  "Đề án xử lý đối ngoại",
  "Báo cáo kết quả h/đ đối ngoại",
  "Đề án chuẩn bị cho h/đ đối ngoại",
  "Từ Công điện, công hàm",
  "Từ Báo cáo/Báo cáo tiếp xúc",
  "Từ họp Giao ban Bộ"
];

export default function CongViecDaGiao() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [activeDateFilter, setActiveDateFilter] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState("2026");
  
  // Dropdowns
  const [showLoaiThongBaoDropdown, setShowLoaiThongBaoDropdown] = useState(false);
  const [selectedLoaiThongBao, setSelectedLoaiThongBao] = useState<string[]>([...loaiThongBaoList]);
  
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([...trangThaiList]);
  
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showGiaoViecModal, setShowGiaoViecModal] = useState(false);
  
  // Advanced search form
  const [advSearch, setAdvSearch] = useState({
    soDen: "",
    tenCongViec: "",
    hanXuLyFrom: "",
    hanXuLyTo: "",
    ngayGiaoFrom: "",
    ngayGiaoTo: ""
  });

  // Giao việc form
  const [giaoViecForm, setGiaoViecForm] = useState({
    chiDao: "",
    nguonCongViec: "",
    hanTraLoi: "",
    bangSoNgay: ""
  });
  const [showNguonDropdown, setShowNguonDropdown] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const ltbRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const nguonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ltbRef.current && !ltbRef.current.contains(event.target as Node)) {
        setShowLoaiThongBaoDropdown(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (nguonRef.current && !nguonRef.current.contains(event.target as Node)) {
        setShowNguonDropdown(false);
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
    setSelectedYear("2026");
    setSelectedLoaiThongBao([...loaiThongBaoList]);
    setSelectedStatuses([...trangThaiList]);
    setCurrentPage(1);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderModal = (content: React.ReactNode) => {
    if (!mounted) return null;
    return createPortal(content, document.body);
  };

  const dummyData: any[] = [
    { tenCongViec: "Chuẩn bị báo cáo công tác tuần 4", hanXuLy: "28/08/2026", ngayGiao: "25/08/2026", ngNc: "Người giao 1", chuTri: "Nguyễn Văn A", phoiHop: "Phòng Hành chính", trangThai: "Chưa xử lý" },
    { tenCongViec: "Đánh giá kết quả triển khai dự án", hanXuLy: "30/08/2026", ngayGiao: "24/08/2026", ngNc: "Người giao 2", chuTri: "Trần Thị B", phoiHop: "Phòng Kế toán", trangThai: "Đang xử lý" },
    { tenCongViec: "Họp giao ban định kỳ", hanXuLy: "26/08/2026", ngayGiao: "23/08/2026", ngNc: "Người giao 1", chuTri: "Lê Văn C", phoiHop: "", trangThai: "Đã kết thúc" }
  ];

  let filteredData = dummyData.filter(row => selectedStatuses.includes(row.trangThai));

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
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-[22px] font-normal text-gray-800">Danh sách công việc đã giao</h1>
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

        <div className="flex justify-between items-center mt-2">
          <button 
            onClick={() => setShowGiaoViecModal(true)}
            className="flex items-center px-4 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Giao việc
          </button>

          <div className="flex items-center gap-2">
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

      {/* MODAL GIAO VIỆC */}
      {showGiaoViecModal && renderModal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={() => setShowGiaoViecModal(false)}>
          <div className="bg-white rounded shadow-xl w-[900px] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
              <h2 className="text-[15px] font-bold text-gray-800">Giao việc</h2>
              <button onClick={() => setShowGiaoViecModal(false)} className="text-gray-900 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-[13px] text-gray-800">
              <div className="relative border border-gray-200 rounded-md p-6 pt-8 mt-2">
                <div className="absolute -top-3 left-4 bg-white px-2 font-bold text-gray-800 text-[14px]">
                  Phân công, xử lý công việc
                </div>

                <div className="flex items-start gap-4 mb-5">
                  <div className="w-[140px] font-bold shrink-0 mt-1.5 text-right">
                    Chỉ đạo của lãnh đạo<span className="text-red-500">*</span>
                  </div>
                  <div className="flex-1">
                    <textarea 
                      rows={3} 
                      value={giaoViecForm.chiDao}
                      onChange={e => setGiaoViecForm({...giaoViecForm, chiDao: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none resize-none text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <div className="w-[140px] font-bold shrink-0 text-right">Nguồn công việc</div>
                  <div className="flex-1 relative" ref={nguonRef}>
                    <input 
                      type="text" 
                      placeholder="Nhập tên nguồn công việc..." 
                      value={giaoViecForm.nguonCongViec}
                      onChange={e => {
                        setGiaoViecForm({...giaoViecForm, nguonCongViec: e.target.value});
                        setShowNguonDropdown(true);
                      }}
                      onFocus={() => setShowNguonDropdown(true)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none placeholder:text-gray-500 text-gray-900"
                    />
                    {showNguonDropdown && (
                      <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-50 max-h-[200px] overflow-y-auto">
                        <div className="py-1">
                          {nguonCongViecList.filter(p => p.toLowerCase().includes(giaoViecForm.nguonCongViec.toLowerCase())).map((pb, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => {
                                setGiaoViecForm({...giaoViecForm, nguonCongViec: pb});
                                setShowNguonDropdown(false);
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
                </div>

                <div className="flex items-start gap-4 mb-5">
                  <div className="w-[140px] font-bold shrink-0 mt-1.5 text-right">File đính kèm</div>
                  <div className="flex-1">
                    <div 
                      className="border border-dashed border-[#0078d4] rounded bg-[#f3f9ff] p-6 text-center cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        multiple 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                      <div className="flex flex-col items-center justify-center text-gray-700">
                        <p className="mb-1">
                          Kéo file vào đây để tải lên, hoặc <span className="text-[#005fb8]">Tải lên</span> hoặc <span className="text-[#005fb8]">Scan</span>
                        </p>
                        <p className="text-[12px] text-gray-500 italic">
                          Chỉ hỗ trợ các đuôi: .doc, .docx, .pdf, .xls, .xlsx, .zip, .rar, .7z
                        </p>
                      </div>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 bg-gray-50 border border-gray-200 rounded p-2 max-h-[150px] overflow-y-auto">
                        <ul className="space-y-1">
                          {uploadedFiles.map((f, i) => (
                            <li key={i} className="flex items-center justify-between text-[12px] p-1.5 bg-white border border-gray-100 rounded">
                              <span className="flex items-center text-[#005fb8] truncate">
                                <UploadCloud className="w-3.5 h-3.5 mr-1.5 text-gray-400 shrink-0" />
                                {f.name}
                              </span>
                              <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-gray-400 hover:text-red-500 ml-2">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center flex-1 pr-4">
                    <div className="w-[140px] font-bold shrink-0 text-right mr-4">Hạn trả lời</div>
                    <input 
                      type="date" 
                      value={giaoViecForm.hanTraLoi}
                      onChange={e => setGiaoViecForm({...giaoViecForm, hanTraLoi: e.target.value})}
                      className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900"
                    />
                  </div>
                  <div className="flex items-center flex-1 pl-4">
                    <div className="w-[100px] font-bold shrink-0 text-right mr-4">Bằng số ngày</div>
                    <input 
                      type="text" 
                      value={giaoViecForm.bangSoNgay}
                      onChange={e => setGiaoViecForm({...giaoViecForm, bangSoNgay: e.target.value})}
                      className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900"
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50/50 rounded-b">
              <button className="flex items-center px-4 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors">
                Giao việc
              </button>
              <button onClick={() => setShowGiaoViecModal(false)} className="flex items-center px-4 py-1.5 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-semibold transition-colors">
                <X className="w-4 h-4 mr-1.5" /> Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DOCUMENT DETAIL MODAL --- */}
      <DocumentDetailModal 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết công việc đã giao"
      />

    </div>
  );
}
