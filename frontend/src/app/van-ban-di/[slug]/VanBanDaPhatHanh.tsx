"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, RefreshCcw, X, Paperclip, FileDown, Search as SearchIcon, ArrowDownToLine, FileText, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import Pagination from "../../van-ban-den/[slug]/Pagination";
import { AttachmentModal, PDFDetailModal, WordDetailModal } from "@/app/van-ban-den/[slug]/SharedModals";

const mockDonVi = ["Đơn vị đôn đốc", "Văn phòng Bộ", "Cục Cơ yếu-Công nghệ thông tin"];
const mockNguoiSoan = ["Đậu Việt Đức", "Đỗ Văn Điển", "Lưu Anh Tuấn", "Lê Mai Phượng", "Kiều Việt Hùng"];
const mockDonViNoiBo = ["Cục Lãnh sự", "Vụ Luật pháp và Điều ước quốc tế", "Văn phòng Bộ", "Vụ Tổ chức Cán bộ"];
const mockDonViLienThong = ["UBND TP Hà Nội", "Bộ Thông tin và Truyền thông", "Bộ Công an", "Bảo hiểm Xã hội VN"];

export default function VanBanDaPhatHanh() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [activeDateFilter, setActiveDateFilter] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [searchKeyword, setSearchKeyword] = useState("");
  
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [activeTabNhan, setActiveTabNhan] = useState('noi_bo');

  // Advanced search form
  const [advSearch, setAdvSearch] = useState({
    soKyHieu: "",
    trichYeu: "",
    donViSoanThao: "",
    ngayBHFrom: "",
    ngayBHTo: "",
    nguoiSoanThao: "",
    donViNhanNoiBo: "",
    donViNhanLienThong: "",
    vuTCCBCapSo: false
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dummyData: any[] = [
    { soDi: 1569, soKH: "1569/CYTT-TC", ngayBH: "25/08/2026", trichYeu: "(GẤP) Xin ý kiến hồ sơ duyệt danh sách hưởng tiền CĐS", nguoiKy: "Hồ Sỹ An", noiNhan: "Vụ Tổ chức Cán bộ", hasFile: true },
    { soDi: 1570, soKH: "1570/CYTT-NC", ngayBH: "25/08/2026", trichYeu: "Phúc 3704/LPQT về cung cấp thông tin dự án Luật Định danh và xác thực điện tử", nguoiKy: "Nguyễn Như Trung", noiNhan: "Vụ Luật pháp và Điều ước quốc tế", hasFile: true },
    { soDi: 1568, soKH: "1568/CYTT-HT", ngayBH: "24/08/2026", trichYeu: "Phúc CV 297 TGDV Xin ý kiến dự thảo tờ trình của BTGDV", nguoiKy: "Nguyễn Đăng Lâm", noiNhan: "Cơ quan Đảng Ủy Bộ", hasFile: true },
    { soDi: 1567, soKH: "1567/CYTT-NC", ngayBH: "24/08/2026", trichYeu: "V/v Đăng ký cơ sở hạ tầng CNTT tại Trung tâm dữ liệu quốc gia cho CSDL quốc gia về cam kết quốc tế", nguoiKy: "Nguyễn Đăng Lâm", noiNhan: "Vụ Luật pháp và Điều ước quốc tế", hasFile: true },
    { soDi: 1563, soKH: "1563/CYTT-TC", ngayBH: "24/08/2026", trichYeu: "Xin cấp HCNG", nguoiKy: "Nguyễn Như Trung", noiNhan: "Cục Lãnh sự", hasFile: true },
    { soDi: 1565, soKH: "1565/CYTT-NC", ngayBH: "24/08/2026", trichYeu: "Phúc CV 3661 LPQT Góp ý TKCT của BCKTKT dự án LPQT 2026", nguoiKy: "Nguyễn Như Trung", noiNhan: "Vụ Luật pháp và Điều ước quốc tế", hasFile: true },
    { soDi: 1566, soKH: "1566/CYTT-", ngayBH: "24/08/2026", trichYeu: "Ý kiến chỉ đạo và kết luận của Lãnh đạo Bộ tại cuộc họp về CĐS ngày 22/8 - định kỳ lần thứ 10", nguoiKy: "Nguyễn Như Trung", noiNhan: "Văn phòng Bộ, Cơ quan Đảng Ủy Bộ, Xem thêm", hasFile: true },
    { soDi: 1560, soKH: "1560/CYTT-NC", ngayBH: "22/08/2026", trichYeu: "Về cung cấp thông tin phục vụ CV số 4431/TGV ngày 21/8/2026 của Tổ Giúp việc", nguoiKy: "Nguyễn Như Trung", noiNhan: "Vụ Ngoại giao kinh tế", hasFile: true },
    { soDi: 1561, soKH: "1561/CYTT-NC", ngayBH: "22/08/2026", trichYeu: "Công văn gửi Cục NVVH đ/n cho ý kiến đối với Báo cáo đề xuất chủ trương đầu tư Dự án \"Nâng cấp phần mềm Cơ sở dữ liệu chuyên ngành Ngoại vụ phục vụ công tác chỉ đạo, điều hành đơn vị\" của SNV thành phố Đà Nẵng.", nguoiKy: "Nguyễn Như Trung", noiNhan: "Cục Ngoại vụ và Ngoại giao văn hóa", hasFile: true },
    { soDi: 1562, soKH: "1562/CYTT-NC", ngayBH: "22/08/2026", trichYeu: "Phúc 2871/VP-THBC về việc xin ý kiến dự thảo Quy chế sử dụng AI trong BNG", nguoiKy: "Nguyễn Như Trung", noiNhan: "Văn phòng Bộ", hasFile: true }
  ];

  let filteredData = dummyData;

    const removeAccents = (str: string | undefined | null) => {
    if (!str) return "";
    return str.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };
  if (searchKeyword) {
    const kw = removeAccents(searchKeyword);
    filteredData = filteredData.filter(row => 
      removeAccents(row.trichYeu).includes(kw) ||
      removeAccents(row.soKH).includes(kw)
    );
  }

  if (activeDateFilter === "today") {
    filteredData = filteredData.filter(row => row.ngayBH === "25/08/2026");
  } else if (activeDateFilter === "yesterday") {
    filteredData = filteredData.filter(row => row.ngayBH === "24/08/2026");
  } else if (activeDateFilter === "this_week") {
    filteredData = filteredData.filter(row => row.ngayBH === "25/08/2026" || row.ngayBH === "24/08/2026" || row.ngayBH === "22/08/2026");
  }

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  const openDetailModal = (row: any) => {
    setSelectedDoc(row);
    setShowDetailModal(true);
  };

  return (
    <div className="w-full min-h-full bg-white shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-[22px] font-normal text-gray-800">Danh sách Văn bản đã phát hành</h1>
        
        <div className="flex flex-col items-end gap-2">
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

          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Nhập vào từ khóa tìm kiếm"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              className="w-[250px] border border-gray-300 rounded px-3 py-1.5 text-[13px] focus:border-[#005fb8] focus:outline-none placeholder:text-gray-500 text-gray-900"
            />
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

      <div className="p-4 overflow-x-auto">
        <table className="w-full border-collapse text-[13px] mb-4">
          <thead>
            <tr>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[5%]">Số đi</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[15%]">Số ký hiệu</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[10%]">Ngày BH</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[40%]">Trích yếu</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[12%]">Người ký</th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[15%]">Nơi nhận văn bản</th>
              <th className="py-2.5 px-2 border border-gray-300 text-center bg-white w-[3%]">
                <Paperclip className="w-4 h-4 mx-auto text-gray-600" />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors text-gray-900">
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.soDi}</td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center text-gray-900 font-medium">{row.soKH}</td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.ngayBH}</td>
                  <td className="py-2.5 px-3 border border-gray-300">
                    <span 
                      className="text-[#005fb8] hover:underline cursor-pointer font-medium"
                      onClick={() => openDetailModal(row)}
                    >
                      {row.trichYeu}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.nguoiKy}</td>
                  <td className="py-2.5 px-3 border border-gray-300 text-center">{row.noiNhan}</td>
                  <td className="py-2.5 px-2 border border-gray-300 text-center">
                    {row.hasFile && (
                      <button 
                        onClick={() => setShowAttachmentModal(true)}
                        className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-[#005fb8] transition-colors"
                      >
                        <Paperclip className="w-4 h-4 mx-auto" />
                      </button>
                    )}
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
                <div className="w-[180px] font-bold shrink-0 text-right">Số ký hiệu</div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Nhập số ký hiệu" 
                    value={advSearch.soKyHieu}
                    onChange={e => setAdvSearch({...advSearch, soKyHieu: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className="w-[180px] font-bold shrink-0 mt-1.5 text-right">Trích yếu</div>
                <div className="flex-1">
                  <textarea 
                    rows={2} 
                    placeholder="Nhập trích yếu" 
                    value={advSearch.trichYeu}
                    onChange={e => setAdvSearch({...advSearch, trichYeu: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none resize-none placeholder:text-gray-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-[180px] font-bold shrink-0 text-right">Chọn ĐV/PB soạn thảo</div>
                <div className="flex gap-4 w-[280px]">
                  <select 
                    value={advSearch.donViSoanThao}
                    onChange={e => setAdvSearch({...advSearch, donViSoanThao: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white"
                  >
                    <option value="">Chọn đơn vị/phòng ban...</option>
                    {mockDonVi.map((dv, idx) => (
                      <option key={idx} value={dv}>{dv}</option>
                    ))}
                  </select>
                </div>
                
                <div className="font-bold shrink-0 ml-4">Ngày BH</div>
                <div className="flex gap-2">
                  <input 
                    type="date" 
                    value={advSearch.ngayBHFrom}
                    onChange={e => setAdvSearch({...advSearch, ngayBHFrom: e.target.value})}
                    className="w-[130px] border border-gray-300 rounded px-2 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900"
                  />
                  <input 
                    type="date" 
                    value={advSearch.ngayBHTo}
                    onChange={e => setAdvSearch({...advSearch, ngayBHTo: e.target.value})}
                    className="w-[130px] border border-gray-300 rounded px-2 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-[180px] font-bold shrink-0 text-right">Chọn người soạn thảo</div>
                <div className="flex-1">
                  <select 
                    value={advSearch.nguoiSoanThao}
                    onChange={e => setAdvSearch({...advSearch, nguoiSoanThao: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white"
                  >
                    <option value="">Nhập người soạn thảo...</option>
                    {mockNguoiSoan.map((ns, idx) => (
                      <option key={idx} value={ns}>{ns}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-[180px] font-bold shrink-0 text-right">Chọn đơn vị nhận liên thông</div>
                <div className="w-[280px]">
                  <select 
                    value={advSearch.donViNhanLienThong}
                    onChange={e => setAdvSearch({...advSearch, donViNhanLienThong: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white"
                  >
                    <option value="">Nhập đơn vị nhận liên thông...</option>
                    {mockDonViLienThong.map((dv, idx) => (
                      <option key={idx} value={dv}>{dv}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-[180px] font-bold shrink-0 text-right">Vụ TCCB cấp số</div>
                <div className="w-[280px]">
                  <input 
                    type="checkbox" 
                    checked={advSearch.vuTCCBCapSo}
                    onChange={e => setAdvSearch({...advSearch, vuTCCBCapSo: e.target.checked})}
                    className="rounded text-[#005fb8] focus:ring-[#005fb8]"
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

      {/* CHI TIẾT VĂN BẢN ĐI MODAL */}
      {showDetailModal && renderModal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white shadow-2xl w-[1100px] max-w-[95vw] max-h-[95vh] flex flex-col rounded-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 shrink-0">
              <h2 className="text-[18px] font-medium text-gray-800">Chi tiết văn bản đi</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-800 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar text-[13px] text-gray-900 bg-white">
              
              <fieldset className="border border-gray-300 rounded-sm mb-6 relative pt-4 pb-0 px-0">
                <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">Thông tin văn bản đi</legend>
                <div className="w-full">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2.5 px-4 font-bold text-gray-800 w-[15%]">Số đi</td>
                        <td className="py-2.5 px-4 w-[35%]">{selectedDoc?.soDi || 0}</td>
                        <td className="py-2.5 px-4 font-bold text-gray-800 w-[15%] border-l border-gray-100">Số ký hiệu</td>
                        <td className="py-2.5 px-4 w-[35%]">{selectedDoc?.soKH || ""}</td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <td className="py-2.5 px-4 font-bold text-gray-800">Loại văn bản</td>
                        <td className="py-2.5 px-4">Công văn</td>
                        <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">Ngày ban hành</td>
                        <td className="py-2.5 px-4">{selectedDoc?.ngayBH}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2.5 px-4 font-bold text-gray-800">Độ mật</td>
                        <td className="py-2.5 px-4">Bình thường</td>
                        <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">Độ khẩn</td>
                        <td className="py-2.5 px-4">Hỏa tốc</td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <td className="py-2.5 px-4 font-bold text-gray-800">Trích yếu</td>
                        <td className="py-2.5 px-4" colSpan={3}>{selectedDoc?.trichYeu}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2.5 px-4 font-bold text-gray-800">Lãnh đạo được báo cáo</td>
                        <td className="py-2.5 px-4" colSpan={3}></td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <td className="py-2.5 px-4 font-bold text-gray-800">Người ký</td>
                        <td className="py-2.5 px-4">{selectedDoc?.nguoiKy}</td>
                        <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">Chức vụ</td>
                        <td className="py-2.5 px-4">Phó Cục trưởng</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2.5 px-4 font-bold text-gray-800">Người soạn</td>
                        <td className="py-2.5 px-4">{selectedDoc?.canBoSoanThao || "Đậu Việt Đức"}</td>
                        <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">Trạng thái</td>
                        <td className="py-2.5 px-4">
                          <span className="inline-block px-2 py-0.5 bg-[#198754] text-white text-[11px] font-bold rounded-full">Chờ cấp số</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <td className="py-2.5 px-4 font-bold text-gray-800">Sổ công văn</td>
                        <td className="py-2.5 px-4">Sổ công điện đi</td>
                        <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">PB/Đơn vị soạn</td>
                        <td className="py-2.5 px-4">Cục Cơ yếu-Công nghệ thông tin</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2.5 px-4 font-bold text-gray-800">Số trang</td>
                        <td className="py-2.5 px-4" colSpan={3}>0</td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <td className="py-3 px-4 font-bold text-gray-800 align-top">
                          Toàn văn <ArrowDownToLine className="w-4 h-4 inline-block ml-1 cursor-pointer hover:text-[#005fb8]" />
                        </td>
                        <td className="py-3 px-4" colSpan={3}>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <a href="#" className="text-[#005fb8] hover:underline text-[13px]">1_To_Trinh-9a08f43e048d43a3bec71e3a1a30fa9a.pdf</a>
                              <SearchIcon className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0" onClick={() => setPreviewFile("1_To_Trinh-9a08f43e048d43a3bec71e3a1a30fa9a.pdf")} />
                              <FileDown className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0" />
                            </div>
                            <div className="flex items-center gap-2">
                              <a href="#" className="text-[#005fb8] hover:underline text-[13px]">6634_cytt.signed.signed-967e08c86db64544bbb54c5568167...</a>
                              <SearchIcon className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0" onClick={() => setPreviewFile("6634_cytt.signed.signed-967e08c86db64544bbb54c5568167.pdf")} />
                              <FileDown className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0" />
                            </div>
                            <div className="flex items-center gap-2">
                              <a href="#" className="text-[#005fb8] hover:underline text-[13px]">2_Du_thao_Luat-6cd5539aa48e48879ab06ae831090aca.pdf</a>
                              <SearchIcon className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0" onClick={() => setPreviewFile("2_Du_thao_Luat-6cd5539aa48e48879ab06ae831090aca.pdf")} />
                              <FileDown className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0" />
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-gray-800">Xuất phát từ dự thảo</td>
                        <td className="py-2.5 px-4" colSpan={3}>
                          <a href="#" className="text-[#005fb8] hover:underline">Phúc 3704/LPQT về cung cấp thông tin dự án Luật Định danh và xác thực điện tử</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </fieldset>

              <fieldset className="border border-gray-300 rounded-sm mb-6 relative pt-4 pb-0 px-0">
                <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">Ý kiến</legend>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 px-4 text-center font-bold text-gray-800 w-[20%] border-r border-gray-200">Thời gian</th>
                      <th className="py-2 px-4 text-center font-bold text-gray-800 w-[20%] border-r border-gray-200">Cán bộ</th>
                      <th className="py-2 px-4 text-center font-bold text-gray-800 w-[50%] border-r border-gray-200">Nội dung</th>
                      <th className="py-2 px-4 text-center font-bold text-gray-800 w-[10%]"><Paperclip className="w-4 h-4 mx-auto text-gray-600" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500 bg-gray-50/50 border-b border-gray-200">Không có dữ liệu</td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50/50">
                  <div className="flex items-center gap-1 opacity-50 cursor-not-allowed">
                    <button className="p-1 border border-gray-300 bg-white rounded text-gray-500" disabled><ChevronsLeft className="w-3.5 h-3.5" /></button>
                    <button className="p-1 border border-gray-300 bg-white rounded text-gray-500" disabled><ChevronLeft className="w-3.5 h-3.5" /></button>
                    <button className="px-2.5 py-0.5 border border-gray-300 bg-[#e9ecef] rounded text-gray-700 text-[12px]" disabled>1</button>
                    <button className="p-1 border border-gray-300 bg-white rounded text-gray-500" disabled><ChevronRight className="w-3.5 h-3.5" /></button>
                    <button className="p-1 border border-gray-300 bg-white rounded text-gray-500" disabled><ChevronsRight className="w-3.5 h-3.5" /></button>
                    <select className="ml-2 border border-gray-300 rounded px-1 py-1 text-[12px] focus:outline-none bg-white" disabled>
                      <option>10</option>
                    </select>
                  </div>
                  <div className="text-gray-500 text-[12px]">1-0 / 0</div>
                </div>
              </fieldset>

              <fieldset className="border border-gray-300 rounded-sm mb-6 relative pt-4 pb-0 px-0 mt-6">
                <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">Thông tin nơi nhận</legend>
                
                <div className="flex border-b border-gray-200 mb-4 px-4 mt-2">
                  <button 
                    onClick={() => setActiveTabNhan('noi_bo')}
                    className={`px-4 py-2 text-[14px] flex items-center ${activeTabNhan === 'noi_bo' ? 'border border-gray-300 border-b-white text-gray-800 -mb-[1px] bg-white rounded-t z-10' : 'text-[#005fb8] hover:underline'}`}
                  >
                    <span className={`${activeTabNhan === 'noi_bo' ? 'font-bold text-gray-600' : 'text-gray-500'} mr-1`}>1.</span> Nội bộ
                  </button>
                  <button 
                    onClick={() => setActiveTabNhan('lien_thong')}
                    className={`px-4 py-2 text-[14px] flex items-center ${activeTabNhan === 'lien_thong' ? 'border border-gray-300 border-b-white text-gray-800 -mb-[1px] bg-white rounded-t z-10' : 'text-[#005fb8] hover:underline'}`}
                  >
                    <span className={`${activeTabNhan === 'lien_thong' ? 'font-bold text-gray-600' : 'text-gray-500'} mr-1`}>2.</span> Liên thông
                  </button>
                  <button 
                    onClick={() => setActiveTabNhan('ngoai_lien_thong')}
                    className={`px-4 py-2 text-[14px] flex items-center ${activeTabNhan === 'ngoai_lien_thong' ? 'border border-gray-300 border-b-white text-gray-800 -mb-[1px] bg-white rounded-t z-10' : 'text-[#005fb8] hover:underline'}`}
                  >
                    <span className={`${activeTabNhan === 'ngoai_lien_thong' ? 'font-bold text-gray-600' : 'text-gray-500'} mr-1`}>3.</span> Ngoài liên thông
                  </button>
                </div>

                <div className="px-4 pb-4">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <th className="py-2.5 px-3 text-center font-bold text-gray-800 border-r border-gray-200">Người gửi</th>
                        <th className="py-2.5 px-3 text-center font-bold text-gray-800 border-r border-gray-200">Đơn vị gửi</th>
                        <th className="py-2.5 px-3 text-center font-bold text-gray-800 border-r border-gray-200">Thời gian gửi</th>
                        <th className="py-2.5 px-3 text-center font-bold text-gray-800 border-r border-gray-200">Nơi nhận</th>
                        <th className="py-2.5 px-3 text-center font-bold text-gray-800 border-r border-gray-200">Thời gian nhận</th>
                        <th className="py-2.5 px-3 text-center font-bold text-gray-800 border-r border-gray-200">Hình thức</th>
                        <th className="py-2.5 px-3 text-center font-bold text-gray-800">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTabNhan === 'noi_bo' && (
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">Văn thư CY-CNTT</td>
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">Cục Cơ yếu-Công nghệ thông tin</td>
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">25/08/2026<br/>12:44:41</td>
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">Vụ Tổ chức Cán bộ</td>
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">25/08/2026<br/>12:44:41</td>
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">Nội bộ</td>
                          <td className="py-2.5 px-3 text-gray-900">Đang yêu cầu cập nhập</td>
                        </tr>
                      )}
                      {activeTabNhan === 'lien_thong' && (
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">Văn thư Bộ</td>
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">Văn phòng Bộ</td>
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">24/08/2026<br/>09:15:00</td>
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">UBND TP Hà Nội</td>
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">24/08/2026<br/>09:20:10</td>
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">Liên thông</td>
                          <td className="py-2.5 px-3 text-gray-900">Đã tiếp nhận</td>
                        </tr>
                      )}
                      {activeTabNhan === 'ngoai_lien_thong' && (
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">Trần Thị B</td>
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">Cục Lãnh sự</td>
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">23/08/2026<br/>14:30:00</td>
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">Tập đoàn Viettel</td>
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">-</td>
                          <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">Email/Bưu điện</td>
                          <td className="py-2.5 px-3 text-gray-900">Đã gửi</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50/50 border-t border-gray-200">
                  <div className="flex items-center gap-1">
                    <button className="p-1 border border-gray-300 bg-white rounded text-gray-500 hover:bg-gray-100"><ChevronsLeft className="w-3.5 h-3.5" /></button>
                    <button className="p-1 border border-gray-300 bg-white rounded text-gray-500 hover:bg-gray-100"><ChevronLeft className="w-3.5 h-3.5" /></button>
                    <button className="px-2.5 py-0.5 border border-gray-300 bg-[#e9ecef] rounded text-gray-700 text-[12px]">1</button>
                    <button className="p-1 border border-gray-300 bg-white rounded text-gray-500 hover:bg-gray-100"><ChevronRight className="w-3.5 h-3.5" /></button>
                    <button className="p-1 border border-gray-300 bg-white rounded text-gray-500 hover:bg-gray-100"><ChevronsRight className="w-3.5 h-3.5" /></button>
                    <select className="ml-2 border border-gray-300 rounded px-1 py-1 text-[12px] focus:outline-none bg-white">
                      <option>10</option>
                    </select>
                  </div>
                  <div className="text-gray-500 text-[12px]">1-1 / 1</div>
                </div>
              </fieldset>

              <fieldset className="border border-gray-300 rounded-sm mb-6 relative pt-4 pb-0 px-0">
                <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">Văn bản liên quan</legend>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 px-4 text-center font-bold text-gray-800 w-[20%] border-r border-gray-200">Số ký hiệu</th>
                      <th className="py-2 px-4 text-center font-bold text-gray-800 w-[50%] border-r border-gray-200">Trích yếu</th>
                      <th className="py-2 px-4 text-center font-bold text-gray-800 w-[30%]">Cơ quan ban hành</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-500 bg-gray-50/50 border-b border-gray-200">Không có dữ liệu</td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50/50">
                  <div className="flex items-center gap-1 opacity-50 cursor-not-allowed">
                    <button className="p-1 border border-gray-300 bg-white rounded text-gray-500" disabled><ChevronsLeft className="w-3.5 h-3.5" /></button>
                    <button className="p-1 border border-gray-300 bg-white rounded text-gray-500" disabled><ChevronLeft className="w-3.5 h-3.5" /></button>
                    <button className="px-2.5 py-0.5 border border-gray-300 bg-[#e9ecef] rounded text-gray-700 text-[12px]" disabled>1</button>
                    <button className="p-1 border border-gray-300 bg-white rounded text-gray-500" disabled><ChevronRight className="w-3.5 h-3.5" /></button>
                    <button className="p-1 border border-gray-300 bg-white rounded text-gray-500" disabled><ChevronsRight className="w-3.5 h-3.5" /></button>
                    <select className="ml-2 border border-gray-300 rounded px-1 py-1 text-[12px] focus:outline-none bg-white" disabled>
                      <option>10</option>
                    </select>
                  </div>
                  <div className="text-gray-500 text-[12px]">1-0 / 0</div>
                </div>
              </fieldset>

            </div>

            <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end shrink-0">
              <button onClick={() => setShowDetailModal(false)} className="flex items-center px-5 py-1.5 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-bold transition-colors">
                <X className="w-4 h-4 mr-1.5" /> Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* RE-USED ATTACHMENT MODAL AND FILE PREVIEWS */}
      <AttachmentModal 
        isOpen={showAttachmentModal} 
        onClose={() => setShowAttachmentModal(false)} 
        onPreview={(file) => setPreviewFile(file)}
      />

      {previewFile && previewFile.toLowerCase().endsWith('.pdf') && (
        <PDFDetailModal fileName={previewFile} onClose={() => setPreviewFile(null)} />
      )}
      {previewFile && (previewFile.toLowerCase().endsWith('.doc') || previewFile.toLowerCase().endsWith('.docx')) && (
        <WordDetailModal fileName={previewFile} onClose={() => setPreviewFile(null)} />
      )}

    </div>
  );
}
