"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown, ChevronRight, UserPlus, ChevronsLeft, ChevronLeft, ChevronsRight } from "lucide-react";

interface ThemMoiDuThaoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemMoiDuThaoModal({ isOpen, onClose }: ThemMoiDuThaoModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isTreeExpanded, setIsTreeExpanded] = useState(true);
  const [selectedDept, setSelectedDept] = useState("Lãnh đạo đơn vị");
  const [searchUserStr, setSearchUserStr] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(10);

  type Receiver = { name: string, type: "PD/TT" | "NK" | null };
  const [receivers, setReceivers] = useState<Receiver[]>([]);

  const mockDeptUsers: Record<string, string[]> = {
    "Lãnh đạo đơn vị": ["Vũ Tiến Dũng", "Đỗ Mai Thanh", "Hồ Sỹ An", "Nguyễn Đăng Lâm", "Lãnh Đạo CYTT", "Nguyễn Như Trung", "Nguyễn Văn Tiến", "Trần Hữu Dũng"],
    "Phòng Quản lý hệ thống": ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"],
    "Phòng Nghiên cứu ứng dụng": ["Phạm Văn D", "Hoàng Thị E"],
    "Phòng Quản lý kỹ thuật": ["Trịnh Văn F", "Lý Thị G"],
    "Phòng Tổ chức - Tổng hợp": ["Đào Văn H", "Đinh Thị I"],
    "Phòng Mã dịch - Truyền thông": ["Vương Văn K", "Đoàn Thị L"],
    "Phòng Bảo mật và An toàn": ["Đỗ Văn M", "Lâm Thị N"],
    "Phòng Điện báo": ["Ngô Văn P", "Bùi Thị Q"],
    "Chi Đoàn thanh niên": ["Lê Văn R"],
    "Ban Đời sống": ["Trần Văn S"]
  };

  const currentDeptUsers = (mockDeptUsers[selectedDept] || []).filter(u => u.toLowerCase().includes(searchUserStr.toLowerCase()));
  const totalUserPages = Math.max(1, Math.ceil(currentDeptUsers.length / userPageSize));
  const paginatedDeptUsers = currentDeptUsers.slice((userPage - 1) * userPageSize, userPage * userPageSize);

  const addReceiver = (name: string) => {
    if (!receivers.find(r => r.name === name)) {
      setReceivers([...receivers, { name, type: null }]);
    }
  };

  const removeReceiver = (name: string) => {
    setReceivers(receivers.filter(r => r.name !== name));
  };

  const toggleReceiverType = (name: string, type: "PD/TT" | "NK") => {
    setReceivers(receivers.map(r => r.name === name ? { ...r, type: r.type === type ? null : type } : r));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-[900px] flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
          <h2 className="text-[16px] font-bold text-gray-800">Thêm mới dự thảo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar text-[13px]">
          <div className="flex flex-col gap-4">
            <div className="flex items-start">
              <label className="w-[150px] font-bold text-gray-800 pt-1.5">Loại văn bản</label>
              <select className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:border-blue-500 focus:outline-none text-gray-900">
                <option value="">--Chọn loại văn bản--</option>
                <option value="Công văn">Công văn</option>
                <option value="Công điện">Công điện</option>
                <option value="Điều lệ Đảng">Điều lệ Đảng</option>
                <option value="Công hàm">Công hàm</option>
                <option value="Phiếu gửi">Phiếu gửi</option>
                <option value="Tờ trình">Tờ trình</option>
                <option value="Báo cáo">Báo cáo</option>
                <option value="Kết luận">Kết luận</option>
                <option value="Quyết định">Quyết định</option>
                <option value="Giấy mời">Giấy mời</option>
                <option value="Quy định">Quy định</option>
                <option value="Thông tri">Thông tri</option>
                <option value="Thông báo">Thông báo</option>
                <option value="Bản tin">Bản tin</option>
                <option value="Đề án">Đề án</option>
                <option value="Xin ý kiến nội bộ">Xin ý kiến nội bộ</option>
                <option value="Thông cáo">Thông cáo</option>
                <option value="Tuyên bố">Tuyên bố</option>
                <option value="Chiến lược">Chiến lược</option>
              </select>
            </div>

            <div className="flex items-start">
              <label className="w-[150px] font-bold text-gray-800 pt-1.5">Trích yếu<span className="text-red-500">*</span></label>
              <textarea
                placeholder="Nhập trích yếu"
                className="flex-1 border border-gray-300 rounded px-3 py-2 min-h-[80px] focus:border-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-700 resize-y"
              ></textarea>
            </div>

            <div className="flex items-start">
              <label className="w-[150px] font-bold text-gray-800 pt-1.5">Chọn văn bản dự thảo</label>
              <div className="flex-1 flex flex-col gap-2">
                <div className="border border-dashed border-blue-400 rounded-sm bg-blue-50/30 p-6 flex flex-col items-center justify-center text-center relative">
                  <input type="file" id="file-upload-dt" onChange={handleFileUpload} className="hidden" multiple accept=".doc,.docx,.pdf,.xls,.xlsx,.zip,.rar,.7z" />
                  <p className="text-gray-900 text-[13px] mb-1">
                    Kéo file vào đây để tải lên, hoặc <label htmlFor="file-upload-dt" className="text-blue-600 cursor-pointer hover:underline">Tải lên</label> hoặc <span className="text-blue-600 cursor-pointer hover:underline">Scan</span>
                  </p>
                  <p className="text-gray-900 text-[11px] italic">
                    Chỉ hỗ trợ các đuôi: .doc, .docx, .pdf, .xls, .xlsx, .zip, .rar, .7z
                  </p>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded p-2 flex flex-col gap-1.5">
                    {uploadedFiles.map((f, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[12px] bg-white border border-gray-200 px-2 py-1.5 rounded">
                        <span className="text-gray-900 font-medium truncate max-w-[400px]" title={f.name}>{f.name}</span>
                        <button onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700 font-bold" title="Xóa file">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-2">Luồng trình văn bản</label>
              <div className="flex border border-gray-300 rounded min-h-[250px]">
                {/* Tree View */}
                <div className="w-[28%] border-r border-gray-300 p-2 overflow-y-auto">
                  <div className="flex items-center text-blue-600 font-bold mb-1 cursor-pointer" onClick={() => setIsTreeExpanded(!isTreeExpanded)}>
                    {isTreeExpanded ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />} 📁 Cục Cơ yếu-Công nghệ t...
                  </div>
                  {isTreeExpanded && (
                    <div className="pl-6 text-gray-900 space-y-1">
                      {Object.keys(mockDeptUsers).map(dept => (
                        <div
                          key={dept}
                          onClick={() => {
                            setSelectedDept(dept);
                            setUserPage(1);
                          }}
                          className={`flex items-center py-0.5 cursor-pointer hover:bg-gray-100 ${selectedDept === dept ? 'bg-blue-50 font-medium' : ''}`}
                        >
                          <div className="w-3 h-3 bg-yellow-400 mr-1.5 rounded-sm"></div> {dept}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* User List */}
                <div className="w-[36%] border-r border-gray-300 flex flex-col text-gray-900">
                  <div className="p-2 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Nhập vào từ khóa tìm kiếm"
                      value={searchUserStr}
                      onChange={(e) => {
                        setSearchUserStr(e.target.value);
                        setUserPage(1);
                      }}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-[12px] focus:border-blue-500 focus:outline-none placeholder:text-gray-700 text-gray-900"
                    />
                  </div>
                  <div className="flex justify-between items-center px-3 py-1.5 bg-gray-50 border-b border-gray-200 font-bold text-gray-900">
                    <span>Danh sách cán bộ</span>
                    <span>...</span>
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {paginatedDeptUsers.map((user, idx) => {
                      const isAdded = receivers.some(r => r.name === user);
                      return (
                        <div key={idx} className={`flex justify-between items-center px-3 py-2 border-b border-gray-100 group text-gray-900 ${isAdded ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                          <span>{user}</span>
                          <button
                            onClick={() => addReceiver(user)}
                            disabled={isAdded}
                            className={`${isAdded ? 'text-gray-300' : 'text-gray-600 hover:text-blue-600'}`}
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {/* Pagination for Users */}
                  <div className="p-2 border-t border-gray-200 flex items-center justify-between bg-gray-50 text-[11px]">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setUserPage(1)} disabled={userPage === 1} className="p-1 border border-gray-300 bg-white rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronsLeft className="w-3 h-3" />
                      </button>
                      <button onClick={() => setUserPage(prev => Math.max(1, prev - 1))} disabled={userPage === 1} className="p-1 border border-gray-300 bg-white rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-medium">{userPage}</span>
                      <button onClick={() => setUserPage(prev => Math.min(totalUserPages, prev + 1))} disabled={userPage === totalUserPages} className="p-1 border border-gray-300 bg-white rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronRight className="w-3 h-3" />
                      </button>
                      <button onClick={() => setUserPage(totalUserPages)} disabled={userPage === totalUserPages} className="p-1 border border-gray-300 bg-white rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronsRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="font-medium text-gray-600">
                      {Math.min(currentDeptUsers.length, (userPage - 1) * userPageSize + 1)}-{Math.min(currentDeptUsers.length, userPage * userPageSize)} / {currentDeptUsers.length}
                    </div>
                  </div>
                </div>

                {/* Selected List */}
                <div className="w-[36%] p-2 flex flex-col text-gray-900">
                  <div className="border border-gray-300 max-h-[300px] overflow-y-auto">
                    <table className="w-full text-[12px] border-collapse text-gray-900">
                      <thead>
                        <tr className="border-b border-gray-300 bg-gray-50 sticky top-0">
                          <th className="py-1 px-2 text-left border-r border-gray-300 font-bold text-gray-900">Danh sách nhận văn bản</th>
                          <th className="py-1 px-1 text-center border-r border-gray-300 w-[15%] font-bold text-gray-900">PD/TT</th>
                          <th className="py-1 px-1 text-center border-r border-gray-300 w-[15%] font-bold text-gray-900">NK</th>
                          <th className="py-1 px-1 text-center w-[12%]"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {receivers.map((r, idx) => (
                          <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-1.5 px-2 border-r border-gray-200">{r.name}</td>
                            <td className="py-1.5 px-1 border-r border-gray-200 text-center">
                              <input
                                type="checkbox"
                                checked={r.type === "PD/TT"}
                                onChange={() => toggleReceiverType(r.name, "PD/TT")}
                                className="cursor-pointer"
                              />
                            </td>
                            <td className="py-1.5 px-1 border-r border-gray-200 text-center">
                              <input
                                type="checkbox"
                                checked={r.type === "NK"}
                                onChange={() => toggleReceiverType(r.name, "NK")}
                                className="cursor-pointer"
                              />
                            </td>
                            <td className="py-1.5 px-1 text-center">
                              <button onClick={() => removeReceiver(r.name)} className="text-red-500 hover:text-red-700">
                                <X className="w-3.5 h-3.5 mx-auto" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2 shrink-0">
          <button className="flex items-center px-4 py-2 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors">
            Xác nhận
          </button>
          <button onClick={onClose} className="flex items-center px-4 py-2 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-semibold transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
