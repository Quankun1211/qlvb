"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search, RefreshCcw, ChevronDown, Paperclip,
  X, Info, FileText
} from "lucide-react";
import { AttachmentModal, WordDetailModal } from "./SharedModals";
import Pagination from "./Pagination";
import DocumentDetailModal from "@/components/shared/DocumentDetailModal";

export default function VanBanDenCuaToi() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [activeDateFilter, setActiveDateFilter] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  // Dropdown visibility states
  const [showTiepNhanDropdown, setShowTiepNhanDropdown] = useState(false);
  const [showCongViecDropdown, setShowCongViecDropdown] = useState(false);
  const [showThongBaoDropdown, setShowThongBaoDropdown] = useState(false);
  const [showTrangThaiDropdown, setShowTrangThaiDropdown] = useState(false);

  // Filter Values
  const [loaiTiepNhan, setLoaiTiepNhan] = useState<string[]>([]);
  const [loaiCongViec, setLoaiCongViec] = useState<string[]>(["Cần phản hồi", "Không cần phản hồi"]);
  const [loaiThongBao, setLoaiThongBao] = useState<string[]>(["Quá hạn", "Sắp hết hạn"]);
  const [trangThai, setTrangThai] = useState<string[]>(["Chưa xử lý", "Đang xử lý", "Hoàn thành", "Tạm dừng", "Đã hủy"]);
  const [selectedYear, setSelectedYear] = useState("2026");

  const toggleArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setter(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  };

  const renderModal = (content: React.ReactNode) => {
    if (!mounted) return null;
    return createPortal(content, document.body);
  };

  const handleRefresh = () => {
    setActiveDateFilter("");
    setSearchKeyword("");
    setLoaiTiepNhan([]);
    setLoaiCongViec(["Cần phản hồi", "Không cần phản hồi"]);
    setLoaiThongBao(["Quá hạn", "Sắp hết hạn"]);
    setTrangThai(["Chưa xử lý", "Đang xử lý", "Hoàn thành", "Tạm dừng", "Đã hủy"]);
    setSelectedYear("2026");
    setCurrentPage(1);
  };

  const dummyData = [
    {
      id: 1, stt: 1, soDen: 4066, soKyHieu: "2918/VP-TĐKT", tenCongViec: "V/v góp ý Bộ chỉ tiêu thi đua",
      hanXL: "", ngayGiao: "21/08/2026", nguoiGiao: "Phan Văn Nhân", cbdvCT: "Mai Thùy Giang",
      cbdvPH: ["Nguyễn Thị Thu Hằng", "Bùi Hữu Việt", "Nguyễn Vũ Tuyên", "Chu Phúc Hà", "Lê Nhật Minh", "Lưu Anh Tuấn", "Phan Văn Nhân", "Lê Đức Kiên", "Lê Quang Tiến"], trangThai: "Chưa xử lý",
    },
    {
      id: 2, stt: 2, soDen: 592, soKyHieu: "4444/QĐ-BQP",
      tenCongViec: "Về việc công bố thủ tục hành chính bị bãi bỏ trong lĩnh vực cơ yếu thuộc phạm vi chức năng quản lý của Bộ Quốc phòng",
      hanXL: "", ngayGiao: "19/08/2026", nguoiGiao: "Phan Văn Nhân", cbdvCT: "Lưu Anh Tuấn",
      cbdvPH: ["Nguyễn Thị Thu Hằng", "Bùi Hữu Việt"], trangThai: "Hoàn thành",
    }
  ];

  let filteredData = dummyData.filter(row => trangThai.includes(row.trangThai));

    const removeAccents = (str: string | undefined | null) => {
    if (!str) return "";
    return str.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };
  if (searchKeyword) {
    const kw = removeAccents(searchKeyword);
    filteredData = filteredData.filter(row => 
      removeAccents(row.soKyHieu).includes(kw) ||
      removeAccents(row.tenCongViec).includes(kw)
    );
  }

  if (activeDateFilter === "today") {
    filteredData = filteredData.filter(row => row.ngayGiao === "24/08/2026");
  } else if (activeDateFilter === "yesterday") {
    filteredData = filteredData.filter(row => row.ngayGiao === "23/08/2026");
  } else if (activeDateFilter === "week") {
    filteredData = filteredData.filter(row => row.ngayGiao === "24/08/2026" || row.ngayGiao === "23/08/2026" || row.ngayGiao === "21/08/2026" || row.ngayGiao === "19/08/2026");
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  useEffect(() => {
    const max = Math.max(1, Math.ceil(filteredData.length / pageSize));
    if (currentPage > max) setCurrentPage(max);
  }, [filteredData.length, pageSize, currentPage]);
  
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const renderDropdown = (label: string, show: boolean, setShow: any, options: string[], selected: string[], setter: any) => (
    <div className="relative">
      <button onClick={() => setShow(!show)} className="bg-[#0078d4] hover:bg-[#005fb8] text-white px-3 py-1.5 rounded flex items-center text-[13px] transition-colors whitespace-nowrap">
        {label} <ChevronDown className="w-3.5 h-3.5 ml-1" />
      </button>
      {show && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShow(false)}></div>
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-20 py-1 text-[13px] text-gray-900">
            {options.map(opt => (
              <label key={opt} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggleArrayItem(setter, opt)} className="mr-2 rounded border-gray-300 text-[#0078d4] focus:ring-[#0078d4]" />
                <span className="font-medium">{opt}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="w-full min-h-full bg-white shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-[22px] font-normal text-gray-800">Toàn bộ văn bản được giao</h1>
          <div className="flex items-center text-[13px] text-[#005fb8]">
            <button onClick={() => setActiveDateFilter(activeDateFilter === "today" ? "" : "today")} className={`hover:underline ${activeDateFilter === 'today' ? 'font-bold' : ''}`}>Hôm nay</button>
            <span className="mx-1.5 text-gray-400">-</span>
            <button onClick={() => setActiveDateFilter(activeDateFilter === "yesterday" ? "" : "yesterday")} className={`hover:underline ${activeDateFilter === 'yesterday' ? 'font-bold' : ''}`}>Hôm qua</button>
            <span className="mx-1.5 text-gray-400">-</span>
            <button onClick={() => setActiveDateFilter(activeDateFilter === "week" ? "" : "week")} className={`hover:underline ${activeDateFilter === 'week' ? 'font-bold' : ''}`}>Tuần này</button>
            <span className="mx-1.5 text-gray-400">-</span>
            <button onClick={() => setShowSearchModal(true)} className="hover:underline">Tìm kiếm nâng cao</button>
            <button onClick={handleRefresh} className="ml-3 text-[#005fb8] hover:bg-blue-50 p-1.5 rounded-full transition-colors">
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <input type="text" placeholder="Nhập số đến, số ký hiệu, trích yếu..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="w-[200px] border border-gray-300 rounded px-3 py-1.5 text-[13px] text-gray-900 placeholder:text-gray-700 focus:outline-none focus:border-[#005fb8]" />
          {renderDropdown("Chọn loại tiếp nhận", showTiepNhanDropdown, setShowTiepNhanDropdown, ["Cá nhân chủ trì"], loaiTiepNhan, setLoaiTiepNhan)}
          {renderDropdown("Chọn loại công việc", showCongViecDropdown, setShowCongViecDropdown, ["Cần phản hồi", "Không cần phản hồi"], loaiCongViec, setLoaiCongViec)}
          {renderDropdown("Chọn loại thông báo", showThongBaoDropdown, setShowThongBaoDropdown, ["Quá hạn", "Sắp hết hạn"], loaiThongBao, setLoaiThongBao)}
          {renderDropdown("Chọn trạng thái", showTrangThaiDropdown, setShowTrangThaiDropdown, ["Chưa xử lý", "Đang xử lý", "Hoàn thành", "Tạm dừng", "Đã hủy"], trangThai, setTrangThai)}
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
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-12">STT</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-16">Số đến</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-28">Số ký hiệu</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center min-w-[300px]">Tên công việc</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-24">Hạn XL</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-24">Ngày giao</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-28">Người giao</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-32">CB/ĐV CT</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-32">CB/ĐV PH</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-24">Trạng thái</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-10"><Paperclip className="w-4 h-4 mx-auto text-gray-900" /></th>
              <th className="p-2 font-semibold text-center w-10"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map(row => (
                <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50/50">
                  <td className="p-2 border-r border-gray-200 text-center align-top pt-3 text-gray-900">{row.stt}</td>
                  <td className="p-2 border-r border-gray-200 text-center align-top pt-3 text-gray-900">{row.soDen}</td>
                  <td className="p-2 border-r border-gray-200 align-top pt-3 text-center">
                    <a href="#" className="text-[#005fb8] hover:underline break-words">{row.soKyHieu}</a>
                  </td>
                  <td className="p-2 border-r border-gray-200 align-top pt-3">
                    <div className="flex items-start">
                      <Info className="w-4 h-4 text-[#005fb8] mt-0.5 mr-1.5 shrink-0" fill="#e0f2fe" />
                      <span 
                        className="text-[#005fb8] hover:underline cursor-pointer font-medium leading-relaxed"
                        onClick={() => setShowDetailModal(true)}
                      >
                        {row.tenCongViec}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 border-r border-gray-200 text-center align-top pt-3 text-gray-900">{row.hanXL}</td>
                  <td className="p-2 border-r border-gray-200 text-center align-top pt-3 text-gray-900">{row.ngayGiao}</td>
                  <td className="p-2 border-r border-gray-200 align-top pt-3 text-gray-900">{row.nguoiGiao}</td>
                  <td className="p-2 border-r border-gray-200 align-top pt-3 text-gray-900">{row.cbdvCT}</td>
                  <td className="p-2 border-r border-gray-200 align-top pt-3 text-gray-900">
                    <div className="flex flex-col items-start">
                      {row.cbdvPH.slice(0, 2).map((p, i) => <span key={i}>{p}</span>)}
                      {row.cbdvPH.length > 2 && (
                        <div className="relative group mt-1">
                          <span className="text-[#005fb8] cursor-pointer group-hover:underline">Xem thêm</span>
                          <div className="hidden group-hover:flex absolute left-0 top-full pt-1 z-50 w-0">
                            <div className="bg-white border border-gray-300 shadow-xl p-2.5 rounded flex flex-col gap-1 text-[13px] text-gray-800 min-w-max">
                              {row.cbdvPH.map((p, i) => (
                                <span key={i} className="whitespace-nowrap">{p}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2 border-r border-gray-200 text-center align-top pt-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${row.trangThai === 'Hoàn thành' ? 'bg-[#198754] text-white' : 'bg-gray-500 text-white'
                      }`}>{row.trangThai}</span>
                  </td>
                  <td className="p-2 border-r border-gray-200 text-center align-top pt-3">
                    <button onClick={() => setShowAttachModal(true)} className="text-gray-600 hover:text-black">
                      <FileText className="w-4 h-4 mx-auto" />
                    </button>
                  </td>
                  <td className="p-2 text-center align-top pt-3">
                    <input type="checkbox" className="rounded border-gray-300 focus:ring-[#005fb8]" />
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={12} className="p-4 text-center text-gray-900 bg-gray-50">Không có dữ liệu</td></tr>
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

      {showSearchModal && renderModal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={() => setShowSearchModal(false)}>
          <div className="bg-white rounded shadow-xl w-[1000px] max-w-[95vw] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Tìm kiếm nâng cao</h2>
              <button onClick={() => setShowSearchModal(false)} className="text-gray-900 hover:text-gray-900"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-[160px_1fr] gap-y-5 gap-x-6 items-center text-[14px]">
                <div className="text-right font-semibold text-gray-900">Số ký hiệu</div>
                <div><input type="text" placeholder="Nhập số ký hiệu" className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900 placeholder:text-gray-700" /></div>

                <div className="text-right font-semibold text-gray-900 self-start mt-2">Tên công việc</div>
                <div><textarea placeholder="Nhập tên công việc" rows={4} className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none resize-none text-gray-900 placeholder:text-gray-700" /></div>

                <div className="text-right font-semibold text-gray-900">Hạn xử lý</div>
                <div className="flex gap-6">
                  <div className="flex-1 flex gap-3">
                    <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900" />
                    <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900" />
                  </div>
                  <div className="flex items-center gap-4 flex-1">
                    <span className="font-semibold text-gray-900 whitespace-nowrap ml-6">Ngày giao</span>
                    <div className="flex-1 flex gap-3">
                      <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900" />
                      <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
              <button className="flex items-center px-5 py-2 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[14px] font-semibold transition-colors"><Search className="w-4 h-4 mr-2" /> Tìm kiếm</button>
              <button onClick={() => setShowSearchModal(false)} className="flex items-center px-5 py-2 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[14px] font-semibold transition-colors"><X className="w-4 h-4 mr-2" /> Đóng</button>
            </div>
          </div>
        </div>
      )}

      <AttachmentModal 
        isOpen={showAttachModal} 
        onClose={() => setShowAttachModal(false)}
        onPreview={(file) => setPreviewFile(file)}
      />

      <WordDetailModal 
        fileName={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      <DocumentDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết công việc được giao"
      />
    </div>
  );
}
