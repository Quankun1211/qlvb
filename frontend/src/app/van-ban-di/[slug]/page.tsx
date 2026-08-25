"use client";
import { useParams } from "next/navigation";
import ToanBoVanBanDi from "./ToanBoVanBanDi";
import VanBanDaPhatHanh from "./VanBanDaPhatHanh";
import VanBanDaPhatHanhCaNhan from "./VanBanDaPhatHanhCaNhan";

export default function VanBanDiSubPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  if (slug === 'toan-bo-van-ban-di') {
    return <ToanBoVanBanDi />;
  }
  if (slug === 'van-ban-da-phat-hanh') {
    return <VanBanDaPhatHanh />;
  }
  if (slug === 'van-ban-da-phat-hanh-cua-ca-nhan') {
    return <VanBanDaPhatHanhCaNhan />;
  }

  return (
    <div className="w-full h-full p-6 bg-white shadow-sm rounded border border-gray-200">
      <h1 className="text-xl font-bold mb-4 text-[#005fb8] uppercase border-b pb-2">
        Văn bản đi - {slug.replace(/-/g, ' ')}
      </h1>
      <div className="p-4 bg-gray-50 text-gray-500 rounded border border-dashed border-gray-300 flex items-center justify-center min-h-[300px]">
        <p>Bảng danh sách dữ liệu cho "{slug}" sẽ được hiển thị ở đây.</p>
      </div>
    </div>
  );
}
