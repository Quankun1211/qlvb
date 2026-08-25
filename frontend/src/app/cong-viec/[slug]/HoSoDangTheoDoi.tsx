"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, RefreshCcw, X, ChevronDown, ChevronRight, Plus, UploadCloud, UserPlus, Ban } from "lucide-react";
import Pagination from "../../van-ban-den/[slug]/Pagination";

const trangThaiList = ["Đang xử lý", "Đã kết thúc"];

const mockDepartments = [
  { id: '1', name: 'Phòng Quản lý hệ thống', users: ['Phan Văn Nhân', 'Nguyễn Thị Thu Hằng', 'Bùi Hữu Việt', 'Nguyễn Vũ Tuyên', 'Chu Phúc Hà'] },
  { id: '2', name: 'Phòng Nghiên cứu ứng dụng và Chuyển đổi số', users: ['Đỗ Văn Điền', 'Đoàn Đắc Trường', 'Hoàng Trung Kiên', 'Trần Xuân Khôi', 'Ngô Hoàng Thắng', 'Lê Trung Hiền', 'Lê Quang Trường'] },
  { id: '3', name: 'Phòng Quản lý kỹ thuật nghiệp vụ mật mã', users: ['Trần Văn A', 'Nguyễn Thị B'] },
  { id: '4', name: 'Phòng Tổ chức - Tổng hợp', users: ['Lê Văn C', 'Phạm Thị D'] },
  { id: '5', name: 'Phòng Mã dịch - Truyền thông', users: ['Hoàng Văn E'] },
  { id: '6', name: 'Phòng Bảo mật và An toàn thông tin', users: ['Đinh Văn F', 'Lý Thị G'] },
  { id: '7', name: 'Phòng Điện báo', users: ['Ngô Văn H'] },
  { id: '8', name: 'Chi Đoàn thanh niên CY', users: ['Trịnh Văn I'] },
  { id: '9', name: 'Ban Đời sống', users: ['Vũ Văn K'] },
  { id: '10', name: 'Đảng ủy Cục', users: ['Đặng Văn L'] }
];

type RoleType = 'PT' | 'PH' | 'TD' | null;

interface AssignedUser {
  name: string;
  role: RoleType;
}

