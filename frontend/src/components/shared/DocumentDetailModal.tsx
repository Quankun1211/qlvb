"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search, Plus, FileText, ArrowDownToLine, FileDown, Paperclip, Loader2 } from "lucide-react";
import { PDFDetailModal, WordDetailModal } from "@/app/van-ban-den/[slug]/SharedModals";
import { fileNameUrl, incomingService } from "@/services/apiService";

interface DocumentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  documentId: number | null;
}

export default function DocumentDetailModal({ isOpen, title, onClose, documentId }: DocumentDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("cong-viec");
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<"pdf" | "word" | null>(null);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && documentId) {
      const fetchDocumentDetail = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const result = await incomingService.getDetail(documentId);
          setData(result);
        } catch (err: any) {
          console.error("Lỗi khi tải chi tiết văn bản:", err);
          setError(err.message || "Đã xảy ra lỗi.");
        } finally {
          setLoading(false);
        }
      };

      fetchDocumentDetail();
    } else {
      setData(null);
    }
  }, [isOpen, documentId]);

  if (!isOpen || !mounted) return null;

  const vb = data || {};
  const work = vb.works?.[0] || {};

  const handlePreviewFile = async (file: any) => {
    try {
      const fileNameStr = file?.fileName || file?.objectName || "";
      const response = await fileNameUrl.getFileName(fileNameStr);
      console.log(response);
      
      let finalUrl = "";
      if (response && typeof response === "object" && "ok" in response && response.ok) {
        const dataJson = await response.json();
        finalUrl = dataJson.url || dataJson;
      } else if (typeof response === "string") {
        finalUrl = response;
      } else if (response?.url) {
        finalUrl = response.url;
      } else {
        finalUrl = file?.fileUrl || (file?.objectName ? `/uploads/books/${file.objectName}` : fileNameStr);
      }

      const lowerName = fileNameStr.toLowerCase();
      if (lowerName.endsWith(".pdf") || finalUrl.toLowerCase().includes(".pdf")) {
        setPreviewFileType("pdf");
      } else {
        setPreviewFileType("word");
      }
      setPreviewFileUrl(finalUrl);
    } catch (err) {
      console.error(err);
      const fallbackUrl = file?.fileUrl || (file?.objectName ? `/uploads/books/${file.objectName}` : "");
      const lowerName = (file?.fileName || "").toLowerCase();
      if (lowerName.endsWith(".pdf")) {
        setPreviewFileType("pdf");
      } else {
        setPreviewFileType("word");
      }
      setPreviewFileUrl(fallbackUrl);
    }
  };

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40" onClick={onClose}>
          <div 
            className="bg-white shadow-2xl w-[1200px] max-w-[95vw] h-[95vh] flex flex-col rounded-sm overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 shrink-0">
              <h2 className="text-[18px] font-medium text-gray-800">Chi tiết văn bản đến</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar text-[13px] text-gray-900 bg-[#f9fafb] relative">
              
              {loading && (
                <div className="absolute inset-0 bg-white/70 z-50 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-[#0078d4]" />
                  <span className="text-gray-600 font-medium">Đang tải dữ liệu văn bản...</span>
                </div>
              )}

              {error && !loading && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <div className="text-red-600 font-semibold text-[14px]">{error}</div>
                  <button 
                    onClick={() => {
                      if (documentId) {
                        setLoading(true);
                        incomingService.getDetail(documentId)
                          .then((res) => setData(res))
                          .catch((err) => setError(err.message))
                          .finally(() => setLoading(false));
                      }
                    }}
                    className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-gray-800"
                  >
                    Thử lại
                  </button>
                </div>
              )}

              {!loading && !error && data && (
                <>
                  <div className="flex justify-end gap-2 mb-4">
                    <button className="flex items-center px-4 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors shadow-sm">
                      <Plus className="w-4 h-4 mr-1.5" /> Chuyển vào HSCV
                    </button>
                    <button className="flex items-center justify-center w-8 h-8 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded transition-colors shadow-sm">
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>

                  <fieldset className="border border-gray-300 rounded-sm mb-6 bg-white relative pt-4 pb-0 px-0">
                    <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">Thông tin văn bản</legend>
                    <div className="w-full">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr className="border-b border-gray-100">
                            <td className="py-2.5 px-4 font-bold text-gray-800 w-[15%]">Số ký hiệu</td>
                            <td className="py-2.5 px-4 w-[35%]">{vb.documentNumber}</td>
                            <td className="py-2.5 px-4 font-bold text-gray-800 w-[15%] border-l border-gray-100">Số đến</td>
                            <td className="py-2.5 px-4 w-[35%]">{vb.incomingNumber}</td>
                          </tr>
                          <tr className="border-b border-gray-100 bg-gray-50/50">
                            <td className="py-2.5 px-4 font-bold text-gray-800">Sổ công văn</td>
                            <td className="py-2.5 px-4">{vb.register}</td>
                            <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">Loại văn bản</td>
                            <td className="py-2.5 px-4">{vb.documentType}</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-2.5 px-4 font-bold text-gray-800">Ngày ban hành</td>
                            <td className="py-2.5 px-4">{vb.issuedDate}</td>
                            <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">Ngày đến</td>
                            <td className="py-2.5 px-4">{vb.receivedAt}</td>
                          </tr>
                          <tr className="border-b border-gray-100 bg-gray-50/50">
                            <td className="py-2.5 px-4 font-bold text-gray-800">Kèm văn bản giấy</td>
                            <td className="py-2.5 px-4">{vb.paperAttached}</td>
                            <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">Là VBPL</td>
                            <td className="py-2.5 px-4">{vb.legalDocument}</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-2.5 px-4 font-bold text-gray-800">Cơ quan BH</td>
                            <td className="py-2.5 px-4" colSpan={3}>{vb.issuingAgency}</td>
                          </tr>
                          <tr className="border-b border-gray-100 bg-gray-50/50">
                            <td className="py-2.5 px-4 font-bold text-gray-800">Trích yếu</td>
                            <td className="py-2.5 px-4" colSpan={3}>{vb.summary}</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-2.5 px-4 font-bold text-gray-800">Hạn trả lời</td>
                            <td className="py-2.5 px-4">{vb.responseDeadline}</td>
                            <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">Bằng số(ngày)</td>
                            <td className="py-2.5 px-4">{vb.responseDays}</td>
                          </tr>
                          <tr className="border-b border-gray-100 bg-gray-50/50">
                            <td className="py-2.5 px-4 font-bold text-gray-800">Độ mật</td>
                            <td className="py-2.5 px-4">{vb.securityLevel}</td>
                            <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">Độ khẩn</td>
                            <td className="py-2.5 px-4">{vb.urgencyLevel}</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold text-gray-800">File đính kèm</td>
                            <td className="py-3 px-4" colSpan={3}>
                              <div className="flex gap-4">
                                {Array.isArray(vb.attachments) && vb.attachments.length > 0 && (
                                  <button 
                                    onClick={() => alert('Đang tải xuống tất cả file đính kèm...')}
                                    className="w-7 h-7 bg-[#212529] hover:bg-[#343a40] text-white rounded flex items-center justify-center shrink-0 mt-0.5 shadow-sm"
                                    title="Tải xuống tất cả"
                                  >
                                    <ArrowDownToLine className="w-4 h-4" />
                                  </button>
                                )}
                                <div className="flex flex-col gap-1.5">
                                  {Array.isArray(vb.attachments) && vb.attachments.length > 0 ? (
                                    vb.attachments.map((file: any, idx: number) => {
                                      const fileName = file?.fileName || file?.objectName || "Tệp đính kèm";
                                      const fileUrl = file?.fileUrl || (file?.objectName ? `qlvb/uploads/books/${file.objectName}` : '#');
                                      return (
                                        <div key={idx} className="flex items-center gap-2 group">
                                          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-[#005fb8] hover:underline hover:text-blue-800 text-[13px] break-all">{fileName}</a>
                                          <span title="Xem trước file">
                                            <Search 
                                              className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0" 
                                              onClick={() => handlePreviewFile(file)}
                                            />
                                          </span>
                                          <span title="Tải xuống">
                                            <FileDown 
                                              className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0" 
                                              onClick={() => {
                                                if (fileUrl !== '#') {
                                                  window.open(fileUrl, '_blank');
                                                } else {
                                                  alert(`Đang tải file: ${fileName}`);
                                                }
                                              }}
                                            />
                                          </span>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <span className="text-gray-400 text-[13px]">Không có file đính kèm</span>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </fieldset>

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
                        {(!vb.opinions || vb.opinions.length === 0) ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-500 bg-gray-50/50">Không có dữ liệu</td>
                          </tr>
                        ) : (
                          vb.opinions.map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50/50">
                              <td className="py-2.5 px-3 text-center text-gray-900 border-r border-gray-200">{idx + 1}</td>
                              <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">{item.tenLanhDao}</td>
                              <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">{item.noiDung}</td>
                              <td className="py-2.5 px-3 text-center text-gray-900 border-r border-gray-200">{item.ngayChoYKien}</td>
                              <td className="py-2.5 px-3 text-center text-gray-900"></td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </fieldset>

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

                      {/* {activeTab === 'cong-viec' && (
                        <div className="w-full">
                          <table className="w-full border-collapse mb-6">
                            <tbody>
                              <tr className="border-b border-gray-100">
                                <td className="py-2.5 font-bold text-gray-800 w-[15%]">Tên công việc</td>
                                <td className="py-2.5" colSpan={3}>{vb.summary}</td>
                              </tr>
                              <tr className="border-b border-gray-100 bg-gray-50/50">
                                <td className="py-2.5 font-bold text-gray-800 w-[15%]">Người lập</td>
                                <td className="py-2.5 w-[35%]">{work.assignedByName}</td>
                                <td className="py-2.5 font-bold text-gray-800 w-[15%] pl-4">Hạn xử lý</td>
                                <td className="py-2.5 w-[35%]{work.dueAt}</td>
                              </tr>
                              <tr className="border-b border-gray-100">
                                <td className="py-2.5 font-bold text-gray-800">Đơn vị chủ trì</td>
                                <td className="py-2.5">{work.leadUnitName}</td>
                                <td className="py-2.5 font-bold text-gray-800 pl-4">Đơn vị phối hợp</td>
                                <td className="py-2.5"></td>
                              </tr>
                              <tr>
                                <td className="py-2.5 font-bold text-gray-800">Trạng thái</td>
                                <td className="py-2.5">
                                  <span className={`inline-block px-2.5 py-1 text-white rounded-[10px] text-[11px] font-medium ${work.status === 'UNPROCESSED' ? 'bg-[#6c757d]' : 'bg-[#007bff]'}`}>
                                    {work.status === 'UNPROCESSED' ? 'Chưa xử lý' : work.status}
                                  </span>
                                </td>
                                <td className="py-2.5 font-bold text-gray-800 pl-4 border-l border-gray-100">Cần phản hồi</td>
                                <td className="py-2.5">{vb.responseRequired ? 'Có' : 'Không'}</td>
                              </tr>
                            </tbody>
                          </table>

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
                                {vb.histories?.map((item: any, idx: number) => {
                                  const [datePart, timePart] = (item.createdAt || '').split('T');
                                  return (
                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50/50">
                                      <td className="py-2.5 px-4 text-center text-gray-600 border-r border-gray-200">
                                        {timePart?.substring(0, 5)}<br/>{datePart}
                                      </td>
                                      <td className="py-2.5 px-4 text-gray-800">{item.content}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </fieldset>
                        </div>
                      )} */}

                      {activeTab === 'toan-bo' && (
                        <div className="w-full">
                          <table className="w-full border-collapse">
                            <tbody>
                              <tr className="border-b border-gray-100">
                                <td className="py-2.5 font-bold text-gray-800 w-[15%]">Tên công việc</td>
                                <td className="py-2.5" colSpan={3}>{vb.summary}</td>
                              </tr>
                              <tr className="border-b border-gray-100 bg-gray-50/50">
                                <td className="py-2.5 font-bold text-gray-800 w-[15%]">Người lập</td>
                                <td className="py-2.5 w-[35%]">{work.assignedByName}</td>
                                <td className="py-2.5 font-bold text-gray-800 w-[15%] pl-4 border-l border-gray-100">Hạn xử lý</td>
                                <td className="py-2.5 w-[35%]">{work.dueAt}</td>
                              </tr>
                              <tr className="border-b border-gray-100">
                                <td className="py-2.5 font-bold text-gray-800 w-[15%]">Đơn vị chủ trì</td>
                                <td className="py-2.5">{work.leadUnitName}</td>
                                <td className="py-2.5 font-bold text-gray-800 pl-4 border-l border-gray-100">Đơn vị phối hợp</td>
                                <td className="py-2.5"></td>
                              </tr>
                              <tr className="border-b border-gray-100 bg-gray-50/50">
                                <td className="py-2.5 font-bold text-gray-800">File đính kèm</td>
                                <td className="py-2.5" colSpan={3}></td>
                              </tr>
                              <tr>
                                <td className="py-2.5 font-bold text-gray-800">Trạng thái</td>
                                <td className="py-2.5">
                                  <span className={`inline-block px-2.5 py-1 text-white rounded-[10px] text-[11px] font-medium ${work.status === 'UNPROCESSED' ? 'bg-[#6c757d]' : 'bg-[#007bff]'}`}>
                                    {work.status === 'UNPROCESSED' ? 'Chưa xử lý' : work.status}
                                  </span>
                                </td>
                                <td className="py-2.5 font-bold text-gray-800 pl-4 border-l border-gray-100">Cần phản hồi</td>
                                <td className="py-2.5">{vb.responseRequired ? 'Có' : 'Không'}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </fieldset>

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
                  </fieldset>
                </>
              )}

            </div>

            <div className="px-5 py-3 border-t border-gray-200 flex justify-end shrink-0 bg-white">
              <button onClick={onClose} className="flex items-center px-5 py-1.5 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-bold transition-colors">
                <X className="w-4 h-4 mr-1.5" /> Đóng
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {previewFileUrl && previewFileType === "pdf" && (
        <PDFDetailModal 
          fileName={previewFileUrl} 
          onClose={() => { setPreviewFileUrl(null); setPreviewFileType(null); }} 
        />
      )}
      {previewFileUrl && previewFileType === "word" && (
        <WordDetailModal 
          fileName={previewFileUrl} 
          onClose={() => { setPreviewFileUrl(null); setPreviewFileType(null); }} 
        />
      )}
    </>
  );
}