"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, UserPlus, X } from "lucide-react";
import { draftService, masterDataService } from "@/services/apiService";

interface ThemMoiDuThaoModalProps { isOpen: boolean; onClose: () => void; onSuccess?: () => void; }
interface DocumentType { id: number; name: string; }
interface StaffMember { id: number; name: string; account: string; }
interface Department { id: number; name: string; users: StaffMember[]; }
interface RoutingUnit { id: number; name: string; departments: Department[]; }
type ReceiverType = "PD_TT" | "NK" | null;
interface Receiver extends StaffMember { type: ReceiverType; }

const CYTT_UNIT_ID = 2;
const USER_PAGE_SIZE = 10;

export default function ThemMoiDuThaoModal({ isOpen, onClose, onSuccess }: ThemMoiDuThaoModalProps) {
  const [mounted, setMounted] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [routingUnit, setRoutingUnit] = useState<RoutingUnit | null>(null);
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState("");
  const [subject, setSubject] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [searchUserStr, setSearchUserStr] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [isTreeExpanded, setIsTreeExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setIsLoading(true);
    Promise.all([masterDataService.getDocumentTypes(), masterDataService.getUnitDepartmentsWithUsers(CYTT_UNIT_ID)])
      .then(([types, unit]) => {
        if (cancelled) return;
        const nextUnit = unit as RoutingUnit;
        setDocumentTypes(types as DocumentType[]);
        setRoutingUnit(nextUnit);
        setSelectedDepartmentId(nextUnit.departments[0]?.id ?? null);
        setSelectedDocumentTypeId("");
        setSubject("");
        setUploadedFiles([]);
        setReceivers([]);
        setSearchUserStr("");
        setUserPage(1);
      })
      .catch((error: Error) => alert(error.message || "Không thể tải dữ liệu cho biểu mẫu."))
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [isOpen]);

  const selectedDepartment = routingUnit?.departments.find(department => department.id === selectedDepartmentId);
  const filteredUsers = useMemo(() => (selectedDepartment?.users ?? []).filter(user => user.name.toLocaleLowerCase().includes(searchUserStr.toLocaleLowerCase())), [selectedDepartment, searchUserStr]);
  const totalUserPages = Math.max(1, Math.ceil(filteredUsers.length / USER_PAGE_SIZE));
  const paginatedUsers = filteredUsers.slice((userPage - 1) * USER_PAGE_SIZE, userPage * USER_PAGE_SIZE);

  const selectDepartment = (departmentId: number) => { setSelectedDepartmentId(departmentId); setSearchUserStr(""); setUserPage(1); };
  const addReceiver = (user: StaffMember) => setReceivers(current => current.some(receiver => receiver.id === user.id) ? current : [...current, { ...user, type: null }]);
  const removeReceiver = (userId: number) => setReceivers(current => current.filter(receiver => receiver.id !== userId));
  const toggleReceiverType = (userId: number, type: Exclude<ReceiverType, null>) => setReceivers(current => current.map(receiver => receiver.id === userId ? { ...receiver, type: receiver.type === type ? null : type } : receiver));

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedFiles(current => [...current, ...Array.from(event.target.files ?? [])]);
    event.target.value = "";
  };

  const handleSave = async (actionType: "SAVE_DRAFT" | "SUBMIT" | "REQUEST_OPINION") => {
    if (!selectedDocumentTypeId || !subject.trim()) { alert("Vui lòng chọn loại văn bản và nhập trích yếu."); return; }
    if (receivers.some(receiver => receiver.type === null)) { alert("Vui lòng chọn PD/TT hoặc NK cho mỗi cán bộ đã thêm."); return; }
    setIsSaving(true);
    try {
      await draftService.create({ documentTypeId: Number(selectedDocumentTypeId), subject: subject.trim(), recipients: receivers.map(receiver => ({ userId: receiver.id, recipientType: receiver.type })) }, uploadedFiles, actionType);
      const message = actionType === "SUBMIT" ? "Đã lưu và trình ký dự thảo." : actionType === "REQUEST_OPINION" ? "Đã lưu và gửi xin ý kiến." : "Đã lưu dự thảo thành công.";
      alert(message);
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Không thể lưu dự thảo.");
    } finally { setIsSaving(false); }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-[900px] flex flex-col max-h-[90vh] overflow-hidden" onClick={event => event.stopPropagation()}>
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
          <h2 className="text-[16px] font-bold text-gray-800">Thêm mới dự thảo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500" aria-label="Đóng"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar text-[13px]">
          <div className="flex flex-col gap-4">
            <div className="flex items-start">
              <label className="w-[150px] font-bold text-gray-800 pt-1.5">Loại văn bản<span className="text-red-500">*</span></label>
              <select value={selectedDocumentTypeId} onChange={event => setSelectedDocumentTypeId(event.target.value)} disabled={isLoading} className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:border-blue-500 focus:outline-none text-gray-900 disabled:bg-gray-100">
                <option value="">--Chọn loại văn bản--</option>{documentTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
              </select>
            </div>
            <div className="flex items-start">
              <label className="w-[150px] font-bold text-gray-800 pt-1.5">Trích yếu<span className="text-red-500">*</span></label>
              <textarea value={subject} onChange={event => setSubject(event.target.value)} placeholder="Nhập trích yếu" disabled={isLoading} className="flex-1 border border-gray-300 rounded px-3 py-2 min-h-[80px] focus:border-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-500 resize-y disabled:bg-gray-100" />
            </div>
            <div className="flex items-start">
              <label className="w-[150px] font-bold text-gray-800 pt-1.5">Chọn văn bản dự thảo</label>
              <div className="flex-1 flex flex-col gap-2">
                <div className="border border-dashed border-blue-400 rounded-sm bg-blue-50/30 p-6 flex flex-col items-center justify-center text-center">
                  <input ref={fileInputRef} type="file" id="file-upload-draft" onChange={handleFileUpload} className="hidden" multiple accept=".doc,.docx,.pdf,.xls,.xlsx,.zip,.rar,.7z" />
                  <p className="text-gray-900 text-[13px] mb-1">Kéo file vào đây để tải lên, hoặc <button type="button" onClick={() => fileInputRef.current?.click()} className="text-blue-600 hover:underline">Tải lên</button></p>
                  <p className="text-gray-600 text-[11px] italic">Chỉ hỗ trợ: .doc, .docx, .pdf, .xls, .xlsx, .zip, .rar, .7z</p>
                </div>
                {uploadedFiles.length > 0 && <div className="bg-gray-50 border border-gray-200 rounded p-2 flex flex-col gap-1.5">{uploadedFiles.map((file, index) => <div key={`${file.name}-${index}`} className="flex justify-between items-center text-[12px] bg-white border border-gray-200 px-2 py-1.5 rounded"><span className="text-gray-900 font-medium truncate max-w-[400px]" title={file.name}>{file.name}</span><button onClick={() => setUploadedFiles(current => current.filter((_, fileIndex) => fileIndex !== index))} className="text-red-500 hover:text-red-700" aria-label={`Xóa ${file.name}`}><X className="w-3.5 h-3.5" /></button></div>)}</div>}
              </div>
            </div>
            <div>
              <label className="font-bold text-gray-800 block mb-2">Luồng trình văn bản</label>
              <div className="flex border border-gray-300 rounded min-h-[250px]">
                <div className="w-[28%] border-r border-gray-300 p-2 overflow-y-auto">
                  <button type="button" className="flex items-center text-blue-600 font-bold mb-1 text-left" onClick={() => setIsTreeExpanded(current => !current)}>{isTreeExpanded ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />} 📁 {routingUnit?.name ?? "Đang tải đơn vị..."}</button>
                  {isTreeExpanded && <div className="pl-6 text-gray-900 space-y-1">{routingUnit?.departments.map(department => <button type="button" key={department.id} onClick={() => selectDepartment(department.id)} className={`w-full flex items-center py-0.5 text-left hover:bg-gray-100 ${selectedDepartmentId === department.id ? "bg-blue-50 font-medium" : ""}`}><span className="w-3 h-3 bg-yellow-400 mr-1.5 rounded-sm" />{department.name}</button>)}</div>}
                </div>
                <div className="w-[36%] border-r border-gray-300 flex flex-col text-gray-900">
                  <div className="p-2 border-b border-gray-200"><input type="text" placeholder="Nhập từ khóa tìm kiếm" value={searchUserStr} onChange={event => { setSearchUserStr(event.target.value); setUserPage(1); }} className="w-full border border-gray-300 rounded px-2 py-1 text-[12px] focus:border-blue-500 focus:outline-none placeholder:text-gray-500" /></div>
                  <div className="flex justify-between items-center px-3 py-1.5 bg-gray-50 border-b border-gray-200 font-bold"><span>Danh sách cán bộ</span><span>{filteredUsers.length}</span></div>
                  <div className="overflow-y-auto flex-1">{paginatedUsers.map(user => { const isAdded = receivers.some(receiver => receiver.id === user.id); return <div key={user.id} className={`flex justify-between items-center px-3 py-2 border-b border-gray-100 ${isAdded ? "bg-blue-50/50" : "hover:bg-gray-50"}`}><span>{user.name}</span><button onClick={() => addReceiver(user)} disabled={isAdded} className={isAdded ? "text-gray-300" : "text-gray-600 hover:text-blue-600"} aria-label={`Thêm ${user.name}`}><UserPlus className="w-4 h-4" /></button></div>; })}{!isLoading && paginatedUsers.length === 0 && <p className="p-3 text-gray-500">Chưa có cán bộ trong danh mục này.</p>}</div>
                  <div className="p-2 border-t border-gray-200 flex items-center justify-between bg-gray-50 text-[11px]"><div className="flex items-center gap-1"><button onClick={() => setUserPage(1)} disabled={userPage === 1} className="p-1 border border-gray-300 bg-white rounded disabled:opacity-50"><ChevronsLeft className="w-3 h-3" /></button><button onClick={() => setUserPage(page => Math.max(1, page - 1))} disabled={userPage === 1} className="p-1 border border-gray-300 bg-white rounded disabled:opacity-50"><ChevronLeft className="w-3 h-3" /></button><span className="px-2 font-medium">{userPage}/{totalUserPages}</span><button onClick={() => setUserPage(page => Math.min(totalUserPages, page + 1))} disabled={userPage === totalUserPages} className="p-1 border border-gray-300 bg-white rounded disabled:opacity-50"><ChevronRight className="w-3 h-3" /></button><button onClick={() => setUserPage(totalUserPages)} disabled={userPage === totalUserPages} className="p-1 border border-gray-300 bg-white rounded disabled:opacity-50"><ChevronsRight className="w-3 h-3" /></button></div><span>{filteredUsers.length === 0 ? "0" : `${(userPage - 1) * USER_PAGE_SIZE + 1}-${Math.min(filteredUsers.length, userPage * USER_PAGE_SIZE)} / ${filteredUsers.length}`}</span></div>
                </div>
                <div className="w-[36%] p-2 flex flex-col text-gray-900"><div className="border border-gray-300 max-h-[300px] overflow-y-auto"><table className="w-full text-[12px] border-collapse"><thead><tr className="border-b border-gray-300 bg-gray-50 sticky top-0"><th className="py-1 px-2 text-left border-r border-gray-300">Danh sách nhận văn bản</th><th className="py-1 px-1 border-r border-gray-300 w-[15%]">PD/TT</th><th className="py-1 px-1 border-r border-gray-300 w-[15%]">NK</th><th className="w-[12%]" /></tr></thead><tbody>{receivers.map(receiver => <tr key={receiver.id} className="border-b border-gray-200 hover:bg-gray-50"><td className="py-1.5 px-2 border-r border-gray-200">{receiver.name}</td><td className="py-1.5 px-1 border-r border-gray-200 text-center"><input type="checkbox" checked={receiver.type === "PD_TT"} onChange={() => toggleReceiverType(receiver.id, "PD_TT")} /></td><td className="py-1.5 px-1 border-r border-gray-200 text-center"><input type="checkbox" checked={receiver.type === "NK"} onChange={() => toggleReceiverType(receiver.id, "NK")} /></td><td className="py-1.5 px-1 text-center"><button onClick={() => removeReceiver(receiver.id)} className="text-red-500 hover:text-red-700" aria-label={`Xóa ${receiver.name}`}><X className="w-3.5 h-3.5 mx-auto" /></button></td></tr>)}</tbody></table></div></div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2 shrink-0">
          <button onClick={() => handleSave("SUBMIT")} disabled={isSaving || isLoading} className="flex items-center px-4 py-2 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold disabled:opacity-50">{isSaving ? "Đang lưu..." : "Lưu lại và Trình ký"}</button>
          <button onClick={() => handleSave("REQUEST_OPINION")} disabled={isSaving || isLoading} className="flex items-center px-4 py-2 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold disabled:opacity-50">{isSaving ? "Đang lưu..." : "Lưu lại và Xin ý kiến"}</button>
          <button onClick={() => handleSave("SAVE_DRAFT")} disabled={isSaving || isLoading} className="flex items-center px-4 py-2 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold disabled:opacity-50">{isSaving ? "Đang lưu..." : "Lưu lại"}</button>
          <button onClick={onClose} disabled={isSaving} className="flex items-center px-4 py-2 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-semibold disabled:opacity-50">Đóng</button>
        </div>
      </div>
    </div>, document.body,
  );
}