export default function HoSoDangTheoDoi() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [activeDateFilter, setActiveDateFilter] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState("2026");

  // State cho Modal thêm mới
  const currentUser = "Lê Nhật Minh"; // Giả lập tài khoản đang đăng nhập (có thể thay đổi khi nối API)
  const [isTreeOpen, setIsTreeOpen] = useState(true);
  const [selectedDeptId, setSelectedDeptId] = useState<string>("1");
  const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>([{ name: currentUser, role: 'PT' }]);

  const handleRoleChange = (name: string, role: RoleType) => {
    setAssignedUsers(prev => prev.map(u => u.name === name ? { ...u, role } : u));
  };

  const handleRemoveUser = (name: string) => {
    setAssignedUsers(prev => prev.filter(u => u.name !== name));
  };

  const handleAddUser = (name: string) => {
    if (!assignedUsers.find(u => u.name === name)) {
      setAssignedUsers(prev => [...prev, { name, role: null }]);
    }
  };
  
  // Dropdowns
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([...trangThaiList]);
  
  const [searchKeyword, setSearchKeyword] = useState("");
  
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Advanced search form
  const [advSearch, setAdvSearch] = useState({
    tenHoSo: "",
    hanXuLyFrom: "",
    hanXuLyTo: "",
    ngayGiaoFrom: "",
    ngayGiaoTo: ""
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
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
    setSelectedYear("2026");
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
    { ten: "Hồ sơ dự án chuyển đổi số", ngayGiao: "25/08/2026", hanXuLy: "30/08/2026", nguoiLap: "Lê Nhật Minh", phuTrach: "Nguyễn Văn A", phoiHop: "Trần Thị B", theoDoi: "Lê Văn C", trangThai: "Đang xử lý" },
    { ten: "Hồ sơ triển khai hệ thống nội bộ", ngayGiao: "24/08/2026", hanXuLy: "28/08/2026", nguoiLap: "Lê Nhật Minh", phuTrach: "Lê Văn C", phoiHop: "Nguyễn Văn A", theoDoi: "Trần Thị B", trangThai: "Đã kết thúc" },
    { ten: "Hồ sơ mua sắm thiết bị", ngayGiao: "23/08/2026", hanXuLy: "25/08/2026", nguoiLap: "Lê Nhật Minh", phuTrach: "Trần Thị B", phoiHop: "", theoDoi: "Nguyễn Văn A", trangThai: "Đang xử lý" }
  ];

  let filteredData = dummyData.filter(row => selectedStatuses.includes(row.trangThai));

  if (searchKeyword) {
    filteredData = filteredData.filter(row => 
      row.ten.toLowerCase().includes(searchKeyword.toLowerCase())
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
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-[22px] font-normal text-gray-800">Danh sách hồ sơ công việc đang theo dõi</h1>
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
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Thêm mới
          </button>

          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Nhập tên hồ sơ tìm kiếm"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              className="w-[250px] border border-gray-300 rounded px-3 py-1.5 text-[13px] focus:border-[#005fb8] focus:outline-none placeholder:text-gray-500 text-gray-900"
            />
            
            <div className="relative" ref={statusRef}>
              <button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center justify-between w-[160px] bg-white border border-gray-300 text-gray-800 px-3 py-1.5 rounded text-[13px]"
              >
                <span className="truncate">--Tất cả trạng thái--</span>
                <ChevronDown className="w-4 h-4 ml-2 shrink-0 text-gray-500" />
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
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[30%]">Tên hồ sơ</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[10%]">Ngày giao</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[10%]">Hạn xử lý</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[12%]">Người lập hồ sơ</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[10%]">Phụ trách</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[10%]">Phối hợp</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[9%]">Theo dõi</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[9%]">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors text-gray-900">
                  <td className="py-2.5 px-3 border border-gray-300">
                    <span className="text-[#005fb8] hover:underline cursor-pointer font-bold">
                      {row.ten}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.ngayGiao}</td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.hanXuLy}</td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.nguoiLap}</td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.phuTrach}</td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.phoiHop}</td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.theoDoi}</td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">
                    <span className="text-[#005fb8]">{row.trangThai}</span>
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
                <div className="w-[120px] font-bold shrink-0 mt-1.5 text-right">Tên hồ sơ</div>
                <div className="flex-1">
                  <textarea 
                    rows={2} 
                    placeholder="Nhập tên hồ sơ" 
                    value={advSearch.tenHoSo}
                    onChange={e => setAdvSearch({...advSearch, tenHoSo: e.target.value})}
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

      {/* MODAL THÊM MỚI HỒ SƠ CÔNG VIỆC */}
      {showAddModal && renderModal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 py-8" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded shadow-xl w-[1000px] max-h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
              <h2 className="text-[15px] font-bold text-gray-800">Thêm mới hồ sơ công việc</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-900 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-[13px] text-gray-800 overflow-y-auto">
              <div className="relative border border-gray-200 rounded-md p-6 pt-6">
                <div className="absolute -top-3 left-4 bg-white px-2 font-bold text-gray-800 text-[14px]">
                  Thông tin cơ bản
                </div>

                <div className="flex items-center gap-4 mb-4 mt-2">
                  <div className="w-[120px] font-bold shrink-0 text-right">Mã hồ sơ<span className="text-red-500">(*)</span></div>
                  <input type="text" placeholder="Nhập tên hồ sơ" className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900" />
                  
                  <div className="w-[100px] font-bold shrink-0 text-right">Số hồ sơ<span className="text-red-500">(*)</span></div>
                  <input type="text" defaultValue="0" className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900" />
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-[120px] font-bold shrink-0 text-right">Tên hồ sơ<span className="text-red-500">(*)</span></div>
                  <input type="text" placeholder="Nhập tên hồ sơ" className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900" />
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-[120px] font-bold shrink-0 text-right">Người lập HS</div>
                  <input type="text" value="Lê Nhật Minh" disabled className="flex-1 border border-gray-300 rounded px-3 py-1.5 bg-gray-100 text-gray-600 focus:outline-none" />
                  
                  <div className="w-[100px] font-bold shrink-0 text-right">Loại hồ sơ</div>
                  <select className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white">
                    <option>-- Chọn loại hồ sơ --</option>
                    <option>Hồ sơ nội bộ</option>
                    <option>Hồ sơ chính phủ</option>
                  </select>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-[120px] font-bold shrink-0 mt-1.5 text-right">Nội dung</div>
                  <textarea rows={3} className="flex-1 border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none resize-none text-gray-900"></textarea>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-[120px] font-bold shrink-0 text-right">Ngày bắt đầu<span className="text-red-500">(*)</span></div>
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900" />
                  
                  <div className="w-[100px] font-bold shrink-0 text-right">Ngày kết thúc</div>
                  <input type="datetime-local" className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900" />
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-[120px] font-bold shrink-0 text-right">Lĩnh vực</div>
                  <input type="text" placeholder="Nhập lĩnh vực" className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900" />
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-[120px] font-bold shrink-0 mt-1.5 text-right">File đính kèm</div>
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

                {/* Quản lý danh sách nhận văn bản */}
                <div className="flex gap-2 h-[300px] border border-gray-200 mt-6 rounded overflow-hidden">
                  <div className="w-1/3 border-r border-gray-200 bg-gray-50 p-2 overflow-y-auto">
                    <div 
                      className="font-bold text-[#005fb8] mb-2 flex items-center cursor-pointer hover:bg-gray-200 p-1 rounded transition-colors"
                      onClick={() => setIsTreeOpen(!isTreeOpen)}
                    >
                      {isTreeOpen ? <ChevronDown className="w-4 h-4 mr-1 shrink-0" /> : <ChevronRight className="w-4 h-4 mr-1 shrink-0" />}
                      Cục Cơ yếu - Công nghệ thông tin
                    </div>
                    {isTreeOpen && (
                      <div className="pl-5 space-y-1 text-gray-700">
                        {mockDepartments.map(dept => (
                          <div 
                            key={dept.id}
                            onClick={() => setSelectedDeptId(dept.id)}
                            className={`flex items-center p-1.5 cursor-pointer rounded transition-colors ${selectedDeptId === dept.id ? 'text-[#005fb8] font-bold bg-[#e5f1fb]' : 'hover:bg-gray-200'}`}
                          >
                            {/* Empty icon to align text if needed */}
                            {selectedDeptId === dept.id ? <ChevronDown className="w-3 h-3 mr-1.5 shrink-0" /> : <div className="w-4 h-3 mr-1.5 shrink-0" />}
                            {dept.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
                    <div className="font-bold bg-gray-100 px-3 py-1.5 border-b border-gray-200">Danh sách cán bộ</div>
                    <div className="overflow-y-auto flex-1">
                      {mockDepartments.find(d => d.id === selectedDeptId)?.users.map((name, i) => (
                        <div key={i} className="flex justify-between items-center px-3 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          {name}
                          <button 
                            onClick={() => handleAddUser(name)}
                            className="text-gray-500 hover:text-[#005fb8] p-1"
                            title="Thêm vào danh sách nhận"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="w-1/3 bg-white flex flex-col">
                    <div className="overflow-y-auto flex-1">
                      <table className="w-full text-center">
                        <thead className="bg-gray-100 font-bold border-b border-gray-200 sticky top-0">
                          <tr>
                            <th className="py-1.5 px-2 text-left w-[55%] text-[12px]">Danh sách nhận văn bản</th>
                            <th className="py-1.5 px-1 text-[12px]">PT</th>
                            <th className="py-1.5 px-1 text-[12px]">PH</th>
                            <th className="py-1.5 px-1 text-[12px]">TD</th>
                            <th className="py-1.5 px-1"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {assignedUsers.map((user, idx) => (
                            <tr key={idx} className="border-b border-gray-100">
                              <td className="py-2 px-2 text-left text-[12px] break-words">{user.name}</td>
                              <td>
                                <input 
                                  type="checkbox" 
                                  checked={user.role === 'PT'} 
                                  onChange={() => handleRoleChange(user.name, 'PT')} 
                                  className="accent-[#005fb8] cursor-pointer" 
                                />
                              </td>
                              <td>
                                <input 
                                  type="checkbox" 
                                  checked={user.role === 'PH'} 
                                  onChange={() => handleRoleChange(user.name, 'PH')} 
                                  className="accent-[#005fb8] cursor-pointer" 
                                />
                              </td>
                              <td>
                                <input 
                                  type="checkbox" 
                                  checked={user.role === 'TD'} 
                                  onChange={() => handleRoleChange(user.name, 'TD')} 
                                  className="accent-[#005fb8] cursor-pointer" 
                                />
                              </td>
                              <td>
                                <button onClick={() => handleRemoveUser(user.name)} className="hover:text-red-500 p-0.5" title="Loại người này">
                                  <Ban className="w-3.5 h-3.5 text-gray-500 hover:text-red-500 mx-auto transition-colors" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-2 text-gray-500 italic mt-auto border-t border-gray-200 text-[11px] leading-relaxed bg-gray-50">
                      Lưu ý:<br/>
                      - "PT": Người phụ trách<br/>
                      - "PH": Người phối hợp<br/>
                      - "TD": Người theo dõi<br/>
                      - Tất cả những người được chọn đều có thể đóng góp ý kiến
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50/50 rounded-b shrink-0">
              <button className="flex items-center px-6 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors">
                Lưu
              </button>
              <button onClick={() => setShowAddModal(false)} className="flex items-center px-4 py-1.5 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-semibold transition-colors">
                <X className="w-4 h-4 mr-1.5" /> Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
