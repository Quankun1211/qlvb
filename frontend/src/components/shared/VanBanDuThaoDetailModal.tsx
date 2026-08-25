"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search, Download, MessageSquare, EyeOff, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { PDFDetailModal, WordDetailModal } from "@/app/van-ban-den/[slug]/SharedModals";

interface VanBanDuThaoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

const mockVanBanKemTheo = [
  { name: "2540_BCA-TTDLQG-1782960425530-5d88e0423dbe4f69853859637c06f7cd.pdf", creator: "Đỗ Văn Điển" },
  { name: "Bieu_mau_2-d9a9a846c3134867a24d38ac21ed90c7.docx", creator: "Đỗ Văn Điển" },
  { name: "CV_gui_LPQT_ve_dang_ky_ha_tang_len_C12-68adb824301645748ecb89f424f40aa0.docx", creator: "Đỗ Văn Điển" },
  { name: "DANH_SACH_DANG_KY_SU_DUNG_HA_TANG_C12-c5a872f3ceb846f5bddfb5eba79307ea.docx", creator: "Đỗ Văn Điển" },
  { name: "cv_gui_lpqt_ve_dang_ky_ha_tang_len_c12-68adb824301_2408.signed.pdf", creator: "Nguyễn Đăng Lâm" }
];

const mockNhatKy = [
  { thoiGian: "17:17 24/08/2026", noiDung: <>(Cục Cơ yếu-Công nghệ thông tin) (Tổ công tác) Nguyễn Đăng Lâm <b>phê duyệt và chuyển Văn bản dự thảo</b> chuyển tới văn thư đơn vị</> },
  { thoiGian: "17:17 24/08/2026", noiDung: <>(Cục Cơ yếu-Công nghệ thông tin) (Tổ công tác) Nguyễn Đăng Lâm <b>Cho ý kiến File đính kèm</b></> },
  { thoiGian: "16:23 24/08/2026", noiDung: <>(Cục Cơ yếu-Công nghệ thông tin) (Phòng Quản lý hệ thống) Đỗ Văn Điển <b>tạo mới và trình ký Văn bản dự thảo</b> chuyển tới Nguyễn Đăng Lâm</> },
];

export default function VanBanDuThaoDetailModal({ isOpen, onClose }: VanBanDuThaoDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (!isOpen || !mounted) return null;

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40" onClick={onClose}>
          <div 
            className="bg-white shadow-2xl w-[1000px] max-w-[95vw] h-[95vh] flex flex-col rounded overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 shrink-0 bg-white">
              <h2 className="text-[18px] font-medium text-gray-800">Chi tiết dự thảo</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* CONTENT BODY */}
            <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar text-[13px] text-gray-900">
              
              {/* THÔNG TIN DỰ THẢO */}
              <fieldset className="border border-gray-300 rounded-sm mb-6 bg-white relative pt-4 pb-0 px-0">
                <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">Thông tin dự thảo</legend>
                <div className="w-full">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 font-bold text-gray-800 w-[20%] border-r border-gray-100">Trạng thái</td>
                        <td className="py-3 px-4" colSpan={3}>
                          <span className="inline-block px-3 py-1 bg-[#198754] text-white rounded-full text-[11px] font-bold">Đã phát hành</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <td className="py-3 px-4 font-bold text-gray-800 border-r border-gray-100">Đơn vị trình</td>
                        <td className="py-3 px-4 w-[40%]">Cục Cơ yếu-Công nghệ thông tin</td>
                        <td className="py-3 px-4 font-bold text-gray-800 w-[15%] border-l border-gray-100">Ngày trình</td>
                        <td className="py-3 px-4 w-[25%]">24/08/2026</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 font-bold text-gray-800 border-r border-gray-100">Vấn đề trình</td>
                        <td className="py-3 px-4" colSpan={3}>V/v Đăng ký cơ sở hạ tầng CNTT tại Trung tâm dữ liệu quốc gia cho CSDL quốc gia về cam kết quốc tế</td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <td className="py-3 px-4 font-bold text-gray-800 border-r border-gray-100 align-top">
                          <div className="flex items-center gap-2">
                            Văn bản trình kèm theo
                            <Download className="w-4 h-4 text-gray-800 cursor-pointer hover:text-[#005fb8]" onClick={() => alert("Đang tải toàn bộ văn bản trình kèm theo...")} />
                          </div>
                        </td>
                        <td className="py-3 px-4" colSpan={3}>
                          <div className="flex flex-col gap-2">
                            {mockVanBanKemTheo.map((file, idx) => (
                              <div key={idx} className="flex flex-col gap-1">
                                <div className="text-[#005fb8] hover:underline text-[13px] break-all">
                                  {file.name} - {file.creator} tạo
                                </div>
                                <div className="flex items-center gap-3 text-gray-500">
                                  <MessageSquare className="w-4 h-4 cursor-pointer hover:text-[#005fb8]" />
                                  <Search className="w-4 h-4 cursor-pointer hover:text-[#005fb8]" onClick={() => setPreviewFile(file.name)} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 font-bold text-gray-800 border-r border-gray-100">Lãnh đạo cấp phòng, ban (nếu có)</td>
                        <td className="py-3 px-4"></td>
                        <td className="py-3 px-4 font-bold text-gray-800 border-l border-gray-100">Chuyên viên thụ lý</td>
                        <td className="py-3 px-4">Đỗ Văn Điển</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-gray-800 border-r border-gray-100">Lãnh đạo Đơn vị</td>
                        <td className="py-3 px-4" colSpan={3}>Nguyễn Đăng Lâm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </fieldset>

              {/* Ý KIẾN */}
              <fieldset className="border border-gray-300 rounded-sm mb-6 bg-white relative pt-4 pb-0 px-0">
                <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">Ý kiến</legend>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 px-4 text-center font-bold text-gray-800 w-[30%] border-r border-gray-200">Cán bộ</th>
                      <th className="py-2.5 px-4 text-center font-bold text-gray-800">Nội dung</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={2} className="py-6 text-center text-gray-500 bg-gray-50/50 border-b border-gray-200">Không có dữ liệu</td>
                    </tr>
                  </tbody>
                </table>
              </fieldset>

              {/* NHẬT KÝ XỬ LÝ VĂN BẢN */}
              <fieldset className="border border-gray-300 rounded-sm mb-6 bg-white relative pt-4 pb-0 px-0">
                <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">Nhật ký xử lý văn bản</legend>
                
                <div className="absolute top-2 right-2 cursor-pointer text-[#005fb8] hover:text-blue-800 z-10" title="Ẩn/Hiện">
                  <EyeOff className="w-5 h-5" />
                </div>

                <div className="flex">
                  <div className="w-1 bg-[#005fb8]"></div>
                  <div className="flex-1 overflow-hidden">
                    <table className="w-full border-collapse border border-gray-200 mt-2 mx-2 mb-2" style={{ width: 'calc(100% - 16px)' }}>
                      <thead>
                        <tr className="border-b border-gray-200 bg-white">
                          <th className="py-2.5 px-4 text-center font-bold text-[#005fb8] w-[20%] border-r border-gray-200">Thời gian</th>
                          <th className="py-2.5 px-4 text-center font-bold text-gray-800">Nội dung</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockNhatKy.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-2.5 px-4 text-center text-gray-600 border-r border-gray-200 bg-white">
                              {item.thoiGian.split(' ')[0]}<br/>{item.thoiGian.split(' ')[1]}
                            </td>
                            <td className="py-2.5 px-4 text-gray-900 leading-relaxed bg-white">{item.noiDung}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 py-2 bg-white border-t border-gray-200 mx-1">
                  <div className="flex items-center gap-1">
                    <button className="p-1 border border-gray-300 bg-[#e9ecef] rounded text-gray-500"><ChevronsLeft className="w-3.5 h-3.5" /></button>
                    <button className="p-1 border border-gray-300 bg-[#e9ecef] rounded text-gray-500"><ChevronLeft className="w-3.5 h-3.5" /></button>
                    <button className="px-2.5 py-0.5 border border-gray-300 bg-white rounded text-gray-700 text-[12px]">1</button>
                    <button className="p-1 border border-gray-300 bg-[#e9ecef] rounded text-gray-500"><ChevronRight className="w-3.5 h-3.5" /></button>
                    <button className="p-1 border border-gray-300 bg-[#e9ecef] rounded text-gray-500"><ChevronsRight className="w-3.5 h-3.5" /></button>
                    <div className="px-2.5 py-1 bg-[#0078d4] text-white rounded text-[12px] font-bold ml-1">10</div>
                  </div>
                  <div className="text-gray-500 text-[12px]">1-3 / 3</div>
                </div>
              </fieldset>

            </div>

            {/* FOOTER */}
            <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end shrink-0">
              <button onClick={onClose} className="flex items-center px-6 py-2 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[14px] font-bold transition-colors">
                <X className="w-4 h-4 mr-1.5" /> Đóng
              </button>
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
