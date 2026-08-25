import os

filepath = r"c:\Users\AD\Desktop\QLVB\frontend\src\app\van-ban-den\[slug]\page.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

if "const [searchKeyword, setSearchKeyword] = useState" not in content:
    content = content.replace('const [activeDateFilter, setActiveDateFilter] = useState<string>("");', 
                              'const [activeDateFilter, setActiveDateFilter] = useState<string>("");\n  const [searchKeyword, setSearchKeyword] = useState<string>("");')

    replacement_logic = """  const handleRefresh = () => {
    setActiveDateFilter("");
    setSearchKeyword("");
    setSelectedStatuses(["Chưa xử lý", "Đang xử lý", "Đã hoàn thành", "Đã tạm dừng"]);
    setSelectedYear("2026");
    setCurrentPage(1);
  };

  let filteredData = dummyData.filter(row => selectedStatuses.includes(row.trangThai));

  if (searchKeyword) {
    filteredData = filteredData.filter(row => 
      (row.trichYeu && row.trichYeu.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (row.soKyHieu && row.soKyHieu.toLowerCase().includes(searchKeyword.toLowerCase()))
    );
  }

  if (activeDateFilter === "today") {
    filteredData = filteredData.filter(row => row.ngayDen === "24/08/2026");
  } else if (activeDateFilter === "yesterday") {
    filteredData = filteredData.filter(row => row.ngayDen === "23/08/2026");
  } else if (activeDateFilter === "week") {
    filteredData = filteredData.filter(row => row.ngayDen === "24/08/2026" || row.ngayDen === "23/08/2026");
  }"""
    
    # replace the block
    content = content.replace('  let filteredData = dummyData.filter(row => selectedStatuses.includes(row.trangThai));\n\n  if (activeDateFilter === "today") {\n    filteredData = filteredData.filter(row => row.ngayDen === "24/08/2026");\n  } else if (activeDateFilter === "yesterday") {\n    filteredData = filteredData.filter(row => row.ngayDen === "23/08/2026");\n  } else if (activeDateFilter === "week") {\n    filteredData = filteredData.filter(row => row.ngayDen === "24/08/2026" || row.ngayDen === "23/08/2026");\n  }', replacement_logic)
    
    # replace input
    content = content.replace('placeholder="Nhập vào từ khóa tìm kiếm"', 'placeholder="Nhập vào từ khóa tìm kiếm"\n              value={searchKeyword}\n              onChange={(e) => setSearchKeyword(e.target.value)}')
    
    # replace button
    content = content.replace('onClick={() => setActiveDateFilter("")} className="ml-3 text-[#005fb8] hover:bg-blue-50 p-1.5 rounded-full transition-colors"', 'onClick={handleRefresh} className="ml-3 text-[#005fb8] hover:bg-blue-50 p-1.5 rounded-full transition-colors"')

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    
    print("Updated van-ban-den page.tsx")
