"use client";
import { useParams } from "next/navigation";
import CongViecDuocGiao from "./CongViecDuocGiao";
import CongViecDaGiao from "./CongViecDaGiao";
import HoSoDaTao from "./HoSoDaTao";
import HoSoThamGia from "./HoSoThamGia";
import HoSoDangTheoDoi from "./HoSoDangTheoDoi";

export default function CongViecSubPage() {
  const params = useParams();
  const slug = params.slug as string;
  if (slug === 'cong-viec-duoc-giao') {
    return <CongViecDuocGiao />;
  }
  if (slug === 'cong-viec-da-giao') {
    return <CongViecDaGiao />;
  }
  if (slug === 'ho-so-da-tao') {
    return <HoSoDaTao />;
  }
  if (slug === 'ho-so-tham-gia') {
    return <HoSoThamGia />;
  }
  if (slug === 'ho-so-dang-theo-doi') {
    return <HoSoDangTheoDoi />;
  }

  return (
    <div className="w-full h-full p-6 bg-white shadow-sm rounded border border-gray-200">
      <h1 className="text-xl font-bold mb-4 text-[#005fb8] uppercase border-b pb-2">
        Công việc & Hồ sơ - {slug.replace(/-/g, ' ')}
      </h1>
      <div className="p-4 bg-gray-50 text-gray-500 rounded border border-dashed border-gray-300 flex items-center justify-center min-h-[300px]">
        <p>Bảng danh sách dữ liệu cho "{slug}" sẽ được hiển thị ở đây.</p>
      </div>
    </div>
  );
}
