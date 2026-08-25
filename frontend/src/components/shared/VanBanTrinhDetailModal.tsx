"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search, Download, Plus, Menu, Minus, RotateCw, Maximize, Printer, MoreVertical, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { PDFDetailModal, WordDetailModal } from "@/app/van-ban-den/[slug]/SharedModals";

interface VanBanTrinhDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

const mockVanBanKiemTheo = [
  "2_QD_phe_duyet_KP_cds_20...",
  "4._Phu_luc_01_02_03.xlsx",
  "5._Gop_y_cua_Vu_TCCB_QTTV...",
  "1.2_Danh_sach_ho_tro_nguoi...",
  "6._Bo_nganh-tham_khao.zip",
  "3.1_Thuyet_minh_du_toan_bo...",
  "3._qd_phe_duyet_KP_cds_202...",
  "2.1_Thuyet_minh_du_toan_bo...",
  "1.3_Bang_phan_cong_cong_vi...",
  "1.1_Q_phe_duyet_danh_sach_..."
];

const mockLuanChuyen = [
  { thoiGian: "09:12 21/08/2026", noiDung: <>(Cục Cơ yếu-Công nghệ thông tin) Văn thư CY-CNTT <b>kết thúc văn bản trình ko phát sinh văn bản đi Văn bản trình</b></> },
  { thoiGian: "15:30 19/08/2026", noiDung: <>(Văn phòng Bộ) Ngô Quang Hưng <b>chuyển Văn bản trình</b> chuyển tới văn thư đơn vị</> },
  { thoiGian: "15:30 19/08/2026", noiDung: <>(Bộ ngoại giao) Thứ trưởng Lê Anh Tuấn <b>phê duyệt và chuyển Văn bản trình</b> chuyển tới Ngô Quang Hưng</> },
  { thoiGian: "15:30 19/08/2026", noiDung: <>(Bộ ngoại giao) Thứ trưởng Lê Anh Tuấn <b>ký số, cho ý kiến Văn bản trình</b></> },
  { thoiGian: "15:24 19/08/2026", noiDung: <>(Văn phòng Bộ) Ngô Quang Hưng <b>trình ký Văn bản trình</b> chuyển tới Thứ trưởng Lê Anh Tuấn</> },
  { thoiGian: "11:14 19/08/2026", noiDung: <>(Cục Cơ yếu-Công nghệ thông tin) Văn thư CY-CNTT <b>cấp số và chuyển Văn bản trình</b> chuyển tới Ngô Quang Hưng</> },
  { thoiGian: "11:00 19/08/2026", noiDung: <>(Cục Cơ yếu-Công nghệ thông tin) Vũ Tiến Dũng <b>phê duyệt Văn bản trình</b> chuyển tới Văn thư CY-CNTT</> },
  { thoiGian: "11:00 19/08/2026", noiDung: <>(Cục Cơ yếu-Công nghệ thông tin) Vũ Tiến Dũng <b>ký số, cho ý kiến Văn bản trình</b></> },
  { thoiGian: "10:50 19/08/2026", noiDung: <>(Cục Cơ yếu-Công nghệ thông tin) Hồ Sỹ An <b>trình ký Văn bản trình</b> chuyển tới Vũ Tiến Dũng</> },
  { thoiGian: "10:50 19/08/2026", noiDung: <>(Cục Cơ yếu-Công nghệ thông tin) Hồ Sỹ An <b>ký số, cho ý kiến Văn bản trình</b></> },
];

export default function VanBanTrinhDetailModal({ isOpen, onClose }: VanBanTrinhDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (!isOpen || !mounted) return null;

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40" onClick={onClose}>
          <div 
            className="bg-white shadow-2xl w-[95vw] h-[95vh] flex flex-col rounded overflow-hidden relative" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 shrink-0 bg-white">
              <h2 className="text-[18px] font-medium text-gray-800">Chi tiết văn bản trình</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* CONTENT BODY */}
            <div className="flex-1 overflow-hidden flex bg-[#f9fafb]">
              
              {/* LEFT PANE: PDF Viewer Mockup */}
              <div className="w-[60%] flex flex-col border-r border-gray-200 overflow-hidden bg-[#525659]">
                {/* PDF Toolbar */}
                <div className="h-12 bg-[#323639] flex items-center justify-between px-4 text-gray-300 text-[14px] shrink-0">
                  <div className="flex items-center gap-4">
                    <button className="hover:bg-white/10 p-1.5 rounded"><Menu className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-semibold bg-black/30 px-3 py-1 rounded">1 / 4</span>
                    <div className="w-px h-5 bg-gray-600 mx-1"></div>
                    <button onClick={() => setZoom(z => Math.max(10, z - 10))} className="hover:bg-white/10 p-1.5 rounded"><Minus className="w-5 h-5" /></button>
                    <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="hover:bg-white/10 p-1.5 rounded"><Plus className="w-5 h-5" /></button>
                    <div className="w-px h-5 bg-gray-600 mx-1"></div>
                    <button className="hover:bg-white/10 p-1.5 rounded"><RotateCw className="w-5 h-5" /></button>
                    <button className="hover:bg-white/10 p-1.5 rounded"><Maximize className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="hover:bg-white/10 p-1.5 rounded"><Printer className="w-5 h-5" /></button>
                    <button className="hover:bg-white/10 p-1.5 rounded" onClick={() => alert("Đang tải file Tờ trình...")}><Download className="w-5 h-5" /></button>
                    <button className="hover:bg-white/10 p-1.5 rounded"><MoreVertical className="w-5 h-5" /></button>
                  </div>
                </div>
                
                {/* PDF Content */}
                <div className="flex-1 overflow-auto flex justify-center custom-scrollbar p-6">
                  <div 
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }} 
                    className="bg-white w-[750px] min-h-[1050px] shadow-2xl flex flex-col shrink-0 relative"
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" 
                      alt="PDF mock"
                      className="absolute inset-0 w-full h-full object-cover opacity-5"
                    />
                    <div className="relative z-10 p-12 text-black font-serif text-[15px]">
                      <div className="flex justify-between mb-8">
                        <div className="text-center w-[45%]">
                          <p className="font-bold">BỘ NGOẠI GIAO</p>
                          <p className="font-bold">Cục Cơ yếu - Công nghệ thông tin</p>
                          <p className="border-t border-black w-1/3 mx-auto mt-0.5 pt-0.5 text-xs">Số: 116 /TTr-CYTT</p>
                        </div>
                        <div className="text-center w-[45%]">
                          <p className="italic">Hà Nội, ngày 19 tháng 8 năm 2026</p>
                        </div>
                      </div>
                      
                      <div className="text-center mb-6">
                        <p className="font-bold text-[18px]">TỜ TRÌNH GIẢI QUYẾT CÔNG VIỆC</p>
                      </div>

                      <div className="mb-4">
                        <p><span className="font-bold mr-4">Kính gửi:</span> Lãnh đạo Bộ</p>
                        <p><span className="font-bold mr-4">Vấn đề trình:</span> Về việc ban hành Danh sách và dự toán kinh phí cán bộ được hưởng mức hỗ trợ đối với người làm công tác chuyên trách về chuyển đổi số, an toàn thông tin mạng, an ninh mạng theo Nghị định số 179/2026/NĐ-CP của Chính phủ.</p>
                      </div>

                      <div className="border border-black p-4 text-justify mt-8">
                        <p className="font-bold text-center mb-4 border-b border-black pb-2">TÓM TẮT NỘI DUNG VÀ KIẾN NGHỊ</p>
                        <p className="indent-8 mb-2">Cục Cơ yếu - Công nghệ thông tin (Cục CY-CNTT) xin báo cáo và kiến nghị Lãnh đạo Bộ về việc hỗ trợ đối với người làm công tác chuyên trách về chuyển đổi số, an toàn thông tin mạng, an ninh mạng theo Nghị định số 179/2026/NĐ-CP của Chính phủ như sau:</p>
                        <p className="font-bold mb-1">1. Cơ sở pháp lý</p>
                        <p className="indent-8 mb-2">Ngày 01/7/2026, Chính phủ ban hành Nghị định số 179/2026/NĐ-CP (Nghị định 179) quy định mức hỗ trợ đối với người làm công tác chuyên trách về chuyển đổi số...</p>
                        <p className="font-bold mb-1 mt-4">2. Thẩm quyền quyết định</p>
                        <p className="indent-8">Khoản 1 Điều 6 Nghị định 179 giao người đứng đầu cơ quan quản lý cán bộ, công chức, viên chức chỉ đạo lập danh sách...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANE: Details */}
              <div className="w-[40%] flex flex-col p-5 overflow-y-auto custom-scrollbar relative">
                <div className="flex justify-end mb-4">
                  <button className="flex items-center px-4 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors shadow-sm">
                    <Plus className="w-4 h-4 mr-1.5" /> Chuyển vào HSCV
                  </button>
                </div>

                {/* THÔNG TIN TỜ TRÌNH */}
                <fieldset className="border border-gray-300 rounded-sm mb-6 bg-white relative pt-4 pb-0 px-0">
                  <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">Thông tin tờ trình</legend>
                  <table className="w-full border-collapse text-[13px]">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-bold text-gray-800 w-[30%] border-r border-gray-200 align-top">Thông tin</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <a href="#" className="text-[#005fb8] hover:underline hover:text-blue-800 truncate max-w-[200px]">mauvanbantrinhbongoaigiao...</a>
                            <Search className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0" onClick={() => setPreviewFile('mauvanbantrinhbongoaigiao.doc')} />
                            <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0" onClick={() => alert('Tải xuống mauvanbantrinhbongoaigiao...')} />
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-bold text-gray-800 border-r border-gray-200 align-top">
                          <div className="flex items-center gap-2">
                            Văn bản kèm theo
                            <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8]" onClick={() => alert('Đang tải toàn bộ văn bản kèm theo...')} title="Tải tất cả" />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1.5">
                            {mockVanBanKiemTheo.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <a href="#" className="text-[#005fb8] hover:underline hover:text-blue-800 text-[13px]">{file}</a>
                                <Search className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0" onClick={() => setPreviewFile(file)} />
                                <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0" onClick={() => alert(`Tải xuống ${file}`)} />
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-bold text-gray-800 border-r border-gray-200">Trạng thái</td>
                        <td className="py-3 px-4">Đã phát hành</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-bold text-gray-800 border-r border-gray-200">Lãnh đạo bộ phụ trách</td>
                        <td className="py-3 px-4">Thứ trưởng Lê Anh Tuấn</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-gray-800 border-r border-gray-200">Lãnh đạo bộ phê duyệt</td>
                        <td className="py-3 px-4">Thứ trưởng Lê Anh Tuấn</td>
                      </tr>
                    </tbody>
                  </table>
                </fieldset>

                {/* Ý KIẾN */}
                <fieldset className="border border-gray-300 rounded-sm mb-6 bg-white relative pt-4 pb-4 px-4">
                  <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">Ý kiến</legend>
                  <table className="w-full border-collapse mb-2">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2.5 px-3 text-center font-bold text-gray-800 w-[30%] border-r border-gray-200">Cán bộ</th>
                        <th className="py-2.5 px-3 text-center font-bold text-gray-800">Nội dung</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200 font-medium">Lãnh Đạo CYTT</td>
                        <td className="py-2.5 px-3 text-gray-900">Thống nhất chủ trương, yêu cầu làm rõ thêm một số điểm ở mục 2.</td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200 font-medium">Vũ Tiến Dũng</td>
                        <td className="py-2.5 px-3 text-gray-900">Đã cập nhật theo ý kiến của Lãnh đạo. Kính trình Lãnh đạo xem xét.</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex items-center justify-between py-2 border-t border-gray-200">
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
                    <div className="text-gray-500 text-[12px]">1-2 / 2</div>
                  </div>
                </fieldset>

                {/* LUÂN CHUYỂN */}
                <fieldset className="border border-gray-300 rounded-sm mb-6 bg-white relative pt-4 pb-4 px-4">
                  <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">Luân chuyển/Xử lý văn bản</legend>
                  <table className="w-full border-collapse mb-2 text-[13px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2.5 px-3 text-center font-bold text-gray-800 w-[20%] border-r border-gray-200">Thời gian</th>
                        <th className="py-2.5 px-3 text-center font-bold text-gray-800">Nội dung</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockLuanChuyen.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-2.5 px-3 text-center text-gray-600 border-r border-gray-200">
                            {item.thoiGian.split(' ')[0]}<br/>{item.thoiGian.split(' ')[1]}
                          </td>
                          <td className="py-2.5 px-3 text-gray-900 leading-relaxed">{item.noiDung}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex items-center justify-between py-2 border-t border-gray-200">
                    <div className="flex items-center gap-1">
                      <button className="p-1 border border-gray-300 bg-white rounded text-gray-500 hover:bg-gray-100"><ChevronsLeft className="w-3.5 h-3.5" /></button>
                      <button className="p-1 border border-gray-300 bg-white rounded text-gray-500 hover:bg-gray-100"><ChevronLeft className="w-3.5 h-3.5" /></button>
                      <button className="px-2.5 py-0.5 border border-gray-300 bg-[#e9ecef] rounded text-gray-700 text-[12px]">1</button>
                      <button className="p-1 border border-gray-300 bg-[#0078d4] text-white rounded hover:bg-[#005fb8]"><ChevronRight className="w-3.5 h-3.5" /></button>
                      <button className="p-1 border border-gray-300 bg-[#0078d4] text-white rounded hover:bg-[#005fb8]"><ChevronsRight className="w-3.5 h-3.5" /></button>
                      <select className="ml-2 border border-gray-300 rounded px-1 py-1 text-[12px] focus:outline-none bg-white">
                        <option>10</option>
                      </select>
                    </div>
                    <div className="text-gray-500 text-[12px]">1-10 / 13</div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Shared Modals for Viewing Documents */}
      {previewFile && previewFile.toLowerCase().endsWith('.pdf') && (
        <PDFDetailModal fileName={previewFile} onClose={() => setPreviewFile(null)} />
      )}
      {previewFile && (previewFile.toLowerCase().endsWith('.doc') || previewFile.toLowerCase().endsWith('.docx') || previewFile.toLowerCase().endsWith('.xls') || previewFile.toLowerCase().endsWith('.xlsx')) && (
        <WordDetailModal fileName={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </>
  );
}
