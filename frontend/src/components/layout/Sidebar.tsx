"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { 
  FileText, ChevronDown, ChevronRight, FileSignature, FileEdit, Briefcase, Send,
  Radio, BookUser, BadgeInfo, FilePenLine, Users, Undo2, Keyboard, FileOutput,
  CircleStop, RotateCcw, Tag, ClipboardList, FileSearch, FileUp, User, Activity,
  FileBox, FileCheck, FolderKanban
} from "lucide-react";
import Link from "next/link";
import { useAppContext } from "@/app/AppProvider";

type SubItem = { id: string; label: string; icon?: React.ReactNode; href: string; };
type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  prefix: string;
  subItems?: (SubItem | { id: string; label: string; icon?: React.ReactNode; subItems: SubItem[] })[];
};

const defaultListIcon = <FileText className="w-3.5 h-3.5" />;

const menuData: MenuItem[] = [
  {
    id: "van-ban-den",
    label: "Văn bản đến",
    prefix: "/van-ban-den",
    icon: <FileText className="w-4 h-4 mr-2" />,
    subItems: [
      { id: "vb-den-don-vi", label: "Toàn bộ văn bản đến Đơn vị", icon: <FileText className="w-4 h-4" />, href: "/van-ban-den/toan-bo-van-ban-den-don-vi" },
      { id: "vb-den-cua-toi", label: "Văn bản đến của tôi", icon: <Activity className="w-4 h-4" />, href: "/van-ban-den/van-ban-den-cua-toi" },
      { id: "vb-den-da-giao", label: "Toàn bộ văn bản đã giao", icon: <FileCheck className="w-4 h-4" />, href: "/van-ban-den/toan-bo-van-ban-da-giao" },
      { id: "vb-den-noi-bo", label: "Văn bản đến nội bộ", icon: <FileBox className="w-4 h-4" />, href: "/van-ban-den/van-ban-den-noi-bo" },
      { id: "vb-den-nhom", label: "Quản lý nhóm đơn vị hay dùng", icon: <Users className="w-4 h-4" />, href: "/van-ban-den/quan-ly-nhom-don-vi-hay-dung" },
      { id: "vb-den-tra-lai", label: "Văn bản đến trả lại", icon: <Undo2 className="w-4 h-4" />, href: "/van-ban-den/van-ban-den-tra-lai" },
    ]
  },
  {
    id: "van-ban-trinh",
    label: "Văn bản trình",
    prefix: "/van-ban-trinh",
    icon: <ClipboardList className="w-4 h-4 mr-2" />,
    subItems: [
      { id: "vb-trinh-toan-bo", label: "Toàn bộ văn bản trình", icon: <Activity className="w-4 h-4" />, href: "/van-ban-trinh/toan-bo-van-ban-trinh" },
      { id: "vb-trinh-dang-soan", label: "Đang soạn thảo/Xin ý kiến", icon: <Keyboard className="w-4 h-4" />, href: "/van-ban-trinh/dang-soan-thao-xin-y-kien" },
      { id: "vb-trinh-da-phat-hanh", label: "Đã phát hành", icon: <FileOutput className="w-4 h-4" />, href: "/van-ban-trinh/da-phat-hanh" },
      { id: "vb-trinh-da-tam-dung", label: "Đã tạm dừng", icon: <CircleStop className="w-4 h-4" />, href: "/van-ban-trinh/da-tam-dung" },
      { id: "vb-trinh-bi-tra-ve", label: "Bị trả về", icon: <RotateCcw className="w-4 h-4" />, href: "/van-ban-trinh/bi-tra-ve" },
    ]
  },
  {
    id: "van-ban-du-thao",
    label: "Văn bản dự thảo",
    prefix: "/van-ban-du-thao",
    icon: <FileEdit className="w-4 h-4 mr-2" />,
    subItems: [
      { id: "vb-dt-toan-bo", label: "Toàn bộ văn bản dự thảo", icon: <FileText className="w-4 h-4" />, href: "/van-ban-du-thao/toan-bo-van-ban-du-thao" },
      { id: "vb-dt-dang-soan", label: "Đang soạn thảo/Xin ý kiến", icon: <Keyboard className="w-4 h-4" />, href: "/van-ban-du-thao/dang-soan-thao-xin-y-kien" },
      { id: "vb-dt-da-ky", label: "Đã ký, phê duyệt", icon: <Tag className="w-4 h-4" />, href: "/van-ban-du-thao/da-ky-phe-duyet" },
      { id: "vb-dt-da-tam-dung", label: "Đã tạm dừng", icon: <CircleStop className="w-4 h-4" />, href: "/van-ban-du-thao/da-tam-dung" },
    ]
  },
  {
    id: "cong-viec",
    label: "Công việc - Hồ sơ công việc",
    prefix: "/cong-viec",
    icon: <FolderKanban className="w-4 h-4 mr-2" />,
    subItems: [
      { 
        id: "cv-cong-viec", 
        label: "Công việc",
        icon: <Briefcase className="w-4 h-4" />,
        subItems: [
          { id: "cv-duoc-giao", label: "Công việc được giao", icon: <Radio className="w-4 h-4" />, href: "/cong-viec/cong-viec-duoc-giao" },
          { id: "cv-da-giao", label: "Công việc đã giao", icon: <FileText className="w-4 h-4" />, href: "/cong-viec/cong-viec-da-giao" },
        ]
      },
      { 
        id: "cv-ho-so", 
        label: "Hồ sơ công việc",
        icon: <BookUser className="w-4 h-4" />,
        subItems: [
          { id: "hs-da-tao", label: "Hồ sơ đã tạo", icon: <User className="w-4 h-4" />, href: "/cong-viec/ho-so-da-tao" },
          { id: "hs-tham-gia", label: "Hồ sơ tham gia", icon: <FilePenLine className="w-4 h-4" />, href: "/cong-viec/ho-so-tham-gia" },
          { id: "hs-theo-doi", label: "Hồ sơ đang theo dõi", icon: <FileText className="w-4 h-4" />, href: "/cong-viec/ho-so-dang-theo-doi" },
        ]
      },
    ]
  },
  {
    id: "van-ban-di",
    label: "Văn bản đi",
    prefix: "/van-ban-di",
    icon: <Send className="w-4 h-4 mr-2" />,
    subItems: [
      { id: "vb-di-toan-bo", label: "Toàn bộ văn bản đi", icon: <FileSearch className="w-4 h-4" />, href: "/van-ban-di/toan-bo-van-ban-di" },
      { id: "vb-di-da-phat-hanh", label: "Văn bản đã phát hành", icon: <FileUp className="w-4 h-4" />, href: "/van-ban-di/van-ban-da-phat-hanh" },
      { id: "vb-di-ca-nhan", label: "Văn bản đã phát hành của cá nhân", icon: <User className="w-4 h-4" />, href: "/van-ban-di/van-ban-da-phat-hanh-cua-ca-nhan" },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { activeNav } = useAppContext();

  // If activeNav is 'ban-lam-viec', render Full Dashboard Sidebar mode
  const isDashboard = activeNav === "ban-lam-viec";

  // For contextual sidebar (nested pages)
  const [openContextMenus, setOpenContextMenus] = useState<Record<string, boolean>>({
    "cv-cong-viec": true,
    "cv-ho-so": true,
  });
  
  // For full sidebar (Dashboard)
  const [openRootMenus, setOpenRootMenus] = useState<Record<string, boolean>>({
    "van-ban-den": true,
    "van-ban-trinh": true,
    "van-ban-du-thao": true,
    "cong-viec": true,
    "van-ban-di": true,
  });

  const toggleContextMenu = (id: string) => setOpenContextMenus(p => ({ ...p, [id]: !p[id] }));
  const toggleRootMenu = (id: string) => setOpenRootMenus(p => ({ ...p, [id]: !p[id] }));

  // Helper to render nested sub-items
  const renderNestedItems = (items: any[], isFullSidebar = false) => {
    return items.map(item => {
      if (item.subItems) {
        const isOpen = isFullSidebar ? openRootMenus[item.id] : openContextMenus[item.id];
        const toggle = isFullSidebar ? toggleRootMenu : toggleContextMenu;
        return (
          <div key={item.id} className="border-b border-gray-100 last:border-0">
            <button
              onClick={() => toggle(item.id)}
              className={`w-full flex items-start justify-between px-3 py-2.5 transition-colors hover:bg-gray-50 text-gray-800 font-semibold ${isFullSidebar ? 'text-xs' : 'text-[13px] pl-6'}`}
            >
              <div className="flex items-start flex-1 pr-2">
                <span className="mr-2 mt-0.5 text-black shrink-0">{item.icon || defaultListIcon}</span>
                <span className="flex-1 whitespace-normal text-left leading-tight">{item.label}</span>
              </div>
              {isOpen ? <ChevronDown className="w-4 h-4 shrink-0 mt-0.5" /> : <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" />}
            </button>
            {isOpen && (
              <div className="flex flex-col bg-white">
                {item.subItems.map((sub: any) => {
                  const isSubActive = pathname === sub.href;
                  return (
                    <Link 
                      key={sub.id} href={sub.href}
                      className={`flex items-start px-3 py-2.5 transition-colors text-left border-b border-gray-50 last:border-0 ${
                        isSubActive ? "bg-[#005fb8] text-white font-semibold" : "hover:bg-blue-50 text-gray-700 hover:text-[#0070c0]"
                      } ${isFullSidebar ? 'text-[11px] pl-10' : 'text-[13px] pl-8'}`}
                    >
                      <div className={`mr-2 mt-0.5 shrink-0 ${isSubActive ? "text-white" : "text-black"}`}>{sub.icon || defaultListIcon}</div>
                      <span className="flex-1 whitespace-normal leading-tight">{sub.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      const isItemActive = pathname === item.href;
      return (
        <Link 
          key={item.id} href={item.href}
          className={`w-full flex items-start px-3 py-2.5 transition-colors text-left border-b border-gray-100 last:border-0 ${
            isItemActive ? "bg-[#005fb8] text-white font-semibold" : "hover:bg-blue-50 text-gray-800 hover:text-[#0070c0]"
          } ${isFullSidebar ? 'text-xs pl-8' : 'text-[13px]'}`}
        >
          <div className={`mr-2 mt-0.5 shrink-0 ${isItemActive ? "text-white" : "text-black"}`}>{item.icon || defaultListIcon}</div>
          <span className="flex-1 whitespace-normal leading-tight">{item.label}</span>
        </Link>
      );
    });
  };

  // 1. Full Dashboard Sidebar
  if (isDashboard) {
    return (
      <aside className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto shrink-0 shadow-sm custom-scrollbar">
        <nav className="flex flex-col">
          {menuData.map(rootItem => (
            <div key={rootItem.id} className="border-b border-gray-200 last:border-0">
              <button
                onClick={() => toggleRootMenu(rootItem.id)}
                className="w-full flex items-start justify-between px-3 py-2.5 transition-colors hover:bg-gray-50 text-gray-900 font-bold text-xs uppercase"
              >
                <div className="flex items-start flex-1 pr-2">
                  <span className="mr-2 mt-0.5 text-black shrink-0">{rootItem.icon}</span>
                  <span className="flex-1 whitespace-normal text-left leading-tight">{rootItem.label}</span>
                </div>
                {openRootMenus[rootItem.id] ? <ChevronDown className="w-4 h-4 shrink-0 mt-0.5" /> : <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" />}
              </button>
              {openRootMenus[rootItem.id] && rootItem.subItems && (
                <div className="flex flex-col bg-white">
                  {renderNestedItems(rootItem.subItems, true)}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    );
  }

  // 2. Contextual Sidebar (when inside a module)
  const activeMenu = menuData.find(m => m.id === activeNav);
  
  if (!activeMenu || !activeMenu.subItems) {
    return null; // fallback if state is out of sync or invalid
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto shrink-0 shadow-sm custom-scrollbar">
      <nav className="flex flex-col">
        {renderNestedItems(activeMenu.subItems, false)}
      </nav>
    </aside>
  );
}
