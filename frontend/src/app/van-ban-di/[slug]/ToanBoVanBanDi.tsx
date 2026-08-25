"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Search,
  RefreshCcw,
  X,
  Paperclip,
  FileDown,
  Search as SearchIcon,
  ArrowDownToLine,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import Pagination from "../../van-ban-den/[slug]/Pagination";
import {
  AttachmentModal,
  PDFDetailModal,
  WordDetailModal,
} from "@/app/van-ban-den/[slug]/SharedModals";
import { outgoingService } from "@/services/apiService";

const mockDonVi = [
  "Đơn vị đôn đốc",
  "Văn phòng Bộ",
  "Cục Cơ yếu-Công nghệ thông tin",
];

const mockNguoiSoan = [
  "Đậu Việt Đức",
  "Đỗ Văn Điển",
  "Lưu Anh Tuấn",
  "Lê Mai Phượng",
  "Kiều Việt Hùng",
];

const mockDonViNoiBo = [
  "Cục Lãnh sự",
  "Vụ Luật pháp và Điều ước quốc tế",
  "Văn phòng Bộ",
];

const mockDonViLienThong = [
  "UBND TP Hà Nội",
  "Bộ Thông tin và Truyền thông",
  "Bộ Công an",
  "Bảo hiểm Xã hội VN",
];

