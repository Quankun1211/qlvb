"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams } from "next/navigation";
import {
  Search, RefreshCcw, ChevronDown, Paperclip,
  Download, X, DownloadCloud, Info, FileText, Send
} from "lucide-react";
import VanBanDenCuaToi from "./VanBanDenCuaToi";
import VanBanDaGiao from "./VanBanDaGiao";
import VanBanDenNoiBo from "./VanBanDenNoiBo";
import QuanLyNhomDonVi from "./QuanLyNhomDonVi";
import { AttachmentModal, WordDetailModal } from "./SharedModals";
import Pagination from "./Pagination";
import DocumentDetailModal from "@/components/shared/DocumentDetailModal";

// --- DUMMY DATA ---
const dummyData = [
  {
    id: 1,
    soDen: 4128,
    soKyHieu: "2964/VP-TKBT",
    trichYeu: "V/v Đôn đốc nhắc việc 24/8",
    isHoaToc: true,
    ngayDen: "24/08/2026",
    hanXuLy: null,
    coQuan: "Văn phòng Bộ",
    chuTri: "Cục Cơ yếu-Công nghệ thông tin",
    trangThai: "Đang xử lý",
  },
  {
    id: 2,
    soDen: 2531,
    soKyHieu: "6506/BKHCN-KHTC",
    trichYeu: "V/v góp ý dự thảo Quyết định của Thủ tướng Chính phủ phê duyệt Phương án chấm điểm các bộ, cơ quan trung ương và địa phương về kết quả giải ngân vốn lĩnh vực khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số",
    isHoaToc: false,
    ngayDen: "24/08/2026",
    hanXuLy: "27/08/2026",
    coQuan: "Bộ Khoa học và Công nghệ",
    chuTri: "Cục Quản trị tài vụ",
    trangThai: "Chưa xử lý",
  }
];

const mockAttachments = [
  "CV_Don_doc_nhac_viec_2408-baa95e06699b4d5087b04ee49e5a2dbc.docx",
  "cv_don_doc_nhac_viec_2408-baa95e06699b4d5087b04ee4_2408.signed.pdf",
  "VP-TKBT-20262964-a6c74a47a4a041d1a078a400bd7bdda1.pdf"
];

