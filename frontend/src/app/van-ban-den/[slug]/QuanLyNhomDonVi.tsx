"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, X, Folder, ChevronRight, ChevronDown, Check, Trash2, ChevronsLeft, ChevronLeft, ChevronRight as RightIcon, ChevronsRight } from "lucide-react";
import Pagination from "./Pagination";
import { frequentGroupService } from "@/services/apiService";

export default function QuanLyNhomDonVi() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [phanLoai, setPhanLoai] = useState("");
  const [loaiNhom, setLoaiNhom] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [addForm, setAddForm] = useState({
    tenNhom: "",
    tenVietTat: "",
    moTa: "",
    phanLoaiNhom: "Nội bộ",
    phanLoaiDuLieu: "Đơn vị"
  });

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setAddForm({
      tenNhom: "",
      tenVietTat: "",
      moTa: "",
      phanLoaiNhom: "Nội bộ",
      phanLoaiDuLieu: "Đơn vị"
    });
    setSelectedUnits([]);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (row: any) => {
    setIsEditMode(true);
    setAddForm({
      tenNhom: row.tenNhom || "",
      tenVietTat: row.tenVietTat || "",
      moTa: row.moTa || "",
      phanLoaiNhom: row.phanLoai || "Nội bộ",
      phanLoaiDuLieu: row.loaiNhom || "Đơn vị"
    });
    setSelectedUnits([]);
    setShowAddModal(true);
  };

  const treeData = [
    { id: 'bng', name: 'Bộ ngoại giao', children: [
      { id: 'v_asean', name: 'Vụ ASEAN' },
      { id: 'v_chau_au', name: 'Vụ Châu Âu' },
      { id: 'v_chau_my', name: 'Vụ Châu Mỹ' },
      { id: 'v_dong_bac_a', name: 'Vụ Đông Bắc Á' },
      { id: 'v_dna', name: 'Vụ Đông Nam Á-Nam Á-Nam Thái Bình Dương' },
      { id: 'v_td', name: 'Vụ Trung Đông-Châu Phi' },
      { id: 'v_ngkt', name: 'Vụ Ngoại giao kinh tế' },
      { id: 'v_csdn', name: 'Vụ Chính sách đối ngoại' },
      { id: 'v_ngdp', name: 'Vụ Ngoại giao đa phương và các vấn đề quốc tế' },
      { id: 'v_lp_duqt', name: 'Vụ Luật pháp và Điều ước quốc tế' },
      { id: 'v_ttbc', name: 'Vụ Thông tin báo chí' },
      { id: 'v_tccb', name: 'Vụ Tổ chức Cán bộ' },
      { id: 'vp_b', name: 'Văn phòng Bộ' },
      { id: 'c_cy_cntt', name: 'Cục Cơ yếu-Công nghệ thông tin' },
      { id: 'c_nv_ngvh', name: 'Cục Ngoại vụ và Ngoại giao văn hóa' },
      { id: 'c_ls', name: 'Cục Lãnh sự' },
      { id: 'c_ltnn', name: 'Cục Lễ tân Nhà nước và Phiên dịch đối ngoại' },
      { id: 'c_qttv', name: 'Cục Quản trị tài vụ' },
      { id: 'hv_ng', name: 'Học viện Ngoại giao' },
      { id: 'snv_hcm', name: 'Sở Ngoại vụ thành phố Hồ Chí Minh' },
      { id: 'ubnn_nvnonn', name: 'Ủy ban Nhà nước về người Việt Nam ở nước ngoài' },
      { id: 'ubbgqg', name: 'Ủy ban Biên giới quốc gia' },
      { id: 'btg_vn', name: 'Báo Thế giới và Việt nam' },
      { id: 'c_pvngd', name: 'Cục Phục vụ Ngoại giao đoàn' },
      { id: 'ttvtdn_v75', name: 'Trung tâm Vận tải Đối ngoại V75' },
      { id: 'bqlda_tsb', name: 'Ban Quản lý dự án Trụ sở Bộ' },
      { id: 'cqdub', name: 'Cơ quan Đảng ủy Bộ' },
      { id: 'dsq_argentina', name: 'Đại sứ quán Việt Nam tại Argentina' },
      { id: 'dsq_aicap', name: 'Đại sứ quán Việt Nam tại Ai Cập' },
      { id: 'dsq_ailen', name: 'Đại sứ quán Việt Nam tại Ai-len' },
      { id: 'dsq_ando', name: 'Đại sứ quán Việt Nam tại Ấn Độ' },
      { id: 'dsq_angola', name: 'Đại sứ quán Việt Nam tại Angola' },
      { id: 'dsq_algerie', name: 'Đại sứ quán Việt Nam tại Algerie' },
      { id: 'dsq_anh', name: 'Đại sứ quán Việt Nam tại Anh' },
      { id: 'dsq_ao', name: 'Đại sứ quán Việt Nam tại Áo' },
      { id: 'dsq_arapxeut', name: 'Đại sứ quán Việt Nam tại Ả-rập Xê-út' },
      { id: 'dsq_balan', name: 'Đại sứ quán Việt Nam tại Ba Lan' },
      { id: 'dsq_belarus', name: 'Đại sứ quán Việt Nam tại Belarus' },
      { id: 'dsq_bi', name: 'Đại sứ quán Việt Nam tại Bỉ' },
      { id: 'dsq_bodaonha', name: 'Đại sứ quán Việt Nam tại Bồ Đào Nha' },
      { id: 'dsq_braxin', name: 'Đại sứ quán Việt Nam tại Braxin' },
      { id: 'dsq_brunei', name: 'Đại sứ quán Việt Nam tại Brunei' },
      { id: 'dsq_bulgaria', name: 'Đại sứ quán Việt Nam tại Bulgaria' },
    ]}
  ];

  const phongBanData = [
    { id: 'pb_vp', name: 'Văn phòng' },
    { id: 'pb_ldb', name: 'Lãnh đạo bộ' },
    { id: 'pb_dxb', name: 'Đội xe Bộ' },
    { id: 'pb_kta', name: 'Khoa Tiếng Anh' },
    { id: 'pb_pncth', name: 'Phòng Nghiên cứu - Tổng hợp' },
    { id: 'pb_tthdbcnn', name: 'Trung tâm Hướng dẫn báo chí nước ngoài' },
    { id: 'pb_pdnnd', name: 'Phòng Đối ngoại nhân dân' },
    { id: 'pb_pvhtv', name: 'Phòng Văn hoá - Tiếng Việt' },
  ];

  const nguoiDungData = [
    { id: 'nd_qt', name: 'Quản trị', account: 'NPH.QT' },
    { id: 'nd_ngkt', name: 'Ngoại giao kinh tế', account: 'NPH.NGKT' },
    { id: 'nd_ngct', name: 'Ngoại giao chính trị', account: 'NPH.NGCT' },
    { id: 'nd_lx', name: 'Lái xe', account: 'NPH.LX' },
    { id: 'nd_ntnthoa', name: 'Nguyễn Thị Ngọc Thoa', account: 'snv.ntnthoa' },
    ...Array.from({ length: 2251 }, (_, i) => ({ id: `nd_dummy_${i}`, name: `Người dùng ${i+1}`, account: `user.${i+1}` }))
  ];

  const lienThongData = [
    { id: 'lt_1', name: 'Hội Người cao tuổi tỉnh Lạng Sơn' },
    { id: 'lt_2', name: 'Văn phòng - UBND thành phố Đà Nẵng' },
    { id: 'lt_3', name: 'Hội Chữ thập đỏ Việt Nam' },
    { id: 'lt_4', name: 'Viện Các Khoa học Trái đất' },
    ...Array.from({ length: 120 }, (_, i) => ({ id: `lt_dummy_${i}`, name: `Cơ quan liên thông ${i+1}` }))
  ];

  const [selectedUnits, setSelectedUnits] = useState<{id: string, name: string}[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['bng']);
  const [treeSearchKeyword, setTreeSearchKeyword] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAddUnit = (child: {id: string, name: string}) => {
    if (!selectedUnits.some(u => u.id === child.id)) {
      setSelectedUnits([...selectedUnits, child]);
    }
  };

  const handleRemoveUnit = (id: string) => {
    setSelectedUnits(prev => prev.filter(u => u.id !== id));
  };
  
  useEffect(() => {
    // Reset to page 1 if items length drops below current page threshold
    const maxPages = Math.max(1, Math.ceil(selectedUnits.length / pageSize));
    if (currentPage > maxPages) {
      setCurrentPage(maxPages);
    }
  }, [selectedUnits.length, pageSize, currentPage]);

  const totalSelected = selectedUnits.length;
  const maxPages = Math.max(1, Math.ceil(totalSelected / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUnits = selectedUnits.slice(startIndex, startIndex + pageSize);

  const filteredTreeChildren = treeData[0].children.filter(c => c.name.toLowerCase().includes(treeSearchKeyword.toLowerCase()));
  const filteredPhongBan = phongBanData.filter(c => c.name.toLowerCase().includes(treeSearchKeyword.toLowerCase()));
  const filteredNguoiDung = nguoiDungData.filter(c => c.name.toLowerCase().includes(treeSearchKeyword.toLowerCase()) || c.account.toLowerCase().includes(treeSearchKeyword.toLowerCase()));
  const filteredLienThong = lienThongData.filter(c => c.name.toLowerCase().includes(treeSearchKeyword.toLowerCase()));
  
  let currentListToSelectAll: any[] = [];
  if (addForm.phanLoaiNhom === 'Liên thông') {
    currentListToSelectAll = filteredLienThong;
  } else {
    if (addForm.phanLoaiDuLieu === 'Phòng ban') currentListToSelectAll = filteredPhongBan;
    else if (addForm.phanLoaiDuLieu === 'Người dùng') currentListToSelectAll = filteredNguoiDung;
    else currentListToSelectAll = filteredTreeChildren;
  }
  
  const isAllSelected = currentListToSelectAll.length > 0 && currentListToSelectAll.every(c => selectedUnits.some(u => u.id === c.id));
  
  const [leftCurrentPage, setLeftCurrentPage] = useState(1);
  const [leftPageSize, setLeftPageSize] = useState(10);

  const paginatedSourceData = addForm.phanLoaiNhom === 'Liên thông' ? filteredLienThong : filteredNguoiDung;

  useEffect(() => {
    const max = Math.max(1, Math.ceil(paginatedSourceData.length / leftPageSize));
    if (leftCurrentPage > max) setLeftCurrentPage(max);
  }, [paginatedSourceData.length, leftPageSize, leftCurrentPage]);

  const leftMaxPages = Math.max(1, Math.ceil(paginatedSourceData.length / leftPageSize));
  const paginatedLeftData = paginatedSourceData.slice((leftCurrentPage - 1) * leftPageSize, leftCurrentPage * leftPageSize);

  const renderLeftPagination = () => {
    let start = Math.max(1, leftCurrentPage - 2);
    let end = Math.min(leftMaxPages, start + 4);
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return (
      <div className="border-t border-gray-200 px-2 py-2 flex justify-between items-center bg-[#f7f9fb] text-[12px] shrink-0 w-full">
        <div className="flex items-center gap-2">
          <div className="flex border border-gray-300 rounded bg-white">
            <button onClick={() => setLeftCurrentPage(1)} disabled={leftCurrentPage === 1} className="px-1.5 py-1 hover:bg-gray-100 border-r border-gray-300 text-[#005fb8] focus:outline-none disabled:text-gray-400"><ChevronsLeft className="w-3.5 h-3.5" /></button>
            <button onClick={() => setLeftCurrentPage(p => Math.max(1, p - 1))} disabled={leftCurrentPage === 1} className="px-1.5 py-1 hover:bg-gray-100 border-r border-gray-300 text-[#005fb8] focus:outline-none disabled:text-gray-400"><ChevronLeft className="w-3.5 h-3.5" /></button>
            {pages.map(p => (
              <button 
                key={p} 
                onClick={() => setLeftCurrentPage(p)} 
                className={`px-2.5 py-1 border-r border-gray-300 focus:outline-none ${p === leftCurrentPage ? 'text-[#005fb8] font-bold' : 'text-[#005fb8] hover:bg-gray-50'}`}
              >
                {p}
              </button>
            ))}
            <button onClick={() => setLeftCurrentPage(p => Math.min(leftMaxPages, p + 1))} disabled={leftCurrentPage === leftMaxPages} className="px-1.5 py-1 hover:bg-gray-100 border-r border-gray-300 text-[#005fb8] focus:outline-none disabled:text-gray-400"><RightIcon className="w-3.5 h-3.5" /></button>
            <button onClick={() => setLeftCurrentPage(leftMaxPages)} disabled={leftCurrentPage === leftMaxPages} className="px-1.5 py-1 hover:bg-gray-100 text-[#005fb8] focus:outline-none disabled:text-gray-400"><ChevronsRight className="w-3.5 h-3.5" /></button>
          </div>
          <select 
            value={leftPageSize}
            onChange={(e) => { setLeftPageSize(Number(e.target.value)); setLeftCurrentPage(1); }}
            className="border border-gray-300 rounded px-1.5 py-1 outline-none text-gray-900 bg-white"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="250">250</option>
          </select>
        </div>
        <div className="text-gray-600">
          {paginatedSourceData.length > 0 ? `${(leftCurrentPage - 1) * leftPageSize + 1}-${Math.min(leftCurrentPage * leftPageSize, paginatedSourceData.length)} / ${paginatedSourceData.length}` : '0-0 / 0'}
        </div>
      </div>
    );
  };

  const getLeftPaneTitle = () => {
    if (addForm.phanLoaiNhom === 'Liên thông') return 'cơ quan';
    if (addForm.phanLoaiDuLieu === 'Phòng ban') return 'phòng ban';
    if (addForm.phanLoaiDuLieu === 'Người dùng') return 'người dùng';
    return 'đơn vị';
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelections = [...selectedUnits];
      currentListToSelectAll.forEach(child => {
        if (!newSelections.some(u => u.id === child.id)) {
          newSelections.push(child);
        }
      });
      setSelectedUnits(newSelections);
    } else {
      const remaining = selectedUnits.filter(u => !currentListToSelectAll.some(c => c.id === u.id));
      setSelectedUnits(remaining);
    }
  };

  const renderModal = (content: React.ReactNode) => {
    if (!mounted) return null;
    return createPortal(content, document.body);
  };

  const [apiData, setApiData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await frequentGroupService.getAll(0, 1000);
        
        const mapped = (res.content || []).map((item: any, index: number) => ({
          id: item.id,
          stt: index + 1,
          tenNhom: item.name || "Không có tên",
          tenVietTat: item.shortName || "",
          phanLoai: item.documentClassification === "INTERNAL" ? "Nội bộ" : "Liên thông",
          loaiNhom: item.groupType === "DEPARTMENT" ? "Phòng ban" : item.groupType === "USER" ? "Người dùng" : "Đơn vị",
          moTa: item.description || "",
          trangThai: item.status === 1 ? "Hoạt động" : "Ngừng hoạt động"
        }));
        setApiData(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = apiData.filter(item => {
    if (phanLoai && item.phanLoai !== phanLoai) return false;
    if (loaiNhom && item.loaiNhom !== loaiNhom) return false;
    if (searchKeyword && !item.tenNhom.toLowerCase().includes(searchKeyword.toLowerCase()) && !item.tenVietTat.toLowerCase().includes(searchKeyword.toLowerCase())) {
      return false;
    }
    return true;
  });

  const [mainCurrentPage, setMainCurrentPage] = useState(1);
  const [mainPageSize, setMainPageSize] = useState(10);
  
  useEffect(() => {
    const max = Math.max(1, Math.ceil(filteredData.length / mainPageSize));
    if (mainCurrentPage > max) setMainCurrentPage(max);
  }, [filteredData.length, mainPageSize, mainCurrentPage]);
  
  const mainPaginatedData = filteredData.slice((mainCurrentPage - 1) * mainPageSize, mainCurrentPage * mainPageSize);

  return (
    <div className="w-full min-h-full bg-white shadow-sm border border-gray-200 flex flex-col">
      <div className="p-4">
        <h1 className="text-[22px] font-normal text-gray-800 mb-3">Danh sách nhóm</h1>
        
        <div className="flex justify-between items-center mb-4">
          <button onClick={handleOpenAddModal} className="flex items-center px-4 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors">
            <Plus className="w-4 h-4 mr-1.5" /> Thêm mới
          </button>
          
          <div className="flex gap-2 text-[13px]">
            <select 
              value={phanLoai} 
              onChange={(e) => setPhanLoai(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white min-w-[160px]"
            >
              <option value="">--Phân loại văn bản--</option>
              <option value="Nội bộ">Nội bộ</option>
              <option value="Liên thông">Liên thông</option>
            </select>
            
            <select 
              value={loaiNhom} 
              onChange={(e) => setLoaiNhom(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white min-w-[140px]"
            >
              <option value="">--Loại nhóm--</option>
              <option value="Đơn vị">Đơn vị</option>
              <option value="Phòng ban">Phòng ban</option>
              <option value="Người dùng">Người dùng</option>
            </select>
            
            <input 
              type="text" 
              placeholder="Nhập vào từ khóa tìm kiếm" 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-[220px] border border-gray-300 rounded px-3 py-1.5 text-gray-900 placeholder:text-gray-700 focus:outline-none focus:border-[#005fb8]" 
            />
          </div>
        </div>

        <div className="w-full border border-gray-200">
          <table className="w-full table-fixed border-collapse text-[13px]">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-gray-800">
                <th className="p-2 border-r border-gray-200 font-bold text-center w-16">STT</th>
                <th className="p-2 border-r border-gray-200 font-bold text-center w-48">Tên nhóm</th>
                <th className="p-2 border-r border-gray-200 font-bold text-center w-32">Tên viết tắt</th>
                <th className="p-2 border-r border-gray-200 font-bold text-center w-32">Phân loại</th>
                <th className="p-2 border-r border-gray-200 font-bold text-center min-w-[200px]">Mô tả</th>
                <th className="p-2 border-r border-gray-200 font-bold text-center w-32">Trạng thái</th>
                <th className="p-2 font-bold text-center w-32">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {mainPaginatedData.length > 0 ? (
                mainPaginatedData.map((row, index) => (
                  <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-gray-800">
                    <td className="p-2 border-r border-gray-200 text-center font-medium">{(mainCurrentPage - 1) * mainPageSize + index + 1}</td>
                    <td className="p-2 border-r border-gray-200">{row.tenNhom}</td>
                    <td className="p-2 border-r border-gray-200 text-center">{row.tenVietTat}</td>
                    <td className="p-2 border-r border-gray-200 text-center">{row.phanLoai}</td>
                    <td className="p-2 border-r border-gray-200">{row.moTa}</td>
                    <td className="p-2 border-r border-gray-200 text-center">{row.trangThai}</td>
                    <td className="p-2 text-center">
                      <button onClick={() => handleOpenEditModal(row)} className="text-[#005fb8] hover:underline focus:outline-none">Sửa</button>
                      <span className="mx-1 text-gray-300">|</span>
                      <button onClick={() => setItemToDelete(row)} className="text-red-600 hover:underline focus:outline-none">Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-900 bg-gray-50/50">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-6 h-6 border-2 border-[#005fb8] border-t-transparent rounded-full animate-spin mb-2"></div>
                        <span className="text-gray-500 text-[13px]">Đang tải dữ liệu...</span>
                      </div>
                    ) : "Không có dữ liệu"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <Pagination 
            currentPage={mainCurrentPage} 
            pageSize={mainPageSize} 
            totalItems={filteredData.length} 
            onPageChange={setMainCurrentPage} 
            onPageSizeChange={(s) => { setMainPageSize(s); setMainCurrentPage(1); }} 
          />
        </div>
      </div>

      {/* --- ADD NEW GROUP MODAL --- */}
      {showAddModal && renderModal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded shadow-xl w-[900px] max-w-[95vw] h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 shrink-0">
              <h2 className="text-[15px] font-bold text-gray-800">
                {isEditMode ? 'Cập nhật nhóm' : 'Thêm mới nhóm'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-900 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-5 custom-scrollbar text-[13px] text-gray-800 flex flex-col">
              {/* Form fields */}
              <div className="grid grid-cols-2 gap-6 mb-4 shrink-0">
                <div>
                  <label className="block mb-1.5">Tên nhóm(<span className="text-red-500">*</span>)</label>
                  <input type="text" placeholder="Nhập tiêu đề" value={addForm.tenNhom} onChange={e => setAddForm({...addForm, tenNhom: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none" />
                </div>
                <div>
                  <label className="block mb-1.5">Tên viết tắt</label>
                  <input type="text" placeholder="Nhập tên viết tắt" value={addForm.tenVietTat} onChange={e => setAddForm({...addForm, tenVietTat: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none" />
                </div>
              </div>

              <div className="mb-4 shrink-0">
                <label className="block mb-1.5">Mô tả ngắn</label>
                <textarea placeholder="Nhập mô tả ngắn" rows={3} value={addForm.moTa} onChange={e => setAddForm({...addForm, moTa: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6 shrink-0">
                <div>
                  <label className="block mb-2 font-medium">Phân loại nhóm:</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="phanLoaiNhom" value="Nội bộ" checked={addForm.phanLoaiNhom === 'Nội bộ'} onChange={e => setAddForm({...addForm, phanLoaiNhom: e.target.value})} className="w-3.5 h-3.5 text-[#005fb8] focus:ring-[#005fb8] border-gray-300" /> Nội bộ
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="phanLoaiNhom" value="Liên thông" checked={addForm.phanLoaiNhom === 'Liên thông'} onChange={e => setAddForm({...addForm, phanLoaiNhom: e.target.value})} className="w-3.5 h-3.5 text-[#005fb8] focus:ring-[#005fb8] border-gray-300" /> Liên thông
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-medium">Phân loại dữ liệu:</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="phanLoaiDuLieu" value="Đơn vị" checked={addForm.phanLoaiDuLieu === 'Đơn vị'} onChange={e => setAddForm({...addForm, phanLoaiDuLieu: e.target.value})} className="w-3.5 h-3.5 text-[#005fb8] focus:ring-[#005fb8] border-gray-300" /> Đơn vị
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="phanLoaiDuLieu" value="Phòng ban" checked={addForm.phanLoaiDuLieu === 'Phòng ban'} onChange={e => setAddForm({...addForm, phanLoaiDuLieu: e.target.value})} className="w-3.5 h-3.5 text-[#005fb8] focus:ring-[#005fb8] border-gray-300" /> Phòng ban
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="phanLoaiDuLieu" value="Người dùng" checked={addForm.phanLoaiDuLieu === 'Người dùng'} onChange={e => setAddForm({...addForm, phanLoaiDuLieu: e.target.value})} className="w-3.5 h-3.5 text-[#005fb8] focus:ring-[#005fb8] border-gray-300" /> Người dùng
                    </label>
                  </div>
                </div>
              </div>

              <p className="mb-2 shrink-0">Cây danh sách</p>
              
              {/* Split Pane */}
              <div className="flex-1 flex border border-gray-300 rounded overflow-hidden min-h-[300px]">
                {/* Left Pane */}
                <div className="flex-1 flex flex-col border-r border-gray-300">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-start gap-2">
                    <div>
                      <div className="font-bold mb-1">Danh sách {getLeftPaneTitle()}(<span className="text-red-500">*</span>)</div>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-[#005fb8] w-3.5 h-3.5" onChange={handleSelectAll} checked={isAllSelected} /> <span className="text-gray-600">Chọn tất cả</span>
                      </label>
                    </div>
                    <input type="text" placeholder="Nhập vào từ khóa tìm kiếm" value={treeSearchKeyword} onChange={e => setTreeSearchKeyword(e.target.value)} className="w-[180px] border border-gray-300 rounded px-2 py-1.5 text-[12px] focus:border-[#005fb8] focus:outline-none" />
                  </div>
                  
                  <div className={`flex-1 flex flex-col overflow-hidden custom-scrollbar ${(addForm.phanLoaiNhom === 'Liên thông' || addForm.phanLoaiDuLieu === 'Người dùng') ? '' : 'p-3'}`}>
                    {/* Tree Root - For Đơn Vị */}
                    {addForm.phanLoaiNhom === 'Nội bộ' && addForm.phanLoaiDuLieu === 'Đơn vị' && (
                      <div className="flex-1 overflow-auto">
                        <div className="flex items-center gap-1.5 mb-3">
                          <button onClick={() => toggleNode('bng')} className="text-gray-600 focus:outline-none">
                            {expandedNodes.includes('bng') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                          <Folder className="w-4 h-4" fill="#facc15" color="#facc15" />
                          <span className="text-[13.5px]">Bộ ngoại giao</span>
                        </div>
                        
                        {/* Tree Children */}
                        {expandedNodes.includes('bng') && (
                          <div className="ml-7 flex flex-col gap-3 pb-3">
                            {filteredTreeChildren.map(child => {
                              const isSelected = selectedUnits.some(u => u.id === child.id);
                              return (
                                <div key={child.id} className="flex items-center gap-2 group">
                                  <Folder className="w-4 h-4 shrink-0" fill="#facc15" color="#facc15" />
                                  <span className={`text-[13.5px] ${isSelected ? 'text-[#005fb8]' : ''}`}>{child.name}</span>
                                  {isSelected ? (
                                    <Check className="w-4 h-4 text-green-600 font-bold shrink-0" />
                                  ) : (
                                    <button onClick={() => handleAddUnit(child)} className="text-black hover:text-[#005fb8] shrink-0 focus:outline-none">
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* For Phòng Ban */}
                    {addForm.phanLoaiNhom === 'Nội bộ' && addForm.phanLoaiDuLieu === 'Phòng ban' && (
                      <div className="flex-1 overflow-auto ml-2 flex flex-col gap-3 pb-3">
                        {filteredPhongBan.map(child => {
                          const isSelected = selectedUnits.some(u => u.id === child.id);
                          return (
                            <div key={child.id} className="flex items-center gap-2 group">
                              <Folder className="w-4 h-4 shrink-0" fill="#facc15" color="#facc15" />
                              <span className={`text-[13.5px] ${isSelected ? 'text-[#005fb8]' : ''}`}>{child.name}</span>
                              {isSelected ? (
                                <Check className="w-4 h-4 text-green-600 font-bold shrink-0" />
                              ) : (
                                <button onClick={() => handleAddUnit(child)} className="text-black hover:text-[#005fb8] shrink-0 focus:outline-none">
                                  <Plus className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* For Người dùng */}
                    {addForm.phanLoaiNhom === 'Nội bộ' && addForm.phanLoaiDuLieu === 'Người dùng' && (
                      <div className="flex flex-col h-full overflow-hidden w-full">
                        <div className="flex-1 overflow-auto">
                          <table className="w-full border-collapse bg-white">
                            <thead>
                              <tr className="border-b border-gray-200 text-center bg-white sticky top-0 shadow-sm z-10">
                                <th className="p-2 border-r border-gray-200 font-bold">Tên người dùng</th>
                                <th className="p-2 border-r border-gray-200 font-bold w-1/3">Tài khoản</th>
                                <th className="p-2 font-bold w-12">Thêm</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedLeftData.map(child => {
                                const isSelected = selectedUnits.some(u => u.id === child.id);
                                return (
                                  <tr key={child.id} className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-2.5 border-r border-gray-200">{child.name}</td>
                                    <td className="p-2.5 border-r border-gray-200">{(child as any).account}</td>
                                    <td className="p-2.5 text-center">
                                      {isSelected ? (
                                        <Check className="w-5 h-5 text-green-600 font-bold mx-auto" />
                                      ) : (
                                        <button onClick={() => handleAddUnit(child)} className="text-[#003d73] hover:text-[#005fb8] p-0.5 rounded focus:outline-none flex mx-auto font-bold text-lg leading-none">
                                          +
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        {renderLeftPagination()}
                      </div>
                    )}

                    {/* For Liên thông */}
                    {addForm.phanLoaiNhom === 'Liên thông' && (
                      <div className="flex flex-col h-full overflow-hidden w-full">
                        <div className="flex-1 overflow-auto">
                          <table className="w-full border-collapse bg-white">
                            <thead>
                              <tr className="border-b border-gray-200 text-center bg-white sticky top-0 shadow-sm z-10">
                                <th className="p-2 border-r border-gray-200 font-bold">Tên cơ quan</th>
                                <th className="p-2 font-bold w-16">Thêm</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedLeftData.map(child => {
                                const isSelected = selectedUnits.some(u => u.id === child.id);
                                return (
                                  <tr key={child.id} className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-2.5 border-r border-gray-200">{child.name}</td>
                                    <td className="p-2.5 text-center">
                                      {isSelected ? (
                                        <Check className="w-5 h-5 text-green-600 font-bold mx-auto" />
                                      ) : (
                                        <button onClick={() => handleAddUnit(child)} className="text-[#003d73] hover:text-[#005fb8] p-0.5 rounded focus:outline-none flex mx-auto font-bold text-lg leading-none">
                                          +
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        {renderLeftPagination()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Pane */}
                <div className="flex-1 flex flex-col">
                  <div className="px-3 py-2 border-b border-gray-200 flex justify-between items-center bg-white shrink-0">
                    <div className="font-bold">Danh sách {getLeftPaneTitle()} đã thêm vào nhóm</div>
                    <button onClick={() => setSelectedUnits([])} className="bg-[#5c6970] hover:bg-[#4a555b] text-white px-3 py-1.5 rounded text-[12px] font-medium transition-colors">
                      Bỏ chọn tất cả
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-auto custom-scrollbar bg-gray-50/50 p-2">
                    <table className="w-full border-collapse bg-white">
                      <thead>
                        <tr className="border border-gray-200 text-center">
                          <th className="p-2 border-r border-gray-200 font-bold w-12">STT</th>
                          <th className="p-2 border-r border-gray-200 font-bold">Tên</th>
                          <th className="p-2 font-bold w-12">Gỡ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUnits.map((u, idx) => (
                          <tr key={u.id} className="border border-gray-200 bg-gray-100/30">
                            <td className="p-2 border-r border-gray-200 text-center">{startIndex + idx + 1}</td>
                            <td className="p-2 border-r border-gray-200">{u.name}</td>
                            <td className="p-2 text-center">
                              <button onClick={() => handleRemoveUnit(u.id)} className="text-[#003d73] hover:text-red-600 p-0.5 rounded focus:outline-none flex mx-auto">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination Mock */}
                  <div className="border-t border-gray-200 px-3 py-2 flex justify-between items-center bg-white text-[12px] shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="flex border border-gray-300 rounded overflow-hidden">
                        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-1.5 py-1 hover:bg-gray-100 border-r border-gray-300 text-gray-600 focus:outline-none disabled:opacity-50"><ChevronsLeft className="w-3 h-3" /></button>
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-1.5 py-1 hover:bg-gray-100 border-r border-gray-300 text-gray-600 focus:outline-none disabled:opacity-50"><ChevronLeft className="w-3 h-3" /></button>
                        <div className="px-3 py-1 border-r border-gray-300 bg-gray-50 font-medium">{currentPage}</div>
                        <button onClick={() => setCurrentPage(p => Math.min(maxPages, p + 1))} disabled={currentPage === maxPages} className="px-1.5 py-1 hover:bg-gray-100 border-r border-gray-300 text-gray-600 focus:outline-none disabled:opacity-50"><RightIcon className="w-3 h-3" /></button>
                        <button onClick={() => setCurrentPage(maxPages)} disabled={currentPage === maxPages} className="px-1.5 py-1 hover:bg-gray-100 text-gray-600 focus:outline-none disabled:opacity-50"><ChevronsRight className="w-3 h-3" /></button>
                      </div>
                      <select 
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded px-2 py-1 outline-none text-gray-900 bg-white"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="250">250</option>
                      </select>
                    </div>
                    <div className="text-gray-600">
                      {totalSelected > 0 
                        ? `${startIndex + 1}-${Math.min(startIndex + pageSize, totalSelected)} / ${totalSelected}` 
                        : '0-0 / 0'}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end gap-2 shrink-0">
              <button onClick={() => { alert(isEditMode ? 'Đã cập nhật nhóm thành công!' : 'Đã thêm nhóm thành công!'); setShowAddModal(false); }} className="flex items-center px-5 py-2 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors">
                <Plus className="w-4 h-4 mr-1.5" /> {isEditMode ? 'Cập nhật' : 'Thêm'}
              </button>
              <button onClick={() => setShowAddModal(false)} className="flex items-center px-5 py-2 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-semibold transition-colors">
                <X className="w-4 h-4 mr-1.5" /> Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {itemToDelete && renderModal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setItemToDelete(null)}>
          <div className="bg-white w-[400px] rounded shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              <h2 className="text-[15px] font-semibold text-red-700">Xác nhận xóa</h2>
            </div>
            <div className="p-5 text-[14px] text-gray-900">
              Bạn có chắc chắn muốn xóa nhóm <span className="font-bold">"{itemToDelete.tenNhom}"</span> không? Dữ liệu đã xóa sẽ không thể khôi phục.
            </div>
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
              <button onClick={() => setItemToDelete(null)} className="px-4 py-1.5 bg-white border border-gray-300 text-gray-900 rounded text-[13px] font-medium hover:bg-gray-50 transition-colors focus:outline-none">
                Hủy
              </button>
              <button onClick={() => setItemToDelete(null)} className="px-4 py-1.5 bg-red-600 text-white rounded text-[13px] font-medium hover:bg-red-700 transition-colors focus:outline-none">
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
