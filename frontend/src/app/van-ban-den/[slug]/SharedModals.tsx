import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search, Download, DownloadCloud, Menu, Minus, Plus, RotateCw, Maximize, Printer, MoreVertical, PenTool, ChevronDown } from "lucide-react";
import { incomingService } from "@/services/apiService";

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreview: (fileName: string) => void;
  attachments?: string[];
  documentId?: string | number | null;
}

export function AttachmentModal({ 
  isOpen, 
  onClose, 
  onPreview, 
  attachments = [], 
  documentId 
}: AttachmentModalProps) {
  const [mounted, setMounted] = useState(false);
  const [fileList, setFileList] = useState<string[]>(attachments);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    if (attachments && attachments.length > 0) {
      setFileList(attachments);
      return;
    }

    if (documentId) {
      const fetchDetail = async () => {
        setIsLoading(true);
        try {
          const res = await incomingService.getDetail(Number(documentId));
          if (res && res.attachments) {
            setFileList(res.attachments);
          } else {
            setFileList([]);
          }
        } catch (err) {
          console.error(err);
          setFileList([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetail();
    } else {
      setFileList([
        "cv_don_doc_nhac_viec_2508-c6a4ee7429e34568bf5a9ac2_2508.signed.pdf",
        "CV_Don_doc_nhac_viec_2508-c6a4ee7429e34568bf5a9ac23aa279de.docx"
      ]);
    }
  }, [isOpen, documentId, attachments]);

  if (!isOpen || !mounted) return null;

  const handlePreviewFile = async (file: string) => {
    try {
      const response = await fetch(`/api/auth/presigned-url?fileName=${encodeURIComponent(file)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          onPreview(data.url);
          return;
        }
      }
    } catch (err) {
      console.error(err);
    }
    onPreview(file);
  };

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
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#005fb8]"></div>
            </div>
          ) : (
            <table className="w-full border-collapse border border-gray-200 text-[13px]">
              <thead>
                <tr className="bg-white text-gray-800 border-b border-gray-200">
                  <th className="p-2 border-r border-gray-200 text-center font-bold">Tên file</th>
                  <th className="p-2 text-center font-bold w-24">Tải xuống</th>
                </tr>
              </thead>
              <tbody>
                {fileList.length > 0 ? (
                  fileList.map((file, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-2 border-r border-gray-200">
                        <div className="flex items-center">
                          <a href="#" onClick={(e) => { e.preventDefault(); handlePreviewFile(file); }} className="text-[#005fb8] hover:underline break-all mr-2 flex-1">
                            {file}
                          </a>
                          <button
                            onClick={() => handlePreviewFile(file)}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-4 text-center text-gray-500">
                      Không có file đính kèm nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
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

interface DocumentDetailModalProps {
  documentId: number | null;
  onClose: () => void;
  onPreviewAttachment: (fileName: string) => void;
}

export function DocumentDetailModal({ documentId, onClose, onPreviewAttachment }: DocumentDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!documentId) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await incomingService.getDetail(documentId);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [documentId]);

  if (!documentId || !mounted) return null;

  const handlePreviewFile = async (file: string) => {
    try {
      const response = await fetch(`/api/auth/presigned-url?fileName=${encodeURIComponent(file)}`);
      if (response.ok) {
        const dataJson = await response.json();
        if (dataJson.url) {
          onPreviewAttachment(dataJson.url);
          return;
        }
      }
    } catch (err) {
      console.error(err);
    }
    onPreviewAttachment(file);
  };

  const content = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-[95vw] h-[95vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800">Chi tiết văn bản đến</h2>
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors">
              Chuyển vào HSCV
            </button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[13px] text-gray-800 bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : data ? (
            <>
              <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 border-b pb-2 mb-3 text-sm">Thông tin văn bản</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-gray-500 block">Số ký hiệu</span>
                    <span className="font-semibold">{data.documentNumber || "-"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Số đến</span>
                    <span className="font-semibold">{data.incomingNumber || "-"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Sổ công văn</span>
                    <span className="font-semibold">{data.register || "Văn bản đến trong Bộ"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Loại văn bản</span>
                    <span className="font-semibold">{data.documentType || "Công văn"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Ngày ban hành</span>
                    <span className="font-semibold">{data.issuedDate || "-"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Ngày đến</span>
                    <span className="font-semibold">{data.receivedDate || "-"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Kèm văn bản giấy</span>
                    <span className="font-semibold">{data.paperAttached ? "Có" : "Không"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Là VBPL</span>
                    <span className="font-semibold">{data.legalDocument ? "Có" : "Không"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Cơ quan BH</span>
                    <span className="font-semibold">{data.issuingAgency || "-"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Hạn trả lời</span>
                    <span className="font-semibold">{data.responseDays ?? 0} ngày</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Độ mật</span>
                    <span className="font-semibold">{data.securityLevel || "Bình thường"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Độ khẩn</span>
                    <span className="font-semibold">{data.urgencyLevel || "Bình thường"}</span>
                  </div>
                  <div className="col-span-2 md:col-span-4">
                    <span className="text-gray-500 block">Trích yếu</span>
                    <span className="font-semibold">{data.summary || "-"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 border-b pb-2 mb-3 text-sm">File đính kèm</h3>
                {data.attachments && data.attachments.length > 0 ? (
                  <ul className="space-y-2">
                    {data.attachments.map((file: string, idx: number) => (
                      <li key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-100">
                        <a href="#" onClick={(e) => { e.preventDefault(); handlePreviewFile(file); }} className="text-blue-600 hover:underline">
                          {file}
                        </a>
                        <button onClick={() => alert(`Tải xuống: ${file}`)} className="text-gray-600 hover:text-blue-600 p-1">
                          <Download className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Không có file đính kèm.</p>
                )}
              </div>

              <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 border-b pb-2 mb-3 text-sm">Ý kiến</h3>
                {data.opinions && data.opinions.length > 0 ? (
                  <table className="w-full border-collapse border border-gray-200 text-left">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="p-2 border-r">STT</th>
                        <th className="p-2 border-r">Tên lãnh đạo</th>
                        <th className="p-2 border-r">Nội dung</th>
                        <th className="p-2">Ngày cho ý kiến</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.opinions.map((op: any, i: number) => (
                        <tr key={i} className="border-b">
                          <td className="p-2 border-r">{i + 1}</td>
                          <td className="p-2 border-r">{op.leaderName || "-"}</td>
                          <td className="p-2 border-r">{op.content || "-"}</td>
                          <td className="p-2">{op.createdAt || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">Chưa có ý kiến nào.</p>
                )}
              </div>

              <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 border-b pb-2 mb-3 text-sm">Thông tin công việc</h3>
                {data.works && data.works.length > 0 ? (
                  data.works.map((work: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
                      <div>
                        <span className="text-gray-500 block">Trạng thái</span>
                        <span className="font-semibold">{work.status || "-"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Đơn vị chủ trì</span>
                        <span className="font-semibold">{work.leadUnitName || "-"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Hạn xử lý</span>
                        <span className="font-semibold">{work.dueAt || "-"}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Không có thông tin công việc.</p>
                )}
              </div>

              <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 border-b pb-2 mb-3 text-sm">Luân chuyển/Xử lý văn bản</h3>
                {data.histories && data.histories.length > 0 ? (
                  <div className="space-y-3">
                    {data.histories.map((hist: any, i: number) => (
                      <div key={i} className="flex flex-col border-l-2 border-blue-500 pl-3 py-1">
                        <span className="text-gray-400 text-xs">{hist.createdAt}</span>
                        <span className="font-medium text-gray-900">{hist.content}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Không có lịch sử luân chuyển.</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Không tìm thấy thông tin văn bản.</p>
          )}
        </div>

        <div className="px-6 py-3 border-t border-gray-200 bg-white flex justify-end">
          <button onClick={onClose} className="flex items-center px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded text-[14px] font-semibold transition-colors">
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
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-800">Chi tiết file: {fileName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 bg-[#e1dfdd] p-2 sm:p-4 overflow-hidden flex flex-col items-center">
          <div className="bg-white w-[1000px] max-w-full h-full shadow-md border border-gray-300 flex flex-col relative overflow-hidden">
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
                    <p>- Cục Cơ yếu-Công nghệ thông tin</p>
                  </div>
                  <p className="indent-8">
                    Thực hiện chỉ đạo về tăng cường công tác đôn đốc, nhắc việc,
                    Văn phòng Bộ xin gửi các đơn vị danh mục các nhiệm vụ quá hạn, sắp đến hạn.
                  </p>
                </div>
              </div>
            </div>

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
                      <ChevronDown className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
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

interface PDFDetailModalProps {
  fileName: string | null;
  onClose: () => void;
}

export function PDFDetailModal({ fileName, onClose }: PDFDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  if (!fileName || !mounted) return null;

  const fileUrl = fileName.startsWith('http') ? fileName : `/uploads/books/${fileName}`;

  const content = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-[95vw] h-[95vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 bg-white shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Chi tiết file</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 bg-[#525659] flex flex-col overflow-hidden">
          <iframe
            src={fileUrl}
            title="Preview"
            className="w-full h-full border-0"
          />
        </div>

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