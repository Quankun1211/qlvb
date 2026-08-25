"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, RefreshCcw, Plus, X, ChevronDown, ChevronRight, UploadCloud, UserPlus, Ban, ChevronsLeft, ChevronLeft, ChevronsRight } from "lucide-react";
import Pagination from "../../van-ban-den/[slug]/Pagination";
import VanBanDuThaoDetailModal from "@/components/shared/VanBanDuThaoDetailModal";

const allStatuses = [
  "Đã phát hành"
];

const phongBanList = [
  "Đơn vị đôn đốc",
  "Đại sứ quán Việt Nam tại Timor-Leste",
  "Văn phòng Bộ Trưởng",
  "Đại sứ quán Việt Nam tại Bangladesh",
  "Tổng Lãnh sự quán tại Osaka, Nhật Bản",
  "OIDA"
];

export default function DaKyDaPheDuyet() {
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
    setSelectedYear("2026");
    setCurrentPage(1);
  };

  const renderModal = (content: React.ReactNode) => {
    if (!mounted) return null;
    return createPortal(content, document.body);
  };


  const dummyData: any[] = [
    { nguoi: "Đỗ Văn Điển", doiTuong: "Nguyễn Đăng Lâm", ngay: "24/08/2026", title: "Xin ý kiến dự thảo tờ trình của BTGDV", trangThai: "Đã phát hành" },
    { nguoi: "Đỗ Văn Điển", doiTuong: "Nguyễn Đăng Lâm", ngay: "24/08/2026", title: "V/v Đăng ký cơ sở hạ tầng CNTT tại Trung tâm dữ liệu quốc gia cho CSDL quốc gia về cam kết quốc tế", trangThai: "Đã phát hành" },
    { nguoi: "Lưu Anh Tuấn", doiTuong: "Nguyễn Như Trung", ngay: "24/08/2026", title: "Xin cấp HNCG", trangThai: "Đã phát hành" },
    { nguoi: "Đậu Việt Đức", doiTuong: "Nguyễn Như Trung", ngay: "24/08/2026", title: "Ý kiến chỉ đạo và kết luận của Lãnh đạo Bộ tại cuộc họp về CĐS ngày 22/8 - định kỳ lần thứ 10", trangThai: "Đã phát hành" },
    { nguoi: "Lê Mai Phượng", doiTuong: "Nguyễn Như Trung", ngay: "24/08/2026", title: "Góp ý TKCT của BCKTKT dự án LPQT 2026", trangThai: "Đã phát hành" },
    { nguoi: "Kiều Việt Hùng", doiTuong: "Nguyễn Như Trung", ngay: "22/08/2026", title: "Về cung cấp thông tin phục vụ CV số 4431/TGV ngày 21/8/2026 của Tổ Giúp việc", trangThai: "Đã phát hành" },
    { nguoi: "Phạm Trung Dũng", doiTuong: "Nguyễn Như Trung", ngay: "22/08/2026", title: "Công văn gửi Cục NVVH đ/n cho ý kiến đối với Báo cáo đề xuất chủ trương đầu tư Dự án \"Nâng cấp phần mềm Cơ sở dữ liệu chuyên ngành Ngoại vụ phục vụ công tác chỉ đạo, điều hành đơn vị\" của SNV thành phố Đà Nẵng.", trangThai: "Đã phát hành" },
    { nguoi: "Đậu Việt Đức", doiTuong: "Nguyễn Như Trung", ngay: "21/08/2026", title: "Báo cáo tình hình triển khai nhiệm vụ CĐS tuần 4 tháng 8", trangThai: "Đã phát hành" },
    { nguoi: "Nguyễn Tiến Nam", doiTuong: "Nguyễn Như Trung", ngay: "21/08/2026", title: "Công văn gửi Văn phòng Bộ trưởng về các câu hỏi về AI để trao đổi với Bộ Ngoại giao Singapore.", trangThai: "Đã phát hành" },
    { nguoi: "Nguyễn Thị Mỹ Nguyệt", doiTuong: "Nguyễn Như Trung", ngay: "21/08/2026", title: "Phúc công văn 2978_QTTV", trangThai: "Đã phát hành" }
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

  let filteredData = dummyData.filter(row => row.trangThai === "Đã phát hành");

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
  } else {
    // Basic search is only applied if advanced search is NOT active, or you can apply both. Let's apply both for safety.
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
          <h1 className="text-[22px] font-normal text-gray-800">Danh sách Văn bản dự thảo đã phát hành</h1>
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

        <div className="flex justify-end items-center">
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
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[50%]">Về việc</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[10%]">Trạng thái</th>
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
                      className="text-[#005fb8] hover:underline cursor-pointer font-medium"
                      onClick={() => setShowDetailModal(true)}
                    >
                      {row.title}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">
                    <span className="inline-block px-3 py-1 bg-[#198754] text-white text-[11px] font-bold rounded-full">Đã phát hành</span>
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
                    onChange={e => setAdvSearch({ ...advSearch, noiDung: e.target.value })}
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
                      setAdvSearch({ ...advSearch, phongBan: e.target.value });
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
                              setAdvSearch({ ...advSearch, phongBan: pb });
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
                    onChange={e => setAdvSearch({ ...advSearch, ngayTrinhFrom: e.target.value })}
                    className="w-[130px] border border-gray-300 rounded px-2 py-1.5 focus:border-[#005fb8] focus:outline-none"
                  />
                  <input
                    type="date"
                    value={advSearch.ngayTrinhTo}
                    onChange={e => setAdvSearch({ ...advSearch, ngayTrinhTo: e.target.value })}
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

      {/* --- DOCUMENT DETAIL MODAL --- */}
      <VanBanDuThaoDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

    </div>
  );
}