export default function VanBanDenPage() {
  const params = useParams();
  const slug = params.slug as string;

  if (slug === 'van-ban-den-cua-toi' || slug === 'van-ban-den-tra-lai') {
    return <VanBanDenCuaToi />;
  }
  if (slug === 'toan-bo-van-ban-da-giao' || slug === 'van-ban-da-giao') {
    return <VanBanDaGiao />;
  }
  if (slug === 'van-ban-den-noi-bo') {
    return <VanBanDenNoiBo />;
  }
  if (slug === 'quan-ly-nhom-don-vi-hay-dung' || slug === 'van-ban-den-nhom') {
    return <QuanLyNhomDonVi />;
  }

  // States for filters
  const [activeDateFilter, setActiveDateFilter] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["Chưa xử lý", "Đang xử lý", "Đã hoàn thành", "Đã tạm dừng"]);
  const [selectedYear, setSelectedYear] = useState("2026");

  const [showAttachModal, setShowAttachModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [showDocMenu, setShowDocMenu] = useState(false);
  const [zoom, setZoom] = useState(100);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const renderModal = (content: React.ReactNode) => {
    if (!mounted) return null;
    return createPortal(content, document.body);
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };



  const getPageTitle = () => {
    switch (slug) {
      case "toan-bo-van-ban-den-don-vi": return "Danh sách toàn bộ văn bản đến Đơn vị";
      case "van-ban-den-cua-toi": return "Danh sách văn bản đến của tôi";
      case "toan-bo-van-ban-da-giao": return "Danh sách văn bản đã giao";
      case "van-ban-den-noi-bo": return "Danh sách văn bản đến nội bộ";
      default: return `Danh sách văn bản đến`;
    }
  };

  let filteredData = dummyData.filter(row => selectedStatuses.includes(row.trangThai));

  if (activeDateFilter === "today") {
    filteredData = filteredData.filter(row => row.ngayDen === "24/08/2026");
  } else if (activeDateFilter === "yesterday") {
    filteredData = filteredData.filter(row => row.ngayDen === "23/08/2026");
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const handleRefresh = () => {
    setActiveDateFilter("");
    setSearchKeyword("");
    setSelectedStatuses(["Chưa xử lý", "Đang xử lý", "Đã hoàn thành", "Đã tạm dừng"]);
    setSelectedYear("2026");
    setCurrentPage(1);
  };

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
            {getPageTitle()}
          </h1>
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

        <div className="flex items-center justify-end gap-2">
          {/* Quick Search */}
          <div className="relative w-[280px]">
            <input
              type="text"
              placeholder="Nhập vào từ khóa tìm kiếm"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-[13px] text-gray-900 placeholder:text-gray-700 focus:outline-none focus:border-[#005fb8]"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="bg-[#0078d4] hover:bg-[#005fb8] text-white px-3 py-1.5 rounded flex items-center text-[13px] transition-colors"
            >
              Chọn trạng thái <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </button>

            {showStatusDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)}></div>
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-20 py-1 text-[13px] text-gray-900">
                  {["Chưa xử lý", "Đang xử lý", "Đã hoàn thành", "Đã tạm dừng"].map(status => (
                    <label key={status} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status)}
                        onChange={() => toggleStatus(status)}
                        className="mr-2 rounded border-gray-300 text-[#0078d4] focus:ring-[#0078d4]"
                      />
                      <span className="font-medium">{status}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Year Select */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1.5 text-[13px] text-gray-900 font-medium focus:outline-none focus:border-[#005fb8] min-w-[70px] bg-white"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-white border-b border-gray-300 text-gray-900">
              <th className="p-2 border-r border-gray-200 w-10 text-center">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-16">Số đến</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-32">Số ký hiệu</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center">Trích yếu</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-28">Ngày đến</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-32">Cơ quan ban hành</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-32">Chủ trì</th>
              <th className="p-2 border-r border-gray-200 font-semibold text-center w-28">Trạng thái</th>
              <th className="p-2 font-semibold text-center w-10">
                <Paperclip className="w-4 h-4 mx-auto text-gray-900" />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                  <td className="p-2 border-r border-gray-200 text-center align-top pt-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="p-2 border-r border-gray-200 text-center align-top pt-3 text-gray-600">
                    {row.soDen}
                  </td>
                  <td className="p-2 border-r border-gray-200 align-top pt-3">
                    <a href="#" className="text-[#005fb8] hover:underline block text-center break-words">
                      {row.soKyHieu}
                    </a>
                  </td>
                  <td className="p-2 border-r border-gray-200 align-top pt-3">
                    <div className="flex items-start">
                      <Info className="w-4 h-4 text-[#005fb8] mt-0.5 mr-1.5 shrink-0" fill="#e0f2fe" />
                      <div>
                        <span 
                          className="text-[#005fb8] font-medium leading-relaxed cursor-pointer hover:underline"
                          onClick={() => setShowDetailModal(true)}
                        >
                          {row.trichYeu}
                        </span>
                        {row.isHoaToc && (
                          <span className="inline-flex items-center ml-2 text-red-600 font-bold italic text-xs tracking-wider">
                            HỎA TỐC <Send className="w-3 h-3 ml-0.5" />
                          </span>
                        )}
                        {row.hanXuLy && (
                          <div className="text-red-500 text-xs italic mt-1">
                            Hạn xử lý: {row.hanXuLy}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 border-r border-gray-200 text-center align-top pt-3 text-gray-600">
                    {row.ngayDen}
                  </td>
                  <td className="p-2 border-r border-gray-200 align-top pt-3 text-gray-900">
                    {row.coQuan}
                  </td>
                  <td className="p-2 border-r border-gray-200 align-top pt-3 text-gray-900">
                    {row.chuTri}
                  </td>
                  <td className="p-2 border-r border-gray-200 text-center align-top pt-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${row.trangThai === 'Đang xử lý'
                        ? 'bg-[#0078d4] text-white'
                        : 'bg-white border border-gray-300 text-gray-600'
                      }`}>
                      {row.trangThai}
                    </span>
                  </td>
                  <td className="p-2 text-center align-top pt-3">
                    <button onClick={() => setShowAttachModal(true)} className="text-gray-600 hover:text-black transition-colors">
                      <FileText className="w-4 h-4 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-900 bg-gray-50">
                  Không có dữ liệu
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
              <div className="grid grid-cols-[160px_1fr] gap-y-5 gap-x-6 items-center text-[14px]">

                <div className="text-right font-semibold text-gray-900">Số ký hiệu</div>
                <div><input type="text" placeholder="Nhập số ký hiệu" className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900 placeholder:text-gray-700" /></div>

                <div className="text-right font-semibold text-gray-900">Số đến</div>
                <div><input type="number" defaultValue={0} className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none text-gray-900 placeholder:text-gray-700" /></div>

                <div className="text-right font-semibold text-gray-900 self-start mt-2">Trích yếu</div>
                <div><textarea placeholder="Nhập trích yếu" rows={4} className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none resize-none text-gray-900 placeholder:text-gray-700" /></div>

                {/* Split Row */}
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
                      <option value="3">Văn bản đến ngoài Bộ</option>
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

                <div className="text-right font-semibold text-gray-900">Bóc bì</div>
                <div><input type="checkbox" className="rounded w-4 h-4 border-gray-300 focus:ring-[#005fb8] text-[#005fb8]" /></div>
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

      {/* --- ATTACHMENT MODAL --- */}
      <AttachmentModal 
        isOpen={showAttachModal} 
        onClose={() => setShowAttachModal(false)}
        onPreview={(file) => setPreviewFile(file)}
        attachments={mockAttachments}
      />

      {/* --- DOCUMENT PREVIEW MODAL --- */}
      <WordDetailModal 
        fileName={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      {/* --- DOCUMENT DETAIL MODAL --- */}
      <DocumentDetailModal 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)}
        title={getPageTitle().replace("Danh sách ", "Chi tiết ")}
      />

    </div>
  );
}
