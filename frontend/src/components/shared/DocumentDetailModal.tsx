"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search, Download, Plus, FileText, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowDownToLine, FileDown, Paperclip } from "lucide-react";
import { PDFDetailModal, WordDetailModal } from "@/app/van-ban-den/[slug]/SharedModals";

interface DocumentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data?: any; // To be replaced with real data structure later
}

const defaultMockData = {
  thongTinVanBan: {
    soKyHieu: "2978/VP-TKBT",
    soDen: "4142",
    soCongVan: "Văn bản đến trong Bộ",
    loaiVanBan: "Công văn",
    ngayBanHanh: "25/08/2026",
    ngayDen: "25/08/2026 08:14",
    kemVanBanGiay: "Không",
    laVBPL: "Không",
    coQuanBH: "Văn phòng Bộ",
    trichYeu: "V/v Đôn đốc nhắc việc 25/8",
    hanTraLoi: "",
    bangSoNgay: "0",
    doMat: "Bình thường",
    doKhan: "Hỏa tốc",
    files: [
      "cv_don_doc_nhac_viec_2508-c6a4ee7429e34568bf5a9ac2_2508.signed.pdf",
      "CV_Don_doc_nhac_viec_2508-c6a4ee7429e34568bf5a9ac23aa279de.docx",
      "cv_don_doc_nhac_viec_2508-c6a4ee7429e34568bf5a9ac2_2508.signed.pdf"
    ]
  },
  thongTinCongViec: {
    tenCongViec: "V/v Đôn đốc nhắc việc 25/8",
    nguoiLap: "",
    hanXuLy: "",
    donViChuTri: "Cục Cơ yếu-Công nghệ thông tin",
    donViPhoiHop: "",
    trangThai: "Chưa xử lý",
    canPhanHoi: "Có",
    luanChuyen: [
      { thoiGian: "13:19 25/08/2026", noiDung: "(Cục Cơ yếu-Công nghệ thông tin) Lãnh Đạo CYTT phân công xử lý công việc tới Phòng Tổ chức - Tổng hợp" },
      { thoiGian: "12:36 25/08/2026", noiDung: "(Cục Cơ yếu-Công nghệ thông tin) Văn thư CY-CNTT thực hiện thao tác: Vào sổ văn bản đến 2990/VP-CCHC" },
      { thoiGian: "12:01 25/08/2026", noiDung: "Văn bản được gửi tới từ đơn vị: Văn phòng Bộ" }
    ]
  },
  thongTinCongViecToanBo: {
    tenCongViec: "V/v Đề nghị cung cấp thông tin liên quan đến công tác tiếp công dân, giải quyết khiếu nại, tố cáo, kiến nghị, phản ánh",
    nguoiLap: "Lãnh Đạo CYTT",
    hanXuLy: "",
    donViChuTri: "Phòng Tổ chức - Tổng hợp",
    donViPhoiHop: "",
    trangThai: "Chưa xử lý",
    canPhanHoi: "Có"
  },
  yKien: [
    { stt: 1, tenLanhDao: "Lãnh Đạo CYTT", noiDung: "V/v Đề nghị cung cấp thông tin liên quan đến công tác tiếp công dân, giải quyết khiếu nại, tố cáo, kiến nghị, phản ánh: P TC (g/q)", ngayChoYKien: "25/08/2026 13:19" }
  ]
};

export default function DocumentDetailModal({ isOpen, onClose, title, data = defaultMockData }: DocumentDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("cong-viec"); // "cong-viec" or "toan-bo"
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const renderFieldsetLegend = (text: string) => (
    <legend className="text-[13px] font-bold text-gray-900 px-2 bg-white ml-2">
      {text}
    </legend>
  );

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40" onClick={onClose}>
          <div 
            className="bg-white shadow-2xl w-[1200px] max-w-[95vw] h-[95vh] flex flex-col rounded-sm overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 shrink-0">
          <h2 className="text-[18px] font-medium text-gray-800">Chi tiết văn bản đến</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar text-[13px] text-gray-900 bg-[#f9fafb]">
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mb-4">
            <button className="flex items-center px-4 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" /> Chuyển vào HSCV
            </button>
            <button className="flex items-center justify-center w-8 h-8 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded transition-colors shadow-sm">
              <FileText className="w-4 h-4" />
            </button>
          </div>

          {/* THÔNG TIN VĂN BẢN */}
          <fieldset className="border border-gray-300 rounded-sm mb-6 bg-white relative pt-4 pb-0 px-0">
            <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">Thông tin văn bản</legend>
            <div className="w-full">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 px-4 font-bold text-gray-800 w-[15%]">Số ký hiệu</td>
                    <td className="py-2.5 px-4 w-[35%]">{data.thongTinVanBan.soKyHieu}</td>
                    <td className="py-2.5 px-4 font-bold text-gray-800 w-[15%] border-l border-gray-100">Số đến</td>
                    <td className="py-2.5 px-4 w-[35%]">{data.thongTinVanBan.soDen}</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="py-2.5 px-4 font-bold text-gray-800">Sổ công văn</td>
                    <td className="py-2.5 px-4">{data.thongTinVanBan.soCongVan}</td>
                    <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">Loại văn bản</td>
                    <td className="py-2.5 px-4">{data.thongTinVanBan.loaiVanBan}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 px-4 font-bold text-gray-800">Ngày ban hành</td>
                    <td className="py-2.5 px-4">{data.thongTinVanBan.ngayBanHanh}</td>
                    <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">Ngày đến</td>
                    <td className="py-2.5 px-4">{data.thongTinVanBan.ngayDen}</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="py-2.5 px-4 font-bold text-gray-800">Kèm văn bản giấy</td>
                    <td className="py-2.5 px-4">{data.thongTinVanBan.kemVanBanGiay}</td>
                    <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">Là VBPL</td>
                    <td className="py-2.5 px-4">{data.thongTinVanBan.laVBPL}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 px-4 font-bold text-gray-800">Cơ quan BH</td>
                    <td className="py-2.5 px-4" colSpan={3}>{data.thongTinVanBan.coQuanBH}</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="py-2.5 px-4 font-bold text-gray-800">Trích yếu</td>
                    <td className="py-2.5 px-4" colSpan={3}>{data.thongTinVanBan.trichYeu}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 px-4 font-bold text-gray-800">Hạn trả lời</td>
                    <td className="py-2.5 px-4">{data.thongTinVanBan.hanTraLoi}</td>
                    <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">Bằng số(ngày)</td>
                    <td className="py-2.5 px-4">{data.thongTinVanBan.bangSoNgay}</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="py-2.5 px-4 font-bold text-gray-800">Độ mật</td>
                    <td className="py-2.5 px-4">{data.thongTinVanBan.doMat}</td>
                    <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">Độ khẩn</td>
                    <td className="py-2.5 px-4">{data.thongTinVanBan.doKhan}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-800">
                      File đính kèm
                    </td>
                    <td className="py-3 px-4" colSpan={3}>
                      <div className="flex gap-4">
                        {data.thongTinVanBan.files.length > 0 && (
                          <button 
                            onClick={() => alert('Đang tải xuống tất cả file đính kèm...')}
                            className="w-7 h-7 bg-[#212529] hover:bg-[#343a40] text-white rounded flex items-center justify-center shrink-0 mt-0.5 shadow-sm"
                            title="Tải xuống tất cả"
                          >
                            <ArrowDownToLine className="w-4 h-4" />
                          </button>
                        )}
                        <div className="flex flex-col gap-1.5">
                          {data.thongTinVanBan.files.map((file: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 group">
                              <a href="#" className="text-[#005fb8] hover:underline hover:text-blue-800 text-[13px] break-all">{file}</a>
                              <Search 
                                className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0" 
                                onClick={() => setPreviewFile(file)}
                                title="Xem trước file"
                              />
                              <FileDown 
                                className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0" 
                                onClick={() => alert(`Đang tải file: ${file}`)}
                                title="Tải xuống"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </fieldset>

          {/* Ý KIẾN */}
          <fieldset className="border border-gray-300 rounded-sm mb-6 bg-white relative pt-4 pb-4 px-4">
            <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">Ý kiến</legend>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2.5 px-3 text-center font-bold text-gray-800 w-[5%] border-r border-gray-200">STT</th>
                  <th className="py-2.5 px-3 text-center font-bold text-gray-800 w-[20%] border-r border-gray-200">Tên lãnh đạo</th>
                  <th className="py-2.5 px-3 text-center font-bold text-gray-800 w-[50%] border-r border-gray-200">Nội dung</th>
                  <th className="py-2.5 px-3 text-center font-bold text-gray-800 w-[15%] border-r border-gray-200">Ngày cho ý kiến</th>
                  <th className="py-2.5 px-3 text-center font-bold text-gray-800 w-[10%]"><Paperclip className="w-4 h-4 mx-auto text-gray-600" /></th>
                </tr>
              </thead>
              <tbody>
                {data.yKien?.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 text-center text-gray-900 border-r border-gray-200">{item.stt}</td>
                    <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">{item.tenLanhDao}</td>
                    <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">{item.noiDung}</td>
                    <td className="py-2.5 px-3 text-center text-gray-900 border-r border-gray-200">{item.ngayChoYKien}</td>
                    <td className="py-2.5 px-3 text-center text-gray-900"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </fieldset>

          {/* THÔNG TIN CÔNG VIỆC */}
          <fieldset className="border border-gray-300 rounded-sm mb-6 bg-white relative pt-4 pb-4 px-4">
            <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">Thông tin công việc</legend>
            
            <div className="border border-gray-300 rounded-sm p-4 mt-2">
              <div className="flex border-b border-gray-300 mb-4">
                <button 
                  className={`px-4 py-2 text-[14px] font-bold ${activeTab === 'cong-viec' ? 'border border-gray-300 border-b-white text-gray-800 -mb-[1px] bg-white rounded-t' : 'text-[#005fb8] hover:underline'}`}
                  onClick={() => setActiveTab('cong-viec')}
                >
                  Công việc của đơn vị
                </button>
                <button 
                  className={`px-4 py-2 text-[14px] font-bold ${activeTab === 'toan-bo' ? 'border border-gray-300 border-b-white text-gray-800 -mb-[1px] bg-white rounded-t' : 'text-[#005fb8] hover:underline'}`}
                  onClick={() => setActiveTab('toan-bo')}
                >
                  Toàn bộ thông tin phân công xử lý
                </button>
              </div>

              {activeTab === 'cong-viec' && (
                <div className="w-full">
                  <table className="w-full border-collapse mb-6">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2.5 font-bold text-gray-800 w-[15%]">Tên công việc</td>
                        <td className="py-2.5" colSpan={3}>{data.thongTinCongViec.tenCongViec}</td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <td className="py-2.5 font-bold text-gray-800 w-[15%]">Người lập</td>
                        <td className="py-2.5 w-[35%]">{data.thongTinCongViec.nguoiLap}</td>
                        <td className="py-2.5 font-bold text-gray-800 w-[15%] pl-4">Hạn xử lý</td>
                        <td className="py-2.5 w-[35%]">{data.thongTinCongViec.hanXuLy}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2.5 font-bold text-gray-800">Đơn vị chủ trì</td>
                        <td className="py-2.5">{data.thongTinCongViec.donViChuTri}</td>
                        <td className="py-2.5 font-bold text-gray-800 pl-4">Đơn vị phối hợp</td>
                        <td className="py-2.5">{data.thongTinCongViec.donViPhoiHop}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-gray-800">Trạng thái</td>
                        <td className="py-2.5">
                          <span className={`inline-block px-2.5 py-1 text-white rounded-[10px] text-[11px] font-medium ${data.thongTinCongViec.trangThai === 'Đang xử lý' ? 'bg-[#007bff]' : 'bg-[#6c757d]'}`}>
                            {data.thongTinCongViec.trangThai}
                          </span>
                        </td>
                        <td className="py-2.5 font-bold text-gray-800 pl-4 border-l border-gray-100">Cần phản hồi</td>
                        <td className="py-2.5">{data.thongTinCongViec.canPhanHoi}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* LUÂN CHUYỂN */}
                  <fieldset className="border border-gray-300 rounded-sm relative pt-4 pb-0 px-0">
                    <legend className="text-[13px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">Luân chuyển/Xử lý văn bản</legend>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-2 px-4 text-center font-bold text-gray-800 w-[20%] border-r border-gray-200">Thời gian</th>
                          <th className="py-2 px-4 text-center font-bold text-gray-800">Nội dung</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.thongTinCongViec.luanChuyen.map((item: any, idx: number) => (
                          <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50/50">
                            <td className="py-2.5 px-4 text-center text-gray-600 border-r border-gray-200">
                              {item.thoiGian.split(' ')[0]}<br/>{item.thoiGian.split(' ')[1]}
                            </td>
                            <td className="py-2.5 px-4 text-gray-800">{item.noiDung}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50/50">
                      <div className="flex items-center gap-1">
                        <button className="p-1 border border-gray-300 bg-white rounded text-gray-500 hover:bg-gray-100"><ChevronsLeft className="w-3.5 h-3.5" /></button>
                        <button className="p-1 border border-gray-300 bg-white rounded text-gray-500 hover:bg-gray-100"><ChevronLeft className="w-3.5 h-3.5" /></button>
                        <button className="px-2.5 py-0.5 border border-gray-300 bg-[#e9ecef] rounded text-gray-700 text-[12px]">1</button>
                        <button className="p-1 border border-gray-300 bg-white rounded text-gray-500 hover:bg-gray-100"><ChevronRight className="w-3.5 h-3.5" /></button>
                        <button className="p-1 border border-gray-300 bg-white rounded text-gray-500 hover:bg-gray-100"><ChevronsRight className="w-3.5 h-3.5" /></button>
                        <select className="ml-2 border border-gray-300 rounded px-1 py-1 text-[12px] focus:outline-none bg-white">
                          <option>10</option>
                          <option>20</option>
                        </select>
                      </div>
                      <div className="text-gray-500 text-[12px]">1-2 / 2</div>
                    </div>
                  </fieldset>
                </div>
              )}

              {activeTab === 'toan-bo' && (
                <div className="w-full">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2.5 font-bold text-gray-800 w-[15%]">Tên công việc</td>
                        <td className="py-2.5" colSpan={3}>{data.thongTinCongViecToanBo.tenCongViec}</td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <td className="py-2.5 font-bold text-gray-800 w-[15%]">Người lập</td>
                        <td className="py-2.5 w-[35%]">{data.thongTinCongViecToanBo.nguoiLap}</td>
                        <td className="py-2.5 font-bold text-gray-800 w-[15%] pl-4 border-l border-gray-100">Hạn xử lý</td>
                        <td className="py-2.5 w-[35%]">{data.thongTinCongViecToanBo.hanXuLy}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2.5 font-bold text-gray-800 w-[15%]">Đơn vị chủ trì</td>
                        <td className="py-2.5">{data.thongTinCongViecToanBo.donViChuTri}</td>
                        <td className="py-2.5 font-bold text-gray-800 pl-4 border-l border-gray-100">Đơn vị phối hợp</td>
                        <td className="py-2.5">{data.thongTinCongViecToanBo.donViPhoiHop}</td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <td className="py-2.5 font-bold text-gray-800">File đính kèm</td>
                        <td className="py-2.5" colSpan={3}></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-gray-800">Trạng thái</td>
                        <td className="py-2.5">
                          <span className={`inline-block px-2.5 py-1 text-white rounded-[10px] text-[11px] font-medium ${data.thongTinCongViecToanBo.trangThai === 'Chưa xử lý' ? 'bg-[#6c757d]' : 'bg-[#007bff]'}`}>
                            {data.thongTinCongViecToanBo.trangThai}
                          </span>
                        </td>
                        <td className="py-2.5 font-bold text-gray-800 pl-4 border-l border-gray-100">Cần phản hồi</td>
                        <td className="py-2.5">{data.thongTinCongViecToanBo.canPhanHoi}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </fieldset>

          {/* VĂN BẢN LIÊN QUAN */}
          <fieldset className="border border-gray-300 rounded-sm mb-6 bg-white relative pt-4 pb-0 px-0">
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
                  <td colSpan={3} className="py-8 text-center text-gray-500 bg-gray-50/50">Không có dữ liệu</td>
                </tr>
              </tbody>
            </table>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50/50 border-t border-gray-200">
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

        {/* FOOTER */}
        <div className="px-5 py-3 border-t border-gray-200 flex justify-end shrink-0 bg-white">
          <button onClick={onClose} className="flex items-center px-5 py-1.5 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-bold transition-colors">
            <X className="w-4 h-4 mr-1.5" /> Đóng
          </button>
        </div>

        </div>
      </div>,
      document.body
    )}

      {/* View Modals */}
      {previewFile && previewFile.toLowerCase().endsWith('.pdf') && (
        <PDFDetailModal fileName={previewFile} onClose={() => setPreviewFile(null)} />
      )}
      {previewFile && (previewFile.toLowerCase().endsWith('.doc') || previewFile.toLowerCase().endsWith('.docx')) && (
        <WordDetailModal fileName={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </>
  );
}
