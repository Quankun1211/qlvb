"use client";
import { useParams } from "next/navigation";

import ToanBoVanBanTrinh from "./ToanBoVanBanTrinh";
import DangSoanThaoXinYKien from "./DangSoanThaoXinYKien";
import DaPhatHanh from "./DaPhatHanh";
import DaTamDung from "./DaTamDung";
import BiTraVe from "./BiTraVe";

export default function VanBanTrinhSubPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  if (slug === 'toan-bo-van-ban-trinh' || slug === 'vb-trinh-toan-bo') {
    return <ToanBoVanBanTrinh />;
  }
  
  if (slug === 'dang-soan-thao-xin-y-kien') {
    return <DangSoanThaoXinYKien />;
  }

  if (slug === 'da-phat-hanh') {
    return <DaPhatHanh />;
  }

  if (slug === 'da-tam-dung') {
    return <DaTamDung />;
  }

  if (slug === 'bi-tra-ve') {
    return <BiTraVe />;
  }
  
  return (
    <div className="w-full h-full p-6 bg-white shadow-sm rounded border border-gray-200">
      <h1 className="text-xl font-bold mb-4 text-[#005fb8] uppercase border-b pb-2">
        Văn bản trình - {slug.replace(/-/g, ' ')}
      </h1>
      <div className="p-4 bg-gray-50 text-gray-800 rounded border border-dashed border-gray-300 flex items-center justify-center min-h-[300px]">
        <p>Bảng danh sách dữ liệu cho "{slug}" sẽ được hiển thị ở đây.</p>
      </div>
    </div>
  );
}
