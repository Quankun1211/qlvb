"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, User, Calendar, Upload } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  
  // File upload states
  const [cyFile, setCyFile] = useState<File | null>(null);
  const [simFile, setSimFile] = useState<File | null>(null);
  const [nhaySimFile, setNhaySimFile] = useState<File | null>(null);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      setIsEditMode(false);
      setCyFile(null);
      setSimFile(null);
      setNhaySimFile(null);
      
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch (e) {}
      }
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files.length > 0) {
      setter(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setter(e.dataTransfer.files[0]);
    }
  };

  const renderUploadZone = (title: string, file: File | null, setter: React.Dispatch<React.SetStateAction<File | null>>, id: string) => (
    <div className="flex flex-col mb-4">
      <label className="text-[13px] text-gray-700 mb-1">{title}</label>
      <div 
        className="border border-dashed border-blue-500 rounded p-4 text-center hover:bg-blue-50 transition-colors cursor-pointer min-h-[100px] flex flex-col items-center justify-center relative"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, setter)}
        onClick={() => document.getElementById(id)?.click()}
      >
        <input 
          id={id} 
          type="file" 
          accept=".png" 
          className="hidden" 
          onChange={(e) => handleFileChange(e, setter)} 
        />
        {file ? (
          <div className="flex flex-col items-center">
            <span className="text-[13px] font-medium text-[#005fb8] mb-2">{file.name}</span>
            <img src={URL.createObjectURL(file)} alt="preview" className="max-h-[60px] object-contain" />
          </div>
        ) : (
          <div className="text-[12px] text-gray-600">
            Kéo file vào đây để tải lên, hoặc <span className="text-[#005fb8]">Tải lên</span> hoặc <span className="text-[#005fb8]">Scan</span>
            <div className="mt-2 text-gray-500 italic">Chỉ hỗ trợ các đuôi: <b>.png</b></div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div 
        className={`bg-white shadow-2xl rounded flex flex-col overflow-hidden relative transition-all duration-300 ${isEditMode ? 'w-[750px] max-h-[95vh]' : 'w-[650px] max-h-[90vh]'}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 shrink-0 bg-white">
          <h2 className="text-[15px] font-medium text-gray-800">
            {isEditMode ? "Sửa thông tin người dùng" : "Xem chi tiết thông tin cá nhân"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-[13px] text-gray-900">
          {!isEditMode ? (
            <div className="grid grid-cols-2 gap-y-5 gap-x-8 px-2">
              <div><span className="font-bold">Tên cán bộ:</span> {user?.fullName || "Chưa cập nhật"}</div>
              <div><span className="font-bold">Tài khoản:</span> {user?.username || "Chưa cập nhật"}</div>
              
              <div><span className="font-bold">Ngày sinh:</span> Chưa cập nhật</div>
              <div><span className="font-bold">Email:</span> {user?.email || "Chưa cập nhật"}</div>
              
              <div><span className="font-bold">Đơn vị:</span> Cục Cơ yếu-Công nghệ thông tin</div>
              <div><span className="font-bold">Phòng ban:</span> Phòng Quản lý kỹ thuật nghiệp vụ mật mã</div>
              
              <div><span className="font-bold">Địa chỉ:</span></div>
              <div><span className="font-bold">Chức vụ:</span> Cơ yếu</div>
              
              <div><span className="font-bold">Chức danh:</span></div>
              <div><span className="font-bold">Ký nháy độ rộng:</span> 200</div>
              
              <div><span className="font-bold">Tên ký số:</span></div>
              <div><span className="font-bold">Số điện thoại di động:</span></div>
              
              <div><span className="font-bold">Số điện thoại cơ quan:</span></div>
              <div><span className="font-bold">Độ cao ký sim:</span> 200</div>
              
              <div><span className="font-bold">Độ rộng ký sim:</span> 200</div>
              <div><span className="font-bold">Độ cao ký nháy:</span> 200</div>
              
              <div><span className="font-bold">Chữ ký nháy sim:</span></div>
              <div><span className="font-bold">Chữ ký số sim:</span></div>
              
              <div className="col-span-2"><span className="font-bold">Chữ ký ban cơ yếu:</span></div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700">Tên cán bộ<span className="text-red-500">(*)</span></label>
                  <input type="text" defaultValue={user?.fullName || ""} className="border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700">Email<span className="text-red-500">(*)</span></label>
                  <input type="email" defaultValue={user?.email || ""} className="border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700">Địa chỉ</label>
                  <input type="text" placeholder="Nhập địa chỉ" className="border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700">Ngày sinh</label>
                  <input type="date" defaultValue="0001-01-01" className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700">Chức vụ</label>
                  <select defaultValue="Cơ yếu" className="border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white">
                    <option value="" disabled>Chọn chức vụ</option>
                    <option value="Ủy viên chuyên trách công tác Đảng">Ủy viên chuyên trách công tác Đảng</option>
                    <option value="Công sứ">Công sứ</option>
                    <option value="Tập sự Phó Viện">Tập sự Phó Viện</option>
                    <option value="Cơ yếu">Cơ yếu</option>
                    <option value="Q. Giám đốc Trung tâm">Q. Giám đốc Trung tâm</option>
                    <option value="Tập sự Phó Cục trưởng">Tập sự Phó Cục trưởng</option>
                    <option value="Tùy viên">Tùy viên</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700">Chức danh</label>
                  <select defaultValue="" className="border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white">
                    <option value="" disabled>Chọn chức vụ</option>
                    <option value="Công sứ">Công sứ</option>
                    <option value="Quyền Bộ Trưởng">Quyền Bộ Trưởng</option>
                    <option value="Tập sự cấp Vụ">Tập sự cấp Vụ</option>
                    <option value="Lãnh đạo đơn vị">Lãnh đạo đơn vị</option>
                    <option value="Phó lãnh đạo đơn vị">Phó lãnh đạo đơn vị</option>
                    <option value="Vụ trưởng">Vụ trưởng</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700">Tên ký số</label>
                  <input type="text" placeholder="Nhập tên ký số" className="border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700">Số điện thoại di động</label>
                  <input type="text" placeholder="Nhập số điện thoại di động" className="border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700">Số điện thoại cơ quan</label>
                  <input type="text" placeholder="Nhập số điện thoại cơ quan" className="border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700">Độ cao ký sim</label>
                  <input type="text" defaultValue="200" className="border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700">Độ rộng ký sim</label>
                  <input type="text" defaultValue="200" className="border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700">Độ cao ký nháy</label>
                  <input type="text" defaultValue="200" className="border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-gray-700">Số thứ tự trong cơ quan</label>
                <input type="text" defaultValue="0" className="border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white" />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700">Ký nháy độ rộng</label>
                  <input type="text" defaultValue="200" className="border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white" />
                </div>
                <div className="flex flex-col gap-1 items-center justify-center">
                  <label className="text-gray-700 mb-2 text-center w-full">Xác thực 2FA</label>
                  <div className="relative inline-block w-8 h-4 bg-gray-300 rounded-full cursor-pointer">
                    <div className="absolute left-[2px] top-[2px] bg-white w-3 h-3 rounded-full shadow-sm"></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-center justify-center">
                  <label className="text-gray-700 mb-2 text-center w-full">Nhận thông báo mobile</label>
                  <div className="relative inline-block w-8 h-4 bg-gray-300 rounded-full cursor-pointer">
                    <div className="absolute left-[2px] top-[2px] bg-white w-3 h-3 rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>

              {/* Upload Zones */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                {renderUploadZone("Chữ ký ban cơ yếu", cyFile, setCyFile, "upload-cy")}
                {renderUploadZone("Chữ ký số sim", simFile, setSimFile, "upload-sim")}
              </div>
              <div className="w-1/2 pr-2">
                {renderUploadZone("Chữ ký nháy sim", nhaySimFile, setNhaySimFile, "upload-nhay-sim")}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
          {!isEditMode ? (
            <button 
              onClick={() => setIsEditMode(true)} 
              className="flex items-center px-4 py-2 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-medium transition-colors"
            >
              <User className="w-4 h-4 mr-2" /> Sửa thông tin
            </button>
          ) : (
            <button 
              onClick={() => {
                alert("Đã lưu thông tin thành công!");
                setIsEditMode(false);
              }} 
              className="flex items-center px-4 py-2 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-medium transition-colors"
            >
              Lưu lại
            </button>
          )}
          <button onClick={onClose} className="flex items-center px-4 py-2 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-medium transition-colors">
            <X className="w-4 h-4 mr-1.5" /> Đóng
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