export default function ToanBoVanBanDi() {
  const [mounted, setMounted] = useState(false);
  const [apiData, setApiData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDocumentId, setSelectedDocumentId] =
    useState<number | null>(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    setMounted(true);

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const res = await outgoingService.getAll(0, 1000);

        const mapped = (res.content || []).map((item: any) => {
          const formatDate = (dateStr: string) => {
            if (!dateStr) return "";

            const d = new Date(dateStr);

            return `${d
              .getDate()
              .toString()
              .padStart(2, "0")}/${(d.getMonth() + 1)
              .toString()
              .padStart(2, "0")}/${d.getFullYear()}`;
          };

          return {
            id: item.id,
            soDi: item.outgoingNumber || "0",
            soKH: item.referenceNumber || "",
            ngayBH: formatDate(item.issueDate),
            trichYeu: item.subject || "Không có trích yếu",
            canBoSoanThao: item.drafterName || "",
            nguoiKy: item.signerName || "",
            noiNhan: (item.recipientNames || []).join(", "),
            hasFile: true,
          };
        });

        setApiData(mapped);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const searchParams = useSearchParams();
  const queryQ = searchParams.get("q") || "";

  const [activeDateFilter, setActiveDateFilter] =
    useState<string>("");

  const [selectedYear, setSelectedYear] =
    useState("2026");

  const [searchKeyword, setSearchKeyword] =
    useState(queryQ);

  useEffect(() => {
    setSearchKeyword(queryQ);
  }, [queryQ]);

  const removeAccents = (
    str: string | undefined | null
  ) => {
    if (!str) return "";

    return str
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const formatDate = (
    dateStr?: string | null
  ) => {
    if (!dateStr) return "";

    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) {
      return dateStr;
    }

    return `${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const [showAdvancedSearch, setShowAdvancedSearch] =
    useState(false);

  const [showAttachmentModal, setShowAttachmentModal] =
    useState(false);

  const [previewFile, setPreviewFile] =
    useState<string | null>(null);

  const [activeTabNhan, setActiveTabNhan] =
    useState("noi_bo");

  const [advSearch, setAdvSearch] = useState({
    soKyHieu: "",
    trichYeu: "",
    donViSoanThao: "",
    ngayBHFrom: "",
    ngayBHTo: "",
    nguoiSoanThao: "",
    donViNhanNoiBo: "",
    donViNhanLienThong: "",
    vuTCCBCapSo: false,
  });

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(10);

  let filteredData = apiData;

  if (searchKeyword) {
    const kw = removeAccents(searchKeyword);

    filteredData = filteredData.filter(
      (row) =>
        removeAccents(row.trichYeu).includes(kw) ||
        removeAccents(row.soKH).includes(kw) ||
        removeAccents(row.soDi).includes(kw)
    );
  }

  if (activeDateFilter === "today") {
    filteredData = filteredData.filter(
      (row) => row.ngayBH === "25/08/2026"
    );
  } else if (activeDateFilter === "yesterday") {
    filteredData = filteredData.filter(
      (row) => row.ngayBH === "24/08/2026"
    );
  } else if (activeDateFilter === "this_week") {
    filteredData = filteredData.filter(
      (row) =>
        row.ngayBH === "25/08/2026" ||
        row.ngayBH === "24/08/2026" ||
        row.ngayBH === "22/08/2026"
    );
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleRefresh = () => {
    setActiveDateFilter("");
    setSearchKeyword("");
    setSelectedYear("2026");
    setCurrentPage(1);
  };

  const renderModal = (
    content: React.ReactNode
  ) => {
    if (!mounted) return null;

    return createPortal(
      content,
      document.body
    );
  };

  const openDetailModal = async (
    row: any
  ) => {
    setSelectedDocumentId(row.id);
    setShowDetailModal(true);

    setSelectedDoc(null);
    setDetailError("");
    setIsDetailLoading(true);

    try {
      const detail =
        await outgoingService.getDetail(row.id);

      console.log(
        "[OUTGOING DETAIL RESPONSE]",
        detail
      );

      setSelectedDoc(detail);
    } catch (error) {
      console.error(
        "Lỗi khi tải chi tiết văn bản:",
        error
      );

      setDetailError(
        "Không thể tải chi tiết văn bản. Vui lòng thử lại."
      );
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedDoc(null);
    setDetailError("");
    setIsDetailLoading(false);
  };

  const detail = selectedDoc || {};

  const detailSoDi =
    detail.outgoingNumber ??
    detail.soDi ??
    detail.documentInfo?.outgoingNumber ??
    "";

  const detailSoKyHieu =
    detail.referenceNumber ??
    detail.soKH ??
    detail.documentInfo?.referenceNumber ??
    "";

  const detailLoaiVanBan =
    detail.documentType ??
    detail.loaiVanBan ??
    detail.documentInfo?.documentType ??
    "Công văn";

  const detailNgayBanHanh =
    formatDate(
      detail.issueDate ??
        detail.ngayBH ??
        detail.documentInfo?.issueDate
    );

  const detailDoMat =
    detail.confidentiality ??
    detail.securityLevel ??
    detail.doMat ??
    detail.documentInfo?.confidentiality ??
    "Bình thường";

  const detailDoKhan =
    detail.urgency ??
    detail.urgencyLevel ??
    detail.doKhan ??
    detail.documentInfo?.urgency ??
    "Bình thường";

  const detailTrichYeu =
    detail.subject ??
    detail.trichYeu ??
    detail.documentInfo?.subject ??
    "";

  const detailNguoiKy =
    detail.signerName ??
    detail.nguoiKy ??
    detail.signer?.fullName ??
    "";

  const detailChucVuNguoiKy =
    detail.signerPosition ??
    detail.signerTitle ??
    detail.chucVuNguoiKy ??
    detail.signer?.position ??
    "";

  const detailNguoiSoan =
    detail.drafterName ??
    detail.canBoSoanThao ??
    detail.createdByName ??
    detail.drafter?.fullName ??
    "";

  const detailTrangThai =
    detail.status ??
    detail.statusName ??
    "";

  const detailSoCongVan =
    detail.documentBook ??
    detail.bookName ??
    detail.soCongVan ??
    "";

  const detailDonViSoan =
    detail.departmentName ??
    detail.draftingDepartmentName ??
    detail.donViSoan ??
    detail.department?.name ??
    "";

  const detailSoTrang =
    detail.pageCount ??
    detail.soTrang ??
    0;

  const detailAttachments =
    detail.attachments ??
    detail.files ??
    detail.fileAttachments ??
    [];

  const detailComments =
    detail.comments ??
    detail.opinions ??
    [];

  const detailRelatedDocuments =
    detail.relatedDocuments ??
    detail.related ??
    [];

  return (
    <div className="w-full min-h-full bg-white shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-[22px] font-normal text-gray-800">
          Danh sách văn bản đi
        </h1>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center text-[13px] text-[#005fb8]">
            <button
              onClick={() =>
                setActiveDateFilter(
                  activeDateFilter === "today"
                    ? ""
                    : "today"
                )
              }
              className={`hover:underline ${
                activeDateFilter === "today"
                  ? "font-bold"
                  : ""
              }`}
            >
              Hôm nay
            </button>

            <span className="mx-1.5 text-gray-400">
              -
            </span>

            <button
              onClick={() =>
                setActiveDateFilter(
                  activeDateFilter === "yesterday"
                    ? ""
                    : "yesterday"
                )
              }
              className={`hover:underline ${
                activeDateFilter === "yesterday"
                  ? "font-bold"
                  : ""
              }`}
            >
              Hôm qua
            </button>

            <span className="mx-1.5 text-gray-400">
              -
            </span>

            <button
              onClick={() =>
                setActiveDateFilter(
                  activeDateFilter === "this_week"
                    ? ""
                    : "this_week"
                )
              }
              className={`hover:underline ${
                activeDateFilter === "this_week"
                  ? "font-bold"
                  : ""
              }`}
            >
              Tuần này
            </button>

            <span className="mx-1.5 text-gray-400">
              -
            </span>

            <button
              onClick={() =>
                setShowAdvancedSearch(true)
              }
              className="hover:underline flex items-center font-medium"
            >
              Tìm kiếm nâng cao
            </button>

            <button
              onClick={handleRefresh}
              className="ml-2 text-[#005fb8] hover:text-[#004a94] p-1"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Nhập vào từ khóa tìm kiếm"
              value={searchKeyword}
              onChange={(e) =>
                setSearchKeyword(e.target.value)
              }
              className="w-[250px] border border-gray-300 rounded px-3 py-1.5 text-[13px] focus:border-[#005fb8] focus:outline-none placeholder:text-gray-500 text-gray-900"
            />

            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(e.target.value)
              }
              className="border border-gray-300 rounded px-2 py-1.5 text-[13px] focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="w-full border-collapse text-[13px] mb-4">
          <thead>
            <tr>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[5%]">
                Số đi
              </th>

              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[10%]">
                Số KH
              </th>

              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[10%]">
                Ngày BH
              </th>

              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[30%]">
                Trích yếu
              </th>

              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[12%]">
                Cán bộ soạn thảo
              </th>

              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[12%]">
                Người ký
              </th>

              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[15%]">
                Nơi nhận
              </th>

              <th className="py-2.5 px-2 border border-gray-300 text-center bg-white w-[3%]">
                <Paperclip className="w-4 h-4 mx-auto text-gray-600" />
              </th>

              <th className="py-2.5 px-2 border border-gray-300 text-center bg-white w-[3%]">
                <input
                  type="checkbox"
                  className="rounded text-[#005fb8] focus:ring-[#005fb8]"
                />
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-8 text-center bg-gray-50/50 border border-gray-200"
                >
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                    <span>
                      Đang tải dữ liệu...
                    </span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map(
                (row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors text-gray-900"
                  >
                    <td className="py-2.5 px-3 border border-gray-300 text-center">
                      {row.soDi !== "0"
                        ? row.soDi
                        : ""}
                    </td>

                    <td className="py-2.5 px-3 border border-gray-300 text-center text-[#005fb8] font-medium hover:underline cursor-pointer">
                      {row.soKH}
                    </td>

                    <td className="py-2.5 px-3 border border-gray-300 text-center">
                      {row.ngayBH}
                    </td>

                    <td className="py-2.5 px-3 border border-gray-300">
                      <span
                        className="text-[#005fb8] hover:underline cursor-pointer font-medium"
                        onClick={() =>
                          openDetailModal(row)
                        }
                      >
                        {row.trichYeu}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 border border-gray-300 text-center">
                      {row.canBoSoanThao}
                    </td>

                    <td className="py-2.5 px-3 border border-gray-300 text-center">
                      {row.nguoiKy}
                    </td>

                    <td className="py-2.5 px-3 border border-gray-300 text-center">
                      {row.noiNhan}
                    </td>

                    <td className="py-2.5 px-2 border border-gray-300 text-center">
                      {row.hasFile && (
                        <button
                          onClick={() => {
                            setSelectedDocumentId(
                              row.id
                            );
                            setShowAttachmentModal(
                              true
                            );
                          }}
                          className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-[#005fb8] transition-colors"
                        >
                          <Paperclip className="w-4 h-4 mx-auto" />
                        </button>
                      )}
                    </td>

                    <td className="py-2.5 px-2 border border-gray-300 text-center">
                      <input
                        type="checkbox"
                        className="rounded text-[#005fb8] focus:ring-[#005fb8]"
                      />
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="py-8 text-center text-gray-800 bg-gray-50/50 border border-gray-200 font-medium"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {filteredData.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredData.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>

      {showAdvancedSearch &&
        renderModal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
            onClick={() =>
              setShowAdvancedSearch(false)
            }
          >
            <div
              className="bg-white rounded shadow-xl w-[900px] flex flex-col"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
                <h2 className="text-[15px] font-bold text-gray-800">
                  Tìm kiếm nâng cao
                </h2>

                <button
                  onClick={() =>
                    setShowAdvancedSearch(false)
                  }
                  className="text-gray-900 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 text-[13px] text-gray-800">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-[180px] font-bold shrink-0 text-right">
                    Số ký hiệu
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Nhập số ký hiệu"
                      value={advSearch.soKyHieu}
                      onChange={(e) =>
                        setAdvSearch({
                          ...advSearch,
                          soKyHieu:
                            e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-[180px] font-bold shrink-0 mt-1.5 text-right">
                    Trích yếu
                  </div>

                  <div className="flex-1">
                    <textarea
                      rows={2}
                      placeholder="Nhập trích yếu"
                      value={advSearch.trichYeu}
                      onChange={(e) =>
                        setAdvSearch({
                          ...advSearch,
                          trichYeu:
                            e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:border-[#005fb8] focus:outline-none resize-none placeholder:text-gray-500 text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-[180px] font-bold shrink-0 text-right">
                    Chọn ĐV/PB soạn thảo
                  </div>

                  <div className="flex gap-4 w-[280px]">
                    <select
                      value={
                        advSearch.donViSoanThao
                      }
                      onChange={(e) =>
                        setAdvSearch({
                          ...advSearch,
                          donViSoanThao:
                            e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white"
                    >
                      <option value="">
                        Chọn đơn vị/phòng ban...
                      </option>

                      {mockDonVi.map(
                        (dv, idx) => (
                          <option
                            key={idx}
                            value={dv}
                          >
                            {dv}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="font-bold shrink-0 ml-4">
                    Ngày BH
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={
                        advSearch.ngayBHFrom
                      }
                      onChange={(e) =>
                        setAdvSearch({
                          ...advSearch,
                          ngayBHFrom:
                            e.target.value,
                        })
                      }
                      className="w-[130px] border border-gray-300 rounded px-2 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900"
                    />

                    <input
                      type="date"
                      value={
                        advSearch.ngayBHTo
                      }
                      onChange={(e) =>
                        setAdvSearch({
                          ...advSearch,
                          ngayBHTo:
                            e.target.value,
                        })
                      }
                      className="w-[130px] border border-gray-300 rounded px-2 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-[180px] font-bold shrink-0 text-right">
                    Chọn người soạn thảo
                  </div>

                  <div className="w-[280px]">
                    <select
                      value={
                        advSearch.nguoiSoanThao
                      }
                      onChange={(e) =>
                        setAdvSearch({
                          ...advSearch,
                          nguoiSoanThao:
                            e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white"
                    >
                      <option value="">
                        Nhập người soạn thảo...
                      </option>

                      {mockNguoiSoan.map(
                        (ns, idx) => (
                          <option
                            key={idx}
                            value={ns}
                          >
                            {ns}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="w-[160px] font-bold shrink-0 text-right ml-4">
                    Chọn đơn vị nhận nội bộ
                  </div>

                  <div className="flex-1">
                    <select
                      value={
                        advSearch.donViNhanNoiBo
                      }
                      onChange={(e) =>
                        setAdvSearch({
                          ...advSearch,
                          donViNhanNoiBo:
                            e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white"
                    >
                      <option value="">
                        Nhập đơn vị nhận nội bộ...
                      </option>

                      {mockDonViNoiBo.map(
                        (dv, idx) => (
                          <option
                            key={idx}
                            value={dv}
                          >
                            {dv}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-[180px] font-bold shrink-0 text-right">
                    Chọn đơn vị nhận liên thông
                  </div>

                  <div className="w-[280px]">
                    <select
                      value={
                        advSearch.donViNhanLienThong
                      }
                      onChange={(e) =>
                        setAdvSearch({
                          ...advSearch,
                          donViNhanLienThong:
                            e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white"
                    >
                      <option value="">
                        Nhập đơn vị nhận liên thông...
                      </option>

                      {mockDonViLienThong.map(
                        (dv, idx) => (
                          <option
                            key={idx}
                            value={dv}
                          >
                            {dv}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-[180px] font-bold shrink-0 text-right">
                    Vụ TCCB cấp số
                  </div>

                  <div className="w-[280px]">
                    <input
                      type="checkbox"
                      checked={
                        advSearch.vuTCCBCapSo
                      }
                      onChange={(e) =>
                        setAdvSearch({
                          ...advSearch,
                          vuTCCBCapSo:
                            e.target.checked,
                        })
                      }
                      className="rounded text-[#005fb8] focus:ring-[#005fb8]"
                    />
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50/50 rounded-b">
                <button
                  onClick={() => {
                    setShowAdvancedSearch(
                      false
                    );
                    setCurrentPage(1);
                  }}
                  className="flex items-center px-4 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors"
                >
                  <Search className="w-4 h-4 mr-1.5" />
                  Tìm kiếm
                </button>

                <button
                  onClick={() =>
                    setShowAdvancedSearch(false)
                  }
                  className="flex items-center px-4 py-1.5 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-semibold transition-colors"
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

      {showDetailModal &&
        renderModal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40"
            onClick={closeDetailModal}
          >
            <div
              className="bg-white shadow-2xl w-[1100px] max-w-[95vw] max-h-[95vh] flex flex-col rounded-sm overflow-hidden"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 shrink-0">
                <h2 className="text-[18px] font-medium text-gray-800">
                  Chi tiết văn bản đi
                </h2>

                <button
                  onClick={closeDetailModal}
                  className="text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar text-[13px] text-gray-900 bg-white">
                {isDetailLoading ? (
                  <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#005fb8]" />

                    <span>
                      Đang tải chi tiết văn bản...
                    </span>
                  </div>
                ) : detailError ? (
                  <div className="min-h-[300px] flex flex-col items-center justify-center">
                    <div className="text-red-600 mb-4">
                      {detailError}
                    </div>

                    <button
                      onClick={closeDetailModal}
                      className="px-4 py-2 bg-[#ffc107] hover:bg-[#e0a800] rounded text-black font-medium"
                    >
                      Đóng
                    </button>
                  </div>
                ) : selectedDoc ? (
                  <>
                    <fieldset className="border border-gray-300 rounded-sm mb-6 relative pt-4 pb-0 px-0">
                      <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">
                        Thông tin văn bản đi
                      </legend>

                      <div className="w-full">
                        <table className="w-full border-collapse">
                          <tbody>
                            <tr className="border-b border-gray-100">
                              <td className="py-2.5 px-4 font-bold text-gray-800 w-[15%]">
                                Số đi
                              </td>

                              <td className="py-2.5 px-4 w-[35%]">
                                {detailSoDi}
                              </td>

                              <td className="py-2.5 px-4 font-bold text-gray-800 w-[15%] border-l border-gray-100">
                                Số ký hiệu
                              </td>

                              <td className="py-2.5 px-4 w-[35%]">
                                {detailSoKyHieu}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-100 bg-gray-50/50">
                              <td className="py-2.5 px-4 font-bold text-gray-800">
                                Loại văn bản
                              </td>

                              <td className="py-2.5 px-4">
                                {detailLoaiVanBan}
                              </td>

                              <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">
                                Ngày ban hành
                              </td>

                              <td className="py-2.5 px-4">
                                {detailNgayBanHanh}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-100">
                              <td className="py-2.5 px-4 font-bold text-gray-800">
                                Độ mật
                              </td>

                              <td className="py-2.5 px-4">
                                {detailDoMat}
                              </td>

                              <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">
                                Độ khẩn
                              </td>

                              <td className="py-2.5 px-4">
                                {detailDoKhan}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-100 bg-gray-50/50">
                              <td className="py-2.5 px-4 font-bold text-gray-800">
                                Trích yếu
                              </td>

                              <td
                                className="py-2.5 px-4"
                                colSpan={3}
                              >
                                {detailTrichYeu}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-100">
                              <td className="py-2.5 px-4 font-bold text-gray-800">
                                Lãnh đạo được báo cáo
                              </td>

                              <td
                                className="py-2.5 px-4"
                                colSpan={3}
                              >
                                {detail.reportedLeaderName ??
                                  detail.leaderName ??
                                  ""}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-100 bg-gray-50/50">
                              <td className="py-2.5 px-4 font-bold text-gray-800">
                                Người ký
                              </td>

                              <td className="py-2.5 px-4">
                                {detailNguoiKy}
                              </td>

                              <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">
                                Chức vụ
                              </td>

                              <td className="py-2.5 px-4">
                                {detailChucVuNguoiKy}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-100">
                              <td className="py-2.5 px-4 font-bold text-gray-800">
                                Người soạn
                              </td>

                              <td className="py-2.5 px-4">
                                {detailNguoiSoan}
                              </td>

                              <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">
                                Trạng thái
                              </td>

                              <td className="py-2.5 px-4">
                                {detailTrangThai && (
                                  <span className="inline-block px-2 py-0.5 bg-[#198754] text-white text-[11px] font-bold rounded-full">
                                    {detailTrangThai}
                                  </span>
                                )}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-100 bg-gray-50/50">
                              <td className="py-2.5 px-4 font-bold text-gray-800">
                                Sổ công văn
                              </td>

                              <td className="py-2.5 px-4">
                                {detailSoCongVan}
                              </td>

                              <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">
                                PB/Đơn vị soạn
                              </td>

                              <td className="py-2.5 px-4">
                                {detailDonViSoan}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-100">
                              <td className="py-2.5 px-4 font-bold text-gray-800">
                                Số trang
                              </td>

                              <td
                                className="py-2.5 px-4"
                                colSpan={3}
                              >
                                {detailSoTrang}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-100 bg-gray-50/50">
                              <td className="py-3 px-4 font-bold text-gray-800 align-top">
                                Toàn văn
                                <ArrowDownToLine className="w-4 h-4 inline-block ml-1 cursor-pointer hover:text-[#005fb8]" />
                              </td>

                              <td
                                className="py-3 px-4"
                                colSpan={3}
                              >
                                {detailAttachments.length >
                                0 ? (
                                  <div className="flex flex-col gap-1.5">
                                    {detailAttachments.map(
                                      (
                                        file: any,
                                        index: number
                                      ) => {
                                        const fileName =
                                          file.fileName ??
                                          file.name ??
                                          `Tệp ${
                                            index + 1
                                          }`;

                                        const fileUrl =
                                          file.fileUrl ??
                                          file.url ??
                                          file.downloadUrl ??
                                          file.storagePath ??
                                          "#";

                                        return (
                                          <div
                                            key={
                                              file.id ??
                                              index
                                            }
                                            className="flex items-center gap-2"
                                          >
                                            <a
                                              href={
                                                fileUrl
                                              }
                                              target="_blank"
                                              rel="noreferrer"
                                              className="text-[#005fb8] hover:underline text-[13px]"
                                            >
                                              {
                                                fileName
                                              }
                                            </a>

                                            <SearchIcon
                                              className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0"
                                              onClick={() =>
                                                setPreviewFile(
                                                  fileName
                                                )
                                              }
                                            />

                                            <a
                                              href={
                                                fileUrl
                                              }
                                              download
                                            >
                                              <FileDown className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0" />
                                            </a>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-500">
                                    Không có file đính kèm
                                  </span>
                                )}
                              </td>
                            </tr>

                            <tr>
                              <td className="py-2.5 px-4 font-bold text-gray-800">
                                Xuất phát từ dự thảo
                              </td>

                              <td
                                className="py-2.5 px-4"
                                colSpan={3}
                              >
                                {detail.originDraftName ??
                                  detail.sourceDraftName ??
                                  ""}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </fieldset>

                    <fieldset className="border border-gray-300 rounded-sm mb-6 relative pt-4 pb-0 px-0">
                      <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">
                        Ý kiến
                      </legend>

                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-2 px-4 text-center font-bold text-gray-800 w-[20%] border-r border-gray-200">
                              Thời gian
                            </th>

                            <th className="py-2 px-4 text-center font-bold text-gray-800 w-[20%] border-r border-gray-200">
                              Cán bộ
                            </th>

                            <th className="py-2 px-4 text-center font-bold text-gray-800 w-[50%] border-r border-gray-200">
                              Nội dung
                            </th>

                            <th className="py-2 px-4 text-center font-bold text-gray-800 w-[10%]">
                              <Paperclip className="w-4 h-4 mx-auto text-gray-600" />
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {detailComments.length >
                          0 ? (
                            detailComments.map(
                              (
                                item: any,
                                index: number
                              ) => (
                                <tr
                                  key={
                                    item.id ??
                                    index
                                  }
                                  className="border-b border-gray-200"
                                >
                                  <td className="py-2 px-4 text-center border-r border-gray-200">
                                    {formatDate(
                                      item.createdAt ??
                                        item.sentAt ??
                                        item.createdDate
                                    )}
                                  </td>

                                  <td className="py-2 px-4 border-r border-gray-200">
                                    {item.userName ??
                                      item.fullName ??
                                      item.requestedFromUserName ??
                                      ""}
                                  </td>

                                  <td className="py-2 px-4 border-r border-gray-200">
                                    {item.content ??
                                      ""}
                                  </td>

                                  <td className="py-2 px-4 text-center">
                                    {item.hasFile && (
                                      <Paperclip className="w-4 h-4 mx-auto text-gray-600" />
                                    )}
                                  </td>
                                </tr>
                              )
                            )
                          ) : (
                            <tr>
                              <td
                                colSpan={4}
                                className="py-8 text-center text-gray-500 bg-gray-50/50 border-b border-gray-200"
                              >
                                Không có dữ liệu
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      <div className="flex items-center justify-between px-4 py-2 bg-gray-50/50">
                        <div className="flex items-center gap-1 opacity-50 cursor-not-allowed">
                          <button
                            className="p-1 border border-gray-300 bg-white rounded text-gray-500"
                            disabled
                          >
                            <ChevronsLeft className="w-3.5 h-3.5" />
                          </button>

                          <button
                            className="p-1 border border-gray-300 bg-white rounded text-gray-500"
                            disabled
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>

                          <button
                            className="px-2.5 py-0.5 border border-gray-300 bg-[#e9ecef] rounded text-gray-700 text-[12px]"
                            disabled
                          >
                            1
                          </button>

                          <button
                            className="p-1 border border-gray-300 bg-white rounded text-gray-500"
                            disabled
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            className="p-1 border border-gray-300 bg-white rounded text-gray-500"
                            disabled
                          >
                            <ChevronsRight className="w-3.5 h-3.5" />
                          </button>

                          <select
                            className="ml-2 border border-gray-300 rounded px-1 py-1 text-[12px] focus:outline-none bg-white"
                            disabled
                          >
                            <option>10</option>
                          </select>
                        </div>

                        <div className="text-gray-500 text-[12px]">
                          {detailComments.length > 0
                            ? `1-${detailComments.length} / ${detailComments.length}`
                            : "1-0 / 0"}
                        </div>
                      </div>
                    </fieldset>

                    <fieldset className="border border-gray-300 rounded-sm mb-6 relative pt-4 pb-0 px-0 mt-6">
                      <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">
                        Thông tin nơi nhận
                      </legend>

                      <div className="flex border-b border-gray-200 mb-4 px-4 mt-2">
                        <button
                          onClick={() =>
                            setActiveTabNhan(
                              "noi_bo"
                            )
                          }
                          className={`px-4 py-2 text-[14px] flex items-center ${
                            activeTabNhan ===
                            "noi_bo"
                              ? "border border-gray-300 border-b-white text-gray-800 -mb-[1px] bg-white rounded-t z-10"
                              : "text-[#005fb8] hover:underline"
                          }`}
                        >
                          <span
                            className={`${
                              activeTabNhan ===
                              "noi_bo"
                                ? "font-bold text-gray-600"
                                : "text-gray-500"
                            } mr-1`}
                          >
                            1.
                          </span>
                          Nội bộ
                        </button>

                        <button
                          onClick={() =>
                            setActiveTabNhan(
                              "lien_thong"
                            )
                          }
                          className={`px-4 py-2 text-[14px] flex items-center ${
                            activeTabNhan ===
                            "lien_thong"
                              ? "border border-gray-300 border-b-white text-gray-800 -mb-[1px] bg-white rounded-t z-10"
                              : "text-[#005fb8] hover:underline"
                          }`}
                        >
                          <span
                            className={`${
                              activeTabNhan ===
                              "lien_thong"
                                ? "font-bold text-gray-600"
                                : "text-gray-500"
                            } mr-1`}
                          >
                            2.
                          </span>
                          Liên thông
                        </button>

                        <button
                          onClick={() =>
                            setActiveTabNhan(
                              "ngoai_lien_thong"
                            )
                          }
                          className={`px-4 py-2 text-[14px] flex items-center ${
                            activeTabNhan ===
                            "ngoai_lien_thong"
                              ? "border border-gray-300 border-b-white text-gray-800 -mb-[1px] bg-white rounded-t z-10"
                              : "text-[#005fb8] hover:underline"
                          }`}
                        >
                          <span
                            className={`${
                              activeTabNhan ===
                              "ngoai_lien_thong"
                                ? "font-bold text-gray-600"
                                : "text-gray-500"
                            } mr-1`}
                          >
                            3.
                          </span>
                          Ngoài liên thông
                        </button>
                      </div>

                      <div className="px-4 pb-4">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200 bg-gray-50/50">
                              <th className="py-2.5 px-3 text-center font-bold text-gray-800 border-r border-gray-200">
                                Người gửi
                              </th>

                              <th className="py-2.5 px-3 text-center font-bold text-gray-800 border-r border-gray-200">
                                Đơn vị gửi
                              </th>

                              <th className="py-2.5 px-3 text-center font-bold text-gray-800 border-r border-gray-200">
                                Thời gian gửi
                              </th>

                              <th className="py-2.5 px-3 text-center font-bold text-gray-800 border-r border-gray-200">
                                Nơi nhận
                              </th>

                              <th className="py-2.5 px-3 text-center font-bold text-gray-800 border-r border-gray-200">
                                Thời gian nhận
                              </th>

                              <th className="py-2.5 px-3 text-center font-bold text-gray-800 border-r border-gray-200">
                                Hình thức
                              </th>

                              <th className="py-2.5 px-3 text-center font-bold text-gray-800">
                                Trạng thái
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr>
                              <td
                                colSpan={7}
                                className="py-8 text-center text-gray-500 bg-gray-50/50"
                              >
                                Chưa có API dữ liệu nơi nhận
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="flex items-center justify-between px-4 py-2 bg-gray-50/50 border-t border-gray-200">
                        <div className="flex items-center gap-1">
                          <button className="p-1 border border-gray-300 bg-white rounded text-gray-500 hover:bg-gray-100">
                            <ChevronsLeft className="w-3.5 h-3.5" />
                          </button>

                          <button className="p-1 border border-gray-300 bg-white rounded text-gray-500 hover:bg-gray-100">
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>

                          <button className="px-2.5 py-0.5 border border-gray-300 bg-[#e9ecef] rounded text-gray-700 text-[12px]">
                            1
                          </button>

                          <button className="p-1 border border-gray-300 bg-white rounded text-gray-500 hover:bg-gray-100">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <button className="p-1 border border-gray-300 bg-white rounded text-gray-500 hover:bg-gray-100">
                            <ChevronsRight className="w-3.5 h-3.5" />
                          </button>

                          <select className="ml-2 border border-gray-300 rounded px-1 py-1 text-[12px] focus:outline-none bg-white">
                            <option>10</option>
                          </select>
                        </div>

                        <div className="text-gray-500 text-[12px]">
                          1-0 / 0
                        </div>
                      </div>
                    </fieldset>

                    <fieldset className="border border-gray-300 rounded-sm mb-6 relative pt-4 pb-0 px-0">
                      <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">
                        Văn bản liên quan
                      </legend>

                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-2 px-4 text-center font-bold text-gray-800 w-[20%] border-r border-gray-200">
                              Số ký hiệu
                            </th>

                            <th className="py-2 px-4 text-center font-bold text-gray-800 w-[50%] border-r border-gray-200">
                              Trích yếu
                            </th>

                            <th className="py-2 px-4 text-center font-bold text-gray-800 w-[30%]">
                              Cơ quan ban hành
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {detailRelatedDocuments.length >
                          0 ? (
                            detailRelatedDocuments.map(
                              (
                                item: any,
                                index: number
                              ) => (
                                <tr
                                  key={
                                    item.id ??
                                    index
                                  }
                                  className="border-b border-gray-200"
                                >
                                  <td className="py-2 px-4 border-r border-gray-200">
                                    {item.referenceNumber ??
                                      item.documentNumber ??
                                      ""}
                                  </td>

                                  <td className="py-2 px-4 border-r border-gray-200">
                                    {item.subject ??
                                      item.trichYeu ??
                                      ""}
                                  </td>

                                  <td className="py-2 px-4">
                                    {item.issuingUnitName ??
                                      item.issuingOrganization ??
                                      item.unitName ??
                                      ""}
                                  </td>
                                </tr>
                              )
                            )
                          ) : (
                            <tr>
                              <td
                                colSpan={3}
                                className="py-8 text-center text-gray-500 bg-gray-50/50 border-b border-gray-200"
                              >
                                Không có dữ liệu
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      <div className="flex items-center justify-between px-4 py-2 bg-gray-50/50">
                        <div className="flex items-center gap-1 opacity-50 cursor-not-allowed">
                          <button
                            className="p-1 border border-gray-300 bg-white rounded text-gray-500"
                            disabled
                          >
                            <ChevronsLeft className="w-3.5 h-3.5" />
                          </button>

                          <button
                            className="p-1 border border-gray-300 bg-white rounded text-gray-500"
                            disabled
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>

                          <button
                            className="px-2.5 py-0.5 border border-gray-300 bg-[#e9ecef] rounded text-gray-700 text-[12px]"
                            disabled
                          >
                            1
                          </button>

                          <button
                            className="p-1 border border-gray-300 bg-white rounded text-gray-500"
                            disabled
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            className="p-1 border border-gray-300 bg-white rounded text-gray-500"
                            disabled
                          >
                            <ChevronsRight className="w-3.5 h-3.5" />
                          </button>

                          <select
                            className="ml-2 border border-gray-300 rounded px-1 py-1 text-[12px] focus:outline-none bg-white"
                            disabled
                          >
                            <option>10</option>
                          </select>
                        </div>

                        <div className="text-gray-500 text-[12px]">
                          {detailRelatedDocuments.length >
                          0
                            ? `1-${detailRelatedDocuments.length} / ${detailRelatedDocuments.length}`
                            : "1-0 / 0"}
                        </div>
                      </div>
                    </fieldset>
                  </>
                ) : null}
              </div>

              <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end shrink-0">
                <button
                  onClick={closeDetailModal}
                  className="flex items-center px-5 py-1.5 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-bold transition-colors"
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

      <AttachmentModal
        isOpen={showAttachmentModal}
        onClose={() =>
          setShowAttachmentModal(false)
        }
        onPreview={(file) =>
          setPreviewFile(file)
        }
        documentId={selectedDocumentId}
      />

      {previewFile &&
        previewFile
          .toLowerCase()
          .endsWith(".pdf") && (
          <PDFDetailModal
            fileName={previewFile}
            onClose={() =>
              setPreviewFile(null)
            }
          />
        )}

      {previewFile &&
        (previewFile
          .toLowerCase()
          .endsWith(".doc") ||
          previewFile
            .toLowerCase()
            .endsWith(".docx")) && (
          <WordDetailModal
            fileName={previewFile}
            onClose={() =>
              setPreviewFile(null)
            }
          />
        )}
    </div>
  );
}