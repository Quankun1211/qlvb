import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { masterDataService, submissionService } from "@/services/apiService";

interface ThemMoiVanBanTrinhModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ThemMoiVanBanTrinhModal({ isOpen, onClose, onSuccess }: ThemMoiVanBanTrinhModalProps) {
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [users, setUsers] = useState<any[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submissionForm, setSubmissionForm] = useState({
    kinhGuiId: "",
    vanDeTrinh: "",
    tomTatNoiDung: ""
  });

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      masterDataService.getUsers().then(setUsers).catch(console.error);
      // Reset form
      setSubmissionForm({
        kinhGuiId: "",
        vanDeTrinh: "",
        tomTatNoiDung: ""
      });
      setAttachedFiles([]);
      setFormErrors(false);
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleSaveSubmission = async (action: string) => {
    if (!submissionForm.kinhGuiId || !submissionForm.vanDeTrinh) {
      setFormErrors(true);
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Map action sang actionType backend hiểu
      const actionTypeMap: Record<string, string> = {
        'Trình ký':   'SUBMIT',
        'Xin ý kiến': 'REQUEST_OPINION',
        'Lưu lại':    'SAVE_DRAFT',
      };
      const actionType = actionTypeMap[action] ?? 'SAVE_DRAFT';

      // Map sang SubmissionCreateRequest DTO
      const payload = {
        subject:        submissionForm.vanDeTrinh,
        target:         submissionForm.vanDeTrinh,   // dùng tạm cùng subject nếu chưa có field riêng
        targetLeaderId: Number(submissionForm.kinhGuiId),
        // content (rich text) — backend chưa có field này trong DTO, lưu vào target tạm thời
        // hoặc bỏ qua nếu backend reject
      };

      await submissionService.create(payload, actionType);

      alert(`Đã ${action} thành công!`);
      onSuccess();  // trigger reload danh sách
      onClose();
    } catch (err: any) {
      // Retrying a failed response parse can create the same submission twice.
      alert(err.message || "Không thể lưu văn bản trình.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded shadow-xl w-[900px] max-h-[95vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 shrink-0">
          <h2 className="text-[14px] font-bold text-gray-800">Thêm mới văn bản trình</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar text-[13px] text-gray-900">
          <div className="flex justify-between items-start mb-6">
            <div className="text-center font-bold">
              <div className="text-[12px]">BỘ NGOẠI GIAO</div>
              <div className="text-[12px]"><span className="font-normal italic">Đơn vị: </span>Cục Cơ yếu-Công nghệ thông tin</div>
              <div className="mt-1 flex items-center justify-center gap-1 text-[12px]">
                <span className="font-normal italic">Số:</span>
                <div className="border-b border-black w-[50px]"></div>
                <span>/</span>
                <div className="border-b border-black min-w-[70px]">TTr-CYTT</div>
              </div>
            </div>
            <div className="italic mt-1 text-[12px]">
              Hà Nội, Ngày <span className="ml-2">Tháng</span> <span className="ml-2">Năm 2026</span>
            </div>
          </div>
          
          <div className="text-center font-bold uppercase text-[14px] mb-6">TỜ TRÌNH GIẢI QUYẾT CÔNG VIỆC</div>
          
          <div className="flex flex-col gap-5 mb-6">
            <div className="flex items-start gap-4">
              <div className="italic w-[120px] text-right mt-1 shrink-0">Kính gửi:</div>
              <div className="flex-1 flex flex-col gap-0.5">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">Lãnh đạo Bộ</span>
                  <select 
                    value={submissionForm.kinhGuiId}
                    onChange={e => setSubmissionForm({...submissionForm, kinhGuiId: e.target.value})}
                    className={`border ${formErrors && !submissionForm.kinhGuiId ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1 text-[13px] text-gray-800 focus:outline-none focus:border-[#005fb8] min-w-[220px]`}
                  >
                    <option value="">Chọn lãnh đạo</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                  {formErrors && !submissionForm.kinhGuiId && (
                    <div className="w-3.5 h-3.5 rounded-full border border-red-500 flex items-center justify-center text-red-500 text-[10px] font-bold">!</div>
                  )}
                </div>
                {formErrors && !submissionForm.kinhGuiId && (
                  <div className="text-red-500 text-[11px] ml-24 pl-1">Vui lòng chọn lãnh đạo kính gửi!</div>
                )}
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="italic w-[120px] text-right mt-1 shrink-0">Vấn đề trình:</div>
              <div className="flex-1 relative max-w-[500px]">
                <textarea 
                  rows={2} 
                  placeholder="Nhập vấn đề trình"
                  value={submissionForm.vanDeTrinh}
                  onChange={e => setSubmissionForm({...submissionForm, vanDeTrinh: e.target.value})}
                  className={`w-full border-b ${formErrors && !submissionForm.vanDeTrinh ? 'border-red-500' : 'border-gray-300'} border-x-0 border-t-0 bg-transparent px-1 py-0.5 focus:ring-0 focus:border-[#005fb8] resize-none placeholder:text-gray-400 text-[13px]`}
                />
                {formErrors && !submissionForm.vanDeTrinh && (
                  <>
                    <div className="absolute -right-6 top-1 w-3.5 h-3.5 rounded-full border border-red-500 flex items-center justify-center text-red-500 text-[10px] font-bold">!</div>
                    <div className="text-red-500 text-[11px] mt-0.5">Vui lòng nhập vấn đề trình!</div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <table className="w-full border-collapse border border-black text-center text-[12px]">
            <tbody>
              <tr>
                <td className="w-[65%] border border-black bg-[#e9ecef] font-bold p-2 uppercase">
                  Tóm tắt nội dung và kiến nghị
                </td>
                <td colSpan={2} className="w-[35%] border border-black bg-[#e9ecef] font-bold p-2 uppercase">
                  Ý kiến chỉ đạo của Bộ trưởng
                </td>
              </tr>
              <tr>
                <td className="border border-black p-0 align-top text-left relative flex-col flex h-[380px]">
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 px-2 py-1 border-b border-gray-300 bg-gray-50 shrink-0 flex-wrap">
                    <button type="button" onMouseDown={e => { e.preventDefault(); document.execCommand('bold'); }}
                      className="px-2 py-0.5 font-bold text-[13px] hover:bg-gray-200 rounded" title="Bold">B</button>
                    <button type="button" onMouseDown={e => { e.preventDefault(); document.execCommand('italic'); }}
                      className="px-2 py-0.5 italic text-[13px] hover:bg-gray-200 rounded" title="Italic">I</button>
                    <button type="button" onMouseDown={e => { e.preventDefault(); document.execCommand('underline'); }}
                      className="px-2 py-0.5 underline text-[13px] hover:bg-gray-200 rounded" title="Underline">U</button>
                    <button type="button" onMouseDown={e => { e.preventDefault(); document.execCommand('strikeThrough'); }}
                      className="px-2 py-0.5 line-through text-[13px] hover:bg-gray-200 rounded" title="Strike">S</button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <button type="button" onMouseDown={e => { e.preventDefault(); document.execCommand('insertUnorderedList'); }}
                      className="px-2 py-0.5 text-[12px] hover:bg-gray-200 rounded" title="Danh sách">• List</button>
                    <button type="button" onMouseDown={e => { e.preventDefault(); document.execCommand('insertOrderedList'); }}
                      className="px-2 py-0.5 text-[12px] hover:bg-gray-200 rounded" title="Danh sách số">1. List</button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <button type="button" onMouseDown={e => { e.preventDefault(); document.execCommand('justifyLeft'); }}
                      className="px-2 py-0.5 text-[11px] hover:bg-gray-200 rounded" title="Căn trái">≡L</button>
                    <button type="button" onMouseDown={e => { e.preventDefault(); document.execCommand('justifyCenter'); }}
                      className="px-2 py-0.5 text-[11px] hover:bg-gray-200 rounded" title="Căn giữa">≡C</button>
                    <button type="button" onMouseDown={e => { e.preventDefault(); document.execCommand('justifyRight'); }}
                      className="px-2 py-0.5 text-[11px] hover:bg-gray-200 rounded" title="Căn phải">≡R</button>
                  </div>
                  {/* Editor */}
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    className="flex-1 p-2 text-[13px] text-gray-900 overflow-y-auto outline-none"
                    style={{ minHeight: '300px' }}
                    onInput={e => setSubmissionForm(f => ({...f, tomTatNoiDung: (e.target as HTMLDivElement).innerHTML}))}
                    dangerouslySetInnerHTML={{ __html: submissionForm.tomTatNoiDung }}
                  ></div>
                </td>
                <td colSpan={2} className="border border-black p-0 align-top">
                  <div className="flex flex-col h-full min-h-[380px]">
                    <div className="flex-1"></div>
                    <div className="bg-white font-bold p-2 uppercase border-y border-black">
                      Giải quyết của<br/>Lãnh đạo bộ
                    </div>
                    <div className="flex-1"></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 align-top text-center relative">
                  <div className="font-bold inline-flex items-center gap-1.5 mt-2">
                    Hồ sơ kèm theo 
                    <span 
                      onClick={() => fileInputRef.current?.click()} 
                      className="cursor-pointer hover:opacity-70 transition-opacity ml-1"
                      title="Đính kèm tệp (.zip, .pdf, .doc)"
                    >
                      ✏️
                    </span>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={(e) => {
                      if (e.target.files) setAttachedFiles(Array.from(e.target.files));
                    }} 
                    className="hidden" 
                    multiple 
                    accept=".zip,.pdf,.doc,.docx" 
                  />
                  {attachedFiles.length > 0 && (
                    <div className="mt-2 text-[11px] text-left px-2 font-normal text-blue-600">
                      {attachedFiles.map((f, idx) => (
                        <div key={idx} className="truncate">{f.name}</div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="w-[17.5%] border border-black p-2 align-top text-center h-[140px] relative">
                  <div className="font-bold">Cơ yếu</div>
                  <div className="font-bold absolute bottom-2 w-full left-0 text-center">Lê Nhật Minh</div>
                </td>
                <td className="w-[17.5%] border border-black p-2 align-top text-center h-[140px] relative">
                  <div className="font-bold">Cục trưởng</div>
                  <div className="font-bold absolute bottom-2 w-full left-0 text-center">Vũ Tiến Dũng</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2 flex justify-end gap-1.5 shrink-0 bg-white border-t border-gray-200">
          <button disabled={isSubmitting} onClick={() => handleSaveSubmission('Trình ký')} className="px-3 py-1.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white rounded text-[12px] font-medium transition-colors disabled:opacity-50">
            + Lưu lại và Trình ký
          </button>
          <button disabled={isSubmitting} onClick={() => handleSaveSubmission('Xin ý kiến')} className="px-3 py-1.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white rounded text-[12px] font-medium transition-colors disabled:opacity-50">
            + Lưu lại và Xin ý kiến
          </button>
          <button disabled={isSubmitting} onClick={() => handleSaveSubmission('Lưu lại')} className="px-3 py-1.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white rounded text-[12px] font-medium transition-colors disabled:opacity-50">
            + Lưu lại
          </button>
          <button disabled={isSubmitting} onClick={onClose} className="px-3 py-1.5 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[12px] font-medium transition-colors disabled:opacity-50">
            x Đóng
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
