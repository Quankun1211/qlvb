import os
import re

files = [
    r"c:\Users\AD\Desktop\QLVB\frontend\src\app\van-ban-trinh\[slug]\DaPhatHanh.tsx",
    r"c:\Users\AD\Desktop\QLVB\frontend\src\app\van-ban-trinh\[slug]\DaTamDung.tsx",
    r"c:\Users\AD\Desktop\QLVB\frontend\src\app\van-ban-trinh\[slug]\DangSoanThaoXinYKien.tsx",
    r"c:\Users\AD\Desktop\QLVB\frontend\src\app\van-ban-trinh\[slug]\ToanBoVanBanTrinh.tsx"
]

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if handleRefresh already exists
    if "const handleRefresh" in content:
        continue
        
    # Replace dummyData filtering logic
    if "const filteredData = dummyData.filter(row => selectedStatuses.includes(row.trangThai));" in content:
        # has statuses
        replacement = """
  const handleRefresh = () => {
    setActiveDateFilter("");
    setSearchKeyword("");
    setSelectedStatuses([...allStatuses]);
    setSelectedYear("2026");
    setCurrentPage(1);
  };

  const dummyData: any[] = [];
  let filteredData = dummyData.filter(row => selectedStatuses.includes(row.trangThai));

  if (searchKeyword) {
    filteredData = filteredData.filter(row => 
      (row.title && row.title.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (row.so && row.so.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (row.nguoi && row.nguoi.toLowerCase().includes(searchKeyword.toLowerCase()))
    );
  }

  if (activeDateFilter === "today") {
    filteredData = filteredData.filter(row => row.ngay === "25/08/2026");
  } else if (activeDateFilter === "yesterday") {
    filteredData = filteredData.filter(row => row.ngay === "24/08/2026");
  } else if (activeDateFilter === "this_week") {
    filteredData = filteredData.filter(row => row.ngay === "25/08/2026" || row.ngay === "24/08/2026");
  }
"""
        content = content.replace("  const dummyData: any[] = [];\n  const filteredData = dummyData.filter(row => selectedStatuses.includes(row.trangThai));", replacement.strip("\n"))
        # Also there's one with data
        content = content.replace("""  const dummyData: any[] = [
    { stt: 1, so: "421/TTr-CYTT", title: "V/v ban hành quy định về quản lý chứng thư số", nguoi: "Lê Nhật Minh", ngay: "24/08/2026", phong: "Phòng Nghiệp vụ", doiTuong: "Cục trưởng", trangThai: "Đã phê duyệt" },
    { stt: 2, so: "422/TTr-CYTT", title: "Tờ trình xin cấp trang thiết bị CNTT năm 2026", nguoi: "Lê Nhật Minh", ngay: "25/08/2026", phong: "Phòng Hành chính", doiTuong: "Cục phó", trangThai: "Đang trình LĐ đơn vị" }
  ];
  
  const filteredData = dummyData.filter(row => selectedStatuses.includes(row.trangThai));""", replacement.replace("  const dummyData: any[] = [];", """  const dummyData: any[] = [
    { stt: 1, so: "421/TTr-CYTT", title: "V/v ban hành quy định về quản lý chứng thư số", nguoi: "Lê Nhật Minh", ngay: "24/08/2026", phong: "Phòng Nghiệp vụ", doiTuong: "Cục trưởng", trangThai: "Đã phê duyệt" },
    { stt: 2, so: "422/TTr-CYTT", title: "Tờ trình xin cấp trang thiết bị CNTT năm 2026", nguoi: "Lê Nhật Minh", ngay: "25/08/2026", phong: "Phòng Hành chính", doiTuong: "Cục phó", trangThai: "Đang trình LĐ đơn vị" }
  ];""").strip("\n"))

    elif "const filteredData = dummyData;" in content:
        # no statuses
        replacement = """
  const handleRefresh = () => {
    setActiveDateFilter("");
    setSearchKeyword("");
    setSelectedYear("2026");
    setCurrentPage(1);
  };

  const dummyData: any[] = [];
  let filteredData = dummyData;

  if (searchKeyword) {
    filteredData = filteredData.filter(row => 
      (row.title && row.title.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (row.so && row.so.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (row.nguoi && row.nguoi.toLowerCase().includes(searchKeyword.toLowerCase()))
    );
  }

  if (activeDateFilter === "today") {
    filteredData = filteredData.filter(row => row.ngay === "25/08/2026");
  } else if (activeDateFilter === "yesterday") {
    filteredData = filteredData.filter(row => row.ngay === "24/08/2026");
  } else if (activeDateFilter === "this_week") {
    filteredData = filteredData.filter(row => row.ngay === "25/08/2026" || row.ngay === "24/08/2026");
  }
"""
        content = content.replace("  const dummyData: any[] = [];\n  const filteredData = dummyData;", replacement.strip("\n"))

    # Update RefreshCcw button
    content = content.replace("""<button className="ml-2 text-[#005fb8] hover:text-[#004a94] p-1"><RefreshCcw className="w-4 h-4" /></button>""", 
                              """<button onClick={handleRefresh} className="ml-2 text-[#005fb8] hover:text-[#004a94] p-1"><RefreshCcw className="w-4 h-4" /></button>""")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"Updated {file_path}")
