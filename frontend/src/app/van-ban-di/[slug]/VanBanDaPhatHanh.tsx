"use client";

import React, { useState, useEffect } from "react";
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

const mockDonViLienThong = [
  "UBND TP Hà Nội",
  "Bộ Thông tin và Truyền thông",
  "Bộ Công an",
  "Bảo hiểm Xã hội VN",
];

export default function VanBanDaPhatHanh() {
  const [mounted, setMounted] = useState(false);

  const [activeDateFilter, setActiveDateFilter] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [searchKeyword, setSearchKeyword] = useState("");

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [activeTabNhan, setActiveTabNhan] = useState("noi_bo");

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

  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [apiData, setApiData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";

    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) {
      return dateStr;
    }

    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) {
      return dateStr;
    }

    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}
      ${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  };

  const formatRecipientNames = (recipients: any) => {
    if (!recipients) return "";

    if (Array.isArray(recipients)) {
      return recipients
        .map((item) => {
          if (typeof item === "string") return item;

          return (
            item?.name ||
            item?.recipientName ||
            item?.unitName ||
            item?.fullName ||
            ""
          );
        })
        .filter(Boolean)
        .join(", ");
    }

    return String(recipients);
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const res = await outgoingService.getPublished(0, 1000);

      const mapped = (res?.content || []).map((item: any) => ({
        id: item.id,
        documentId: item.documentId || item.document?.id || item.id,

        soDi: item.outgoingNumber || "",
        soKH: item.referenceNumber || item.documentNumber || "",
        ngayBH: formatDate(item.issueDate),

        trichYeu: item.subject || item.summary || "Không có trích yếu",

        nguoiKy:
          item.signerName ||
          item.signer?.fullName ||
          item.signer?.name ||
          "",

        noiNhan: formatRecipientNames(
          item.recipientNames || item.recipients || item.recipientUnits
        ),

        hasFile:
          item.hasFile ??
          item.hasAttachment ??
          (Array.isArray(item.attachments) && item.attachments.length > 0),

        canBoSoanThao:
          item.drafterName ||
          item.drafter?.fullName ||
          item.drafter?.name ||
          "",
      }));

      setApiData(mapped);
    } catch (err) {
      console.error("Không thể tải danh sách văn bản đã phát hành:", err);
      setApiData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const removeAccents = (str: string | undefined | null) => {
    if (!str) return "";

    return str
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  let filteredData = [...apiData];

  if (selectedYear) {
    filteredData = filteredData.filter((row) => {
      if (!row.ngayBH) return true;

      const parts = row.ngayBH.split("/");

      return parts[2] === selectedYear;
    });
  }

  if (searchKeyword) {
    const kw = removeAccents(searchKeyword);

    filteredData = filteredData.filter(
      (row) =>
        removeAccents(row.trichYeu).includes(kw) ||
        removeAccents(row.soKH).includes(kw) ||
        removeAccents(row.soDi).includes(kw) ||
        removeAccents(row.nguoiKy).includes(kw)
    );
  }

  if (activeDateFilter) {
    const now = new Date();

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(today.getDate() + diff);

    filteredData = filteredData.filter((row) => {
      if (!row.ngayBH) return false;

      const [dayValue, monthValue, yearValue] = row.ngayBH
        .split("/")
        .map(Number);

      const rowDate = new Date(
        yearValue,
        monthValue - 1,
        dayValue
      );

      if (activeDateFilter === "today") {
        return (
          rowDate.getFullYear() === today.getFullYear() &&
          rowDate.getMonth() === today.getMonth() &&
          rowDate.getDate() === today.getDate()
        );
      }

      if (activeDateFilter === "yesterday") {
        return (
          rowDate.getFullYear() === yesterday.getFullYear() &&
          rowDate.getMonth() === yesterday.getMonth() &&
          rowDate.getDate() === yesterday.getDate()
        );
      }

      if (activeDateFilter === "this_week") {
        return rowDate >= startOfWeek && rowDate <= today;
      }

      return true;
    });
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleRefresh = () => {
    setActiveDateFilter("");
    setSearchKeyword("");
    setSelectedYear(new Date().getFullYear().toString());
    setCurrentPage(1);
    fetchData();
  };

  const renderModal = (content: React.ReactNode) => {
    if (!mounted) return null;

    return createPortal(content, document.body);
  };

  const openDetailModal = async (row: any) => {
    setShowDetailModal(true);
    setIsDetailLoading(true);

    // Hiển thị dữ liệu từ list trước để modal không bị trống
    setSelectedDoc(row);

    try {
      const detail = await outgoingService.getDetail(row.id);

      console.log("Outgoing detail:", detail);

      // Một số axios wrapper có thể trả response.data
      const data = detail?.data ?? detail;

      setSelectedDoc({
        ...row,
        ...data,

        id: data?.id ?? row.id,
        documentId:
          data?.documentId ??
          data?.document?.id ??
          row.documentId ??
          row.id,

        soDi:
          data?.outgoingNumber ??
          data?.soDi ??
          row.soDi ??
          "",

        soKH:
          data?.referenceNumber ??
          data?.documentNumber ??
          data?.soKyHieu ??
          row.soKH ??
          "",

        ngayBH: formatDate(
          data?.issueDate ??
            data?.ngayBanHanh ??
            data?.publishedDate
        ) || row.ngayBH,

        trichYeu:
          data?.subject ??
          data?.summary ??
          data?.trichYeu ??
          row.trichYeu ??
          "",

        nguoiKy:
          data?.signerName ??
          data?.signer?.fullName ??
          data?.signer?.name ??
          row.nguoiKy ??
          "",

        canBoSoanThao:
          data?.drafterName ??
          data?.drafter?.fullName ??
          data?.drafter?.name ??
          row.canBoSoanThao ??
          "",

        noiNhan:
          formatRecipientNames(
            data?.recipientNames ??
              data?.recipients ??
              data?.recipientUnits
          ) || row.noiNhan,

        loaiVanBan:
          data?.documentTypeName ??
          data?.documentType?.name ??
          data?.documentType ??
          "",

        doMat:
          data?.securityLevelName ??
          data?.securityLevel?.name ??
          data?.securityLevel ??
          "",

        doKhan:
          data?.urgencyLevelName ??
          data?.urgencyLevel?.name ??
          data?.urgencyLevel ??
          "",

        chucVuNguoiKy:
          data?.signerPosition ??
          data?.signer?.position ??
          data?.signerTitle ??
          "",

        trangThai:
          data?.statusName ??
          data?.status ??
          "",

        soCongVan:
          data?.registerBookName ??
          data?.documentBook?.name ??
          data?.bookName ??
          "",

        donViSoanThao:
          data?.draftingUnitName ??
          data?.draftingUnit?.name ??
          data?.issuingUnit?.name ??
          "",

        soTrang:
          data?.pageCount ??
          data?.numberOfPages ??
          0,

        attachments:
          data?.attachments ??
          data?.files ??
          data?.document?.attachments ??
          [],

        comments:
          data?.comments ??
          [],

        internalRecipients:
          data?.internalRecipients ??
          data?.recipientsInternal ??
          [],

        interoperableRecipients:
          data?.interoperableRecipients ??
          data?.recipientsInteroperable ??
          [],

        externalRecipients:
          data?.externalRecipients ??
          data?.recipientsExternal ??
          [],

        relatedDocuments:
          data?.relatedDocuments ??
          [],

        sourceDraft:
          data?.sourceDraft ??
          data?.originDocument ??
          null,
      });
    } catch (err) {
      console.error(
        `Không thể tải chi tiết văn bản đi ID=${row.id}:`,
        err
      );
    } finally {
      setIsDetailLoading(false);
    }
  };

  const getAttachmentName = (file: any) => {
    if (typeof file === "string") return file;

    return (
      file?.fileName ||
      file?.originalFilename ||
      file?.name ||
      file?.objectName ||
      "Tệp đính kèm"
    );
  };

  const getAttachmentPreviewName = (file: any) => {
    if (typeof file === "string") return file;

    return (
      file?.fileName ||
      file?.originalFilename ||
      file?.name ||
      ""
    );
  };

  const handleDownloadFile = (file: any) => {
    const url =
      file?.url ||
      file?.fileUrl ||
      file?.downloadUrl ||
      file?.objectUrl;

    if (url) {
      window.open(url, "_blank");
    }
  };

  const getRecipientRows = () => {
    if (!selectedDoc) return [];

    if (activeTabNhan === "noi_bo") {
      return selectedDoc.internalRecipients || [];
    }

    if (activeTabNhan === "lien_thong") {
      return selectedDoc.interoperableRecipients || [];
    }

    return selectedDoc.externalRecipients || [];
  };

  const recipientRows = getRecipientRows();

  return (
    <div className="w-full min-h-full bg-white shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-[22px] font-normal text-gray-800">
          Danh sách Văn bản đã phát hành
        </h1>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center text-[13px] text-[#005fb8]">
            <button
              onClick={() =>
                setActiveDateFilter(
                  activeDateFilter === "today" ? "" : "today"
                )
              }
              className={`hover:underline ${
                activeDateFilter === "today" ? "font-bold" : ""
              }`}
            >
              Hôm nay
            </button>

            <span className="mx-1.5 text-gray-400">-</span>

            <button
              onClick={() =>
                setActiveDateFilter(
                  activeDateFilter === "yesterday"
                    ? ""
                    : "yesterday"
                )
              }
              className={`hover:underline ${
                activeDateFilter === "yesterday" ? "font-bold" : ""
              }`}
            >
              Hôm qua
            </button>

            <span className="mx-1.5 text-gray-400">-</span>

            <button
              onClick={() =>
                setActiveDateFilter(
                  activeDateFilter === "this_week"
                    ? ""
                    : "this_week"
                )
              }
              className={`hover:underline ${
                activeDateFilter === "this_week" ? "font-bold" : ""
              }`}
            >
              Tuần này
            </button>

            <span className="mx-1.5 text-gray-400">-</span>

            <button
              onClick={() => setShowAdvancedSearch(true)}
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
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[250px] border border-gray-300 rounded px-3 py-1.5 text-[13px] focus:border-[#005fb8] focus:outline-none placeholder:text-gray-500 text-gray-900"
            />

            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1);
              }}
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
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[15%]">
                Số ký hiệu
              </th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[10%]">
                Ngày BH
              </th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[40%]">
                Trích yếu
              </th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[12%]">
                Người ký
              </th>
              <th className="py-2.5 px-3 border border-gray-300 text-center font-bold text-gray-800 bg-white w-[15%]">
                Nơi nhận văn bản
              </th>
              <th className="py-2.5 px-2 border border-gray-300 text-center bg-white w-[3%]">
                <Paperclip className="w-4 h-4 mx-auto text-gray-600" />
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors text-gray-900 border-b border-gray-200"
                >
                  <td className="py-2.5 px-3 text-center">
                    {row.soDi}
                  </td>

                  <td className="py-2.5 px-3 text-center text-[#005fb8] font-medium hover:underline cursor-pointer">
                    {row.soKH}
                  </td>

                  <td className="py-2.5 px-3 text-center text-gray-600">
                    {row.ngayBH}
                  </td>

                  <td className="py-2.5 px-3">
                    <span
                      className="text-[#005fb8] hover:underline cursor-pointer font-medium"
                      onClick={async () => {
                        setSelectedDocumentId(
                          row.documentId || row.id
                        );

                        await openDetailModal(row);
                      }}
                    >
                      {row.trichYeu}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    {row.nguoiKy}
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <span
                      className="line-clamp-2"
                      title={row.noiNhan}
                    >
                      {row.noiNhan}
                    </span>
                  </td>

                  <td className="py-2.5 px-2 text-center">
                    {row.hasFile && (
                      <button
                        onClick={() => {
                          setSelectedDocumentId(
                            row.documentId || row.id
                          );
                          setShowAttachmentModal(true);
                        }}
                        className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-[#005fb8] transition-colors"
                      >
                        <Paperclip className="w-4 h-4 mx-auto" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-8 text-center text-gray-800 bg-gray-50/50 border border-gray-200 font-medium"
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#005fb8] border-t-transparent rounded-full animate-spin mb-2" />
                      <span className="text-gray-500 text-[13px]">
                        Đang tải dữ liệu...
                      </span>
                    </div>
                  ) : (
                    "Không có dữ liệu"
                  )}
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
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* MODAL TÌM KIẾM NÂNG CAO */}
      {showAdvancedSearch &&
        renderModal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
            onClick={() => setShowAdvancedSearch(false)}
          >
            <div
              className="bg-white rounded shadow-xl w-[900px] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
                <h2 className="text-[15px] font-bold text-gray-800">
                  Tìm kiếm nâng cao
                </h2>

                <button
                  onClick={() => setShowAdvancedSearch(false)}
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
                          soKyHieu: e.target.value,
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
                          trichYeu: e.target.value,
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
                      value={advSearch.donViSoanThao}
                      onChange={(e) =>
                        setAdvSearch({
                          ...advSearch,
                          donViSoanThao: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white"
                    >
                      <option value="">
                        Chọn đơn vị/phòng ban...
                      </option>

                      {mockDonVi.map((dv, idx) => (
                        <option key={idx} value={dv}>
                          {dv}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="font-bold shrink-0 ml-4">
                    Ngày BH
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={advSearch.ngayBHFrom}
                      onChange={(e) =>
                        setAdvSearch({
                          ...advSearch,
                          ngayBHFrom: e.target.value,
                        })
                      }
                      className="w-[130px] border border-gray-300 rounded px-2 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900"
                    />

                    <input
                      type="date"
                      value={advSearch.ngayBHTo}
                      onChange={(e) =>
                        setAdvSearch({
                          ...advSearch,
                          ngayBHTo: e.target.value,
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

                  <div className="flex-1">
                    <select
                      value={advSearch.nguoiSoanThao}
                      onChange={(e) =>
                        setAdvSearch({
                          ...advSearch,
                          nguoiSoanThao: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white"
                    >
                      <option value="">
                        Nhập người soạn thảo...
                      </option>

                      {mockNguoiSoan.map((ns, idx) => (
                        <option key={idx} value={ns}>
                          {ns}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-[180px] font-bold shrink-0 text-right">
                    Chọn đơn vị nhận liên thông
                  </div>

                  <div className="w-[280px]">
                    <select
                      value={advSearch.donViNhanLienThong}
                      onChange={(e) =>
                        setAdvSearch({
                          ...advSearch,
                          donViNhanLienThong: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#005fb8] focus:outline-none text-gray-900 bg-white"
                    >
                      <option value="">
                        Nhập đơn vị nhận liên thông...
                      </option>

                      {mockDonViLienThong.map((dv, idx) => (
                        <option key={idx} value={dv}>
                          {dv}
                        </option>
                      ))}
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
                      checked={advSearch.vuTCCBCapSo}
                      onChange={(e) =>
                        setAdvSearch({
                          ...advSearch,
                          vuTCCBCapSo: e.target.checked,
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
                    setShowAdvancedSearch(false);
                    setCurrentPage(1);
                  }}
                  className="flex items-center px-4 py-1.5 bg-[#0078d4] hover:bg-[#005fb8] text-white rounded text-[13px] font-semibold transition-colors"
                >
                  <Search className="w-4 h-4 mr-1.5" />
                  Tìm kiếm
                </button>

                <button
                  onClick={() => setShowAdvancedSearch(false)}
                  className="flex items-center px-4 py-1.5 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-semibold transition-colors"
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

      {/* CHI TIẾT VĂN BẢN ĐI MODAL */}
      {showDetailModal &&
        renderModal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40"
            onClick={() => setShowDetailModal(false)}
          >
            <div
              className="bg-white shadow-2xl w-[1100px] max-w-[95vw] max-h-[95vh] flex flex-col rounded-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 shrink-0">
                <h2 className="text-[18px] font-medium text-gray-800">
                  Chi tiết văn bản đi
                </h2>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar text-[13px] text-gray-900 bg-white">
                {isDetailLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#005fb8] border-t-transparent rounded-full animate-spin mb-3" />
                    <span className="text-gray-500">
                      Đang tải chi tiết văn bản...
                    </span>
                  </div>
                ) : (
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
                                {selectedDoc?.soDi || "-"}
                              </td>

                              <td className="py-2.5 px-4 font-bold text-gray-800 w-[15%] border-l border-gray-100">
                                Số ký hiệu
                              </td>
                              <td className="py-2.5 px-4 w-[35%]">
                                {selectedDoc?.soKH || "-"}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-100 bg-gray-50/50">
                              <td className="py-2.5 px-4 font-bold text-gray-800">
                                Loại văn bản
                              </td>
                              <td className="py-2.5 px-4">
                                {selectedDoc?.loaiVanBan || "-"}
                              </td>

                              <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">
                                Ngày ban hành
                              </td>
                              <td className="py-2.5 px-4">
                                {selectedDoc?.ngayBH || "-"}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-100">
                              <td className="py-2.5 px-4 font-bold text-gray-800">
                                Độ mật
                              </td>
                              <td className="py-2.5 px-4">
                                {selectedDoc?.doMat || "-"}
                              </td>

                              <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">
                                Độ khẩn
                              </td>
                              <td className="py-2.5 px-4">
                                {selectedDoc?.doKhan || "-"}
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
                                {selectedDoc?.trichYeu || "-"}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-100">
                              <td className="py-2.5 px-4 font-bold text-gray-800">
                                Người ký
                              </td>
                              <td className="py-2.5 px-4">
                                {selectedDoc?.nguoiKy || "-"}
                              </td>

                              <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">
                                Chức vụ
                              </td>
                              <td className="py-2.5 px-4">
                                {selectedDoc?.chucVuNguoiKy || "-"}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-100 bg-gray-50/50">
                              <td className="py-2.5 px-4 font-bold text-gray-800">
                                Người soạn
                              </td>
                              <td className="py-2.5 px-4">
                                {selectedDoc?.canBoSoanThao || "-"}
                              </td>

                              <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">
                                Trạng thái
                              </td>
                              <td className="py-2.5 px-4">
                                <span className="inline-block px-2 py-0.5 bg-[#198754] text-white text-[11px] font-bold rounded-full">
                                  {selectedDoc?.trangThai || "-"}
                                </span>
                              </td>
                            </tr>

                            <tr className="border-b border-gray-100">
                              <td className="py-2.5 px-4 font-bold text-gray-800">
                                Sổ công văn
                              </td>
                              <td className="py-2.5 px-4">
                                {selectedDoc?.soCongVan || "-"}
                              </td>

                              <td className="py-2.5 px-4 font-bold text-gray-800 border-l border-gray-100">
                                PB/Đơn vị soạn
                              </td>
                              <td className="py-2.5 px-4">
                                {selectedDoc?.donViSoanThao || "-"}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-100 bg-gray-50/50">
                              <td className="py-2.5 px-4 font-bold text-gray-800">
                                Số trang
                              </td>
                              <td
                                className="py-2.5 px-4"
                                colSpan={3}
                              >
                                {selectedDoc?.soTrang ?? 0}
                              </td>
                            </tr>

                            <tr className="border-b border-gray-100">
                              <td className="py-3 px-4 font-bold text-gray-800 align-top">
                                Toàn văn
                                <ArrowDownToLine className="w-4 h-4 inline-block ml-1" />
                              </td>

                              <td
                                className="py-3 px-4"
                                colSpan={3}
                              >
                                {Array.isArray(
                                  selectedDoc?.attachments
                                ) &&
                                selectedDoc.attachments.length > 0 ? (
                                  <div className="flex flex-col gap-1.5">
                                    {selectedDoc.attachments.map(
                                      (file: any, index: number) => {
                                        const fileName =
                                          getAttachmentName(file);

                                        return (
                                          <div
                                            key={
                                              file?.id ||
                                              `${fileName}-${index}`
                                            }
                                            className="flex items-center gap-2"
                                          >
                                            <button
                                              type="button"
                                              className="text-left text-[#005fb8] hover:underline text-[13px]"
                                              onClick={() =>
                                                setPreviewFile(
                                                  getAttachmentPreviewName(
                                                    file
                                                  )
                                                )
                                              }
                                            >
                                              {fileName}
                                            </button>

                                            <SearchIcon
                                              className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0"
                                              onClick={() =>
                                                setPreviewFile(
                                                  getAttachmentPreviewName(
                                                    file
                                                  )
                                                )
                                              }
                                            />

                                            <FileDown
                                              className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#005fb8] shrink-0"
                                              onClick={() =>
                                                handleDownloadFile(file)
                                              }
                                            />
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-500">
                                    Không có tệp đính kèm
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
                                {selectedDoc?.sourceDraft ? (
                                  <span className="text-[#005fb8] hover:underline">
                                    {selectedDoc.sourceDraft?.subject ||
                                      selectedDoc.sourceDraft?.trichYeu ||
                                      selectedDoc.sourceDraft?.name ||
                                      selectedDoc.sourceDraft}
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </fieldset>

                    {/* Ý KIẾN */}
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
                          {Array.isArray(selectedDoc?.comments) &&
                          selectedDoc.comments.length > 0 ? (
                            selectedDoc.comments.map(
                              (comment: any, index: number) => (
                                <tr
                                  key={comment?.id || index}
                                  className="border-b border-gray-200"
                                >
                                  <td className="py-2.5 px-4 text-center border-r border-gray-200">
                                    {formatDateTime(
                                      comment?.createdAt ||
                                        comment?.createdDate
                                    )}
                                  </td>

                                  <td className="py-2.5 px-4 text-center border-r border-gray-200">
                                    {comment?.userName ||
                                      comment?.user?.fullName ||
                                      comment?.authorName ||
                                      "-"}
                                  </td>

                                  <td className="py-2.5 px-4 border-r border-gray-200">
                                    {comment?.content ||
                                      comment?.message ||
                                      "-"}
                                  </td>

                                  <td className="py-2.5 px-4 text-center">
                                    <Paperclip className="w-4 h-4 mx-auto text-gray-400" />
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
                    </fieldset>

                    {/* THÔNG TIN NƠI NHẬN */}
                    <fieldset className="border border-gray-300 rounded-sm mb-6 relative pt-4 pb-0 px-0 mt-6">
                      <legend className="text-[14px] font-bold text-gray-800 px-2 bg-white absolute -top-3 left-4">
                        Thông tin nơi nhận
                      </legend>

                      <div className="flex border-b border-gray-200 mb-4 px-4 mt-2">
                        <button
                          onClick={() =>
                            setActiveTabNhan("noi_bo")
                          }
                          className={`px-4 py-2 text-[14px] flex items-center ${
                            activeTabNhan === "noi_bo"
                              ? "border border-gray-300 border-b-white text-gray-800 -mb-[1px] bg-white rounded-t z-10"
                              : "text-[#005fb8] hover:underline"
                          }`}
                        >
                          <span
                            className={`${
                              activeTabNhan === "noi_bo"
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
                            setActiveTabNhan("lien_thong")
                          }
                          className={`px-4 py-2 text-[14px] flex items-center ${
                            activeTabNhan === "lien_thong"
                              ? "border border-gray-300 border-b-white text-gray-800 -mb-[1px] bg-white rounded-t z-10"
                              : "text-[#005fb8] hover:underline"
                          }`}
                        >
                          <span
                            className={`${
                              activeTabNhan === "lien_thong"
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
                            {recipientRows.length > 0 ? (
                              recipientRows.map(
                                (
                                  recipient: any,
                                  index: number
                                ) => (
                                  <tr
                                    key={
                                      recipient?.id || index
                                    }
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                  >
                                    <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">
                                      {recipient?.senderName ||
                                        recipient?.sender?.fullName ||
                                        "-"}
                                    </td>

                                    <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">
                                      {recipient?.senderUnitName ||
                                        recipient?.senderUnit
                                          ?.name ||
                                        "-"}
                                    </td>

                                    <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">
                                      {formatDateTime(
                                        recipient?.sentAt ||
                                          recipient?.sendTime
                                      )}
                                    </td>

                                    <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">
                                      {recipient?.recipientName ||
                                        recipient?.unitName ||
                                        recipient?.unit?.name ||
                                        recipient?.name ||
                                        "-"}
                                    </td>

                                    <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">
                                      {formatDateTime(
                                        recipient?.receivedAt ||
                                          recipient?.receiveTime
                                      )}
                                    </td>

                                    <td className="py-2.5 px-3 text-gray-900 border-r border-gray-200">
                                      {recipient?.deliveryMethod ||
                                        recipient?.method ||
                                        "-"}
                                    </td>

                                    <td className="py-2.5 px-3 text-gray-900">
                                      {recipient?.statusName ||
                                        recipient?.status ||
                                        "-"}
                                    </td>
                                  </tr>
                                )
                              )
                            ) : (
                              <tr>
                                <td
                                  colSpan={7}
                                  className="py-8 text-center text-gray-500 bg-gray-50/50 border-b border-gray-200"
                                >
                                  Không có dữ liệu
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </fieldset>

                    {/* VĂN BẢN LIÊN QUAN */}
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
                          {Array.isArray(
                            selectedDoc?.relatedDocuments
                          ) &&
                          selectedDoc.relatedDocuments.length >
                            0 ? (
                            selectedDoc.relatedDocuments.map(
                              (document: any, index: number) => (
                                <tr
                                  key={document?.id || index}
                                  className="border-b border-gray-200"
                                >
                                  <td className="py-2.5 px-4 border-r border-gray-200">
                                    {document?.referenceNumber ||
                                      document?.documentNumber ||
                                      "-"}
                                  </td>

                                  <td className="py-2.5 px-4 border-r border-gray-200">
                                    {document?.subject ||
                                      document?.summary ||
                                      "-"}
                                  </td>

                                  <td className="py-2.5 px-4">
                                    {document?.issuingUnitName ||
                                      document?.issuingUnit?.name ||
                                      document?.organizationName ||
                                      "-"}
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
                    </fieldset>
                  </>
                )}
              </div>

              <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end shrink-0">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex items-center px-5 py-1.5 bg-[#ffc107] hover:bg-[#e0a800] text-black rounded text-[13px] font-bold transition-colors"
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ATTACHMENT MODAL */}
      <AttachmentModal
        isOpen={showAttachmentModal}
        onClose={() => setShowAttachmentModal(false)}
        onPreview={(file) => setPreviewFile(file)}
        documentId={selectedDocumentId}
      />

      {/* PDF PREVIEW */}
      {previewFile &&
        previewFile.toLowerCase().endsWith(".pdf") && (
          <PDFDetailModal
            fileName={previewFile}
            onClose={() => setPreviewFile(null)}
          />
        )}

      {/* WORD PREVIEW */}
      {previewFile &&
        (previewFile.toLowerCase().endsWith(".doc") ||
          previewFile.toLowerCase().endsWith(".docx")) && (
          <WordDetailModal
            fileName={previewFile}
            onClose={() => setPreviewFile(null)}
          />
        )}
    </div>
  );
}