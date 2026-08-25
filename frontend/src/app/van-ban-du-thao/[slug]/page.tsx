"use client";
import { useParams } from "next/navigation";
import ToanBoVanBanDuThao from "./ToanBoVanBanDuThao";
import DangSoanThaoXinYKien from "./DangSoanThaoXinYKien";
import DaKyDaPheDuyet from "./DaKyDaPheDuyet";
import DaTamDung from "./DaTamDung";

export default function VanBanDuThaoSubPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  if (slug === 'toan-bo-van-ban-du-thao') {
    return <ToanBoVanBanDuThao />;
  }
  if (slug === 'dang-soan-thao-xin-y-kien') {
    return <DangSoanThaoXinYKien />;
  }
  if (slug === 'da-ky-phe-duyet' || slug === 'da-phat-hanh' || slug === 'da-ky-da-phe-duyet') {
    return <DaKyDaPheDuyet />;
  }
  if (slug === 'da-tam-dung') {
    return <DaTamDung />;
  }

  return (
    <div className="w-full h-full p-6 bg-white shadow-sm rounded border border-gray-200">
      <h1 className="text-xl font-bold mb-4 text-[#005fb8] uppercase border-b pb-2">
        Văn bản dự thảo - {slug.replace(/-/g, ' ')}
      </h1>
      <div className="p-4 bg-gray-50 text-gray-900 rounded border border-dashed border-gray-300 flex items-center justify-center min-h-[300px]">
        <p>Bảng danh sách dữ liệu cho "{slug}" sẽ được hiển thị ở đây.</p>
      </div>
    </div>
  );
}
