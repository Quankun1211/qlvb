import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search, Download, DownloadCloud, Menu, Minus, Plus, RotateCw, Maximize, Printer, MoreVertical, PenTool, ChevronDown } from "lucide-react";

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreview: (fileName: string) => void;
  attachments?: string[];
}

export function AttachmentModal({ isOpen, onClose, onPreview, attachments = [] }: AttachmentModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!isOpen || !mounted) return null;

  const mockAttachments = attachments.length > 0 ? attachments : [
    "CV_Don_doc_nhac_viec_2408-baa95e06699b4d5087b04ee49e5a2dbc.docx",
    "cv_don_doc_nhac_viec_2408-baa95e06699b4d5087b04ee4_2408.signed.pdf",
    "VP-TKBT-20262964-a6c74a47a4a041d1a078a400bd7bdda1.pdf"
  ];

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded shadow-xl w-[800px] max-w-[90vw] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-800">File đính kèm</h2>
          <button onClick={onClose} className="text-gray-900 hover:text-gray-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <table className="w-full border-collapse border border-gray-200 text-[13px]">
            <thead>
              <tr className="bg-white text-gray-800 border-b border-gray-200">
                <th className="p-2 border-r border-gray-200 text-center font-bold">Tên file</th>
                <th className="p-2 text-center font-bold w-24">Tải xuống</th>
              </tr>
            </thead>
            <tbody>
              {mockAttachments.map((file, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-2 border-r border-gray-200">
                    <div className="flex items-center">
                      <a href="#" className="text-[#005fb8] hover:underline break-all mr-2 flex-1">
                        {file}
                      </a>
                      <button
                        onClick={() => onPreview(file)}
                        className="text-gray-600 hover:text-[#005fb8] p-1 shrink-0"
                        title="Xem trước file"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => alert(`Đang tải file: ${file}`)}
                      className="text-black hover:text-[#005fb8]"
                      title="Tải xuống"
                    >
                      <Download className="w-4 h-4 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={() => alert("Đang tải xuống toàn bộ file đính kèm...")}
            className="flex items-center px-4 py-1.5 bg-white border border-green-600 text-green-600 hover:bg-green-50 rounded text-[13px] font-semibold transition-colors"
          >
            <DownloadCloud className="w-4 h-4 mr-1.5" /> Tải xuống tất cả
          </button>
          <button onClick={onClose} className="flex items-center px-4 py-1.5 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-semibold transition-colors">
            <X className="w-4 h-4 mr-1.5" /> Đóng
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

interface FileDetailModalProps {
  fileName: string | null;
  onClose: () => void;
}

export function WordDetailModal({ fileName, onClose }: FileDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showDocMenu, setShowDocMenu] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!fileName || !mounted) return null;

  const content = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-[95vw] h-[95vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-800">Chi tiết file</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body: Document Viewer Mockup */}
        <div className="flex-1 bg-[#e1dfdd] p-2 sm:p-4 overflow-hidden flex flex-col items-center">
          <div className="bg-white w-[1000px] max-w-full h-full shadow-md border border-gray-300 flex flex-col relative overflow-hidden">
            {/* Simulated Document Content */}
            <div className="flex-1 overflow-auto p-8 sm:p-12 custom-scrollbar text-gray-900">
              <div
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}
                className="w-full"
              >
                <div className="flex justify-between mb-10 text-[15px] font-serif">
                  <div className="text-center">
                    <p className="font-bold uppercase">Văn phòng Bộ</p>
                    <p className="border-t border-black w-3/4 mx-auto mt-0.5 pt-0.5">
                      Số: <span className="ml-2">/VP-TKBT</span>
                    </p>
                    <p className="italic mt-1">V/v: Đôn đốc, nhắc việc</p>
                  </div>
                  <div className="italic text-right">
                    <p>Hà Nội, ngày 24 tháng 8 năm 2026</p>
                  </div>
                </div>

                <div className="text-[15px] font-serif leading-relaxed px-8 text-justify">
                  <p className="mb-4 text-center"><span className="font-bold">Kính gửi:</span></p>
                  <div className="pl-24 mb-6">
                    <p>- CSĐN, ĐNA, ĐBA, CM, CÂu, NGKT, BC, LPQT,</p>
                    <p>- UBBG, UBNV, NVVH, QTTV, CYTT, LTPD, CQĐU.</p>
                  </div>
                  <p className="indent-8">
                    Thực hiện chỉ đạo của Bộ trưởng về tăng cường công tác đôn đốc, nhắc việc,
                    Văn phòng Bộ xin gửi các đơn vị danh mục các nhiệm vụ quá hạn, sắp đến hạn không giao
                    trên Hệ thống văn bản điều hành của Bộ (cập nhật đến 18h00 ngày 22/8/2026).
                  </p>
                  <p className="indent-8 mt-2">
                    Đề nghị các đơn vị khẩn trương rà soát, cập nhật tiến độ xử lý văn bản,
                    báo cáo Lãnh đạo Bộ phụ trách cho ý kiến chỉ đạo để giải quyết dứt điểm các nhiệm vụ tồn đọng.
                  </p>
                </div>
              </div>
            </div>

            {/* Word Viewer Bottom Bar */}
            <div className="h-7 bg-[#f3f2f1] border-t border-gray-300 flex items-center justify-between px-3 text-[11px] text-gray-600 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-[#2b579a] text-white rounded-[2px] px-1 font-bold">W</div>
                <span>PAGE 1 OF 4</span>
              </div>
              <div className="flex items-center gap-4">
                <span>English (US)</span>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowDocMenu(!showDocMenu)}
                      className={`flex items-center px-1.5 py-0.5 rounded-sm transition-colors ${showDocMenu ? 'bg-[#c5d5ec]' : 'hover:bg-[#e1dfdd]'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text w-3.5 h-3.5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg> 
                      <ChevronDown className="w-3 h-3 ml-0.5" />
                    </button>

                    {showDocMenu && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowDocMenu(false)}></div>
                        <div className="absolute bottom-full mb-1 right-0 w-44 bg-white border border-gray-300 shadow-lg z-20 py-1 text-[13px] text-gray-900 font-normal">
                          <button className="w-full text-left px-4 py-1.5 hover:bg-gray-100">Print to PDF</button>
                          <button className="w-full text-left px-4 py-1.5 hover:bg-gray-100">Accessibility Mode</button>
                          <div className="border-t border-gray-200 my-1 mx-4"></div>
                          <button className="w-full text-left px-4 py-1.5 text-gray-400 cursor-not-allowed">Embed Information</button>
                        </div>
                      </>
                    )}
                  </div>
                  <button className="p-0.5 hover:bg-[#e1dfdd] rounded-sm transition-colors">
                    <div className="w-3.5 h-3.5 border border-gray-600 rounded-[1px] relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 border border-gray-600"></div>
                    </div>
                  </button>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <input
                    type="range"
                    min="50"
                    max="200"
                    step="10"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-24 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer accent-[#2b579a]"
                  />
                  <span className="w-10 text-right">{zoom}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end">
          <button onClick={onClose} className="flex items-center px-6 py-2 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[14px] font-semibold transition-colors">
            <X className="w-4 h-4 mr-1.5" /> Đóng
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(content, document.body);
}

export function PDFDetailModal({ fileName, onClose }: FileDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(95);
  
  useEffect(() => setMounted(true), []);

  if (!fileName || !mounted) return null;

  const content = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-[95vw] h-[95vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 bg-white shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Chi tiết file</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body: PDF Viewer Mockup */}
        <div className="flex-1 bg-[#525659] flex flex-col overflow-hidden">
          {/* PDF Toolbar */}
          <div className="h-10 bg-[#323639] border-b border-[#202224] flex items-center justify-between px-3 text-gray-300 text-[13px] shrink-0">
            <div className="flex items-center gap-4">
              <button className="hover:bg-white/10 p-1.5 rounded"><Menu className="w-4 h-4" /></button>
              <span className="font-medium truncate max-w-[200px]">{fileName}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span>1 / 3</span>
              <div className="w-px h-4 bg-gray-600 mx-1"></div>
              <button onClick={() => setZoom(z => Math.max(10, z - 10))} className="hover:bg-white/10 p-1 rounded"><Minus className="w-4 h-4" /></button>
              <span>{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="hover:bg-white/10 p-1 rounded"><Plus className="w-4 h-4" /></button>
              <div className="w-px h-4 bg-gray-600 mx-1"></div>
              <button className="hover:bg-white/10 p-1 rounded"><Maximize className="w-4 h-4" /></button>
              <button className="hover:bg-white/10 p-1 rounded"><RotateCw className="w-4 h-4" /></button>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="hover:bg-white/10 p-1.5 rounded"><Download className="w-4 h-4" /></button>
              <button className="hover:bg-white/10 p-1.5 rounded"><Printer className="w-4 h-4" /></button>
              <button className="hover:bg-white/10 p-1.5 rounded"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>
          
          {/* PDF Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Thumbnails Sidebar */}
            <div className="w-48 bg-[#323639] border-r border-[#202224] flex flex-col items-center py-4 gap-4 overflow-y-auto shrink-0 custom-scrollbar">
              <div className="flex flex-col items-center gap-2">
                <div className="w-32 h-44 bg-white ring-2 ring-blue-500 shadow flex flex-col p-2 text-[4px]">
                  <div className="h-full border border-gray-200"></div>
                </div>
                <span className="text-white text-xs">1</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-32 h-44 bg-white/80 shadow flex flex-col p-2 text-[4px]">
                  <div className="h-full border border-gray-200"></div>
                </div>
                <span className="text-gray-400 text-xs">2</span>
              </div>
            </div>
            
            {/* Main Viewer */}
            <div className="flex-1 overflow-auto bg-[#525659] p-8 flex justify-center custom-scrollbar">
              <div 
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }} 
                className="bg-white w-[700px] h-[990px] shadow-2xl p-16 flex flex-col text-black shrink-0"
              >
                <div className="flex justify-between text-[14px] font-serif mb-12">
                  <div className="text-center w-1/2">
                    <p className="font-bold">ĐẢNG BỘ BỘ NGOẠI GIAO</p>
                    <p className="font-bold">ĐẢNG ỦY CY-CNTT</p>
                    <p className="border-t border-black w-1/4 mx-auto mt-0.5 pt-0.5">*</p>
                    <p className="mt-1">Số: <span className="text-blue-700 font-bold">62</span> -KL/ĐU</p>
                  </div>
                  <div className="text-center w-1/2">
                    <p className="font-bold">ĐẢNG CỘNG SẢN VIỆT NAM</p>
                    <p className="border-t border-black w-2/3 mx-auto mt-0.5 pt-0.5 italic">Hà Nội, ngày 19 tháng 8 năm 2026</p>
                  </div>
                </div>
                
                <div className="text-center mb-8 font-serif">
                  <p className="font-bold text-[18px]">KẾT LUẬN</p>
                  <p className="font-bold text-[15px]">của Ban Chấp hành Đảng bộ Cục CY-CNTT</p>
                  <p className="text-[15px]">về việc kéo dài nhiệm kỳ đại hội của các chi bộ trực thuộc</p>
                  <p className="border-t border-black w-12 mx-auto mt-2"></p>
                </div>
                
                <div className="font-serif text-[15px] leading-relaxed text-justify">
                  <p className="indent-8 mb-2">
                    - Căn cứ Quy định số 208-QĐ/TW, ngày 26/7/2026 của Ban Chấp hành Trung
                    ương về thi hành Điều lệ Đảng; Hướng dẫn số 01-HD/TW, ngày 19/5/2026 của
                    Ban Bí thư về một số vấn đề cụ thể thi hành Điều lệ Đảng; Công văn số 2502-
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
          <button className="flex items-center px-4 py-2 bg-[#00bcd4] hover:bg-[#00acc1] text-white rounded text-[14px] font-semibold transition-colors">
            <PenTool className="w-4 h-4 mr-2" /> Kiểm tra chữ ký
          </button>
          <button onClick={onClose} className="flex items-center px-4 py-2 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[14px] font-semibold transition-colors">
            <X className="w-4 h-4 mr-1.5" /> Đóng
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
