import os
import re

exclude_files = [
    os.path.normpath('c:/Users/AD/Desktop/QLVB/frontend/src/app/van-ban-den/[slug]/page.tsx'),
    os.path.normpath('c:/Users/AD/Desktop/QLVB/frontend/src/app/van-ban-di/[slug]/ToanBoVanBanDi.tsx'),
    os.path.normpath('c:/Users/AD/Desktop/QLVB/frontend/src/app/cong-viec/[slug]/CongViecDuocGiao.tsx')
]

def process_file(filepath):
    if os.path.normpath(filepath) in exclude_files:
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False

    # 1. Fix the kw undefined issue in `if (searchKeyword) {`
    if 'if (searchKeyword) {' in content and 'const kw = removeAccents(searchKeyword);' not in content:
        # Some files have `if (searchKeyword)` but no `kw`. We insert it.
        content = content.replace('if (searchKeyword) {\n    filteredData = filteredData.filter(', 
                                  'if (searchKeyword) {\n    const kw = removeAccents(searchKeyword);\n    filteredData = filteredData.filter(')
        # Handle cases where it's not immediately followed by filteredData
        content = content.replace('if (searchKeyword) {\n      filteredData = filteredData.filter(', 
                                  'if (searchKeyword) {\n      const kw = removeAccents(searchKeyword);\n      filteredData = filteredData.filter(')
        changed = True

    # 2. Fix the kw undefined issue in advSearch blocks.
    # The regex we used before replaced ANY `toLowerCase().includes(...)` with `removeAccents(...).includes(kw)`.
    # Let's revert `includes(kw)` to `includes(removeAccents(advSearch.noiDung))` etc. where appropriate.
    # It's easier to find `advSearch.xxx` and fix the `includes(kw)`.
    if 'advSearch.noiDung' in content:
        content = content.replace('removeAccents(row.title).includes(kw) ||\n        removeAccents(row.noiDung).includes(kw)', 
                                  'removeAccents(row.title).includes(removeAccents(advSearch.noiDung)) ||\n        removeAccents(row.noiDung).includes(removeAccents(advSearch.noiDung))')
        changed = True
    if 'advSearch.phongBan' in content:
        content = content.replace('removeAccents(row.phongBan).includes(kw)', 
                                  'removeAccents(row.phongBan).includes(removeAccents(advSearch.phongBan))')
        changed = True

    # Check for other advSearch usages in other files
    # van-ban-trinh might have it.
    if 'advSearch.trichYeu' in content:
        content = content.replace('removeAccents(row.trichYeu).includes(kw) ||\n        removeAccents(row.soKyHieu).includes(kw)', 
                                  'removeAccents(row.trichYeu).includes(removeAccents(advSearch.trichYeu)) ||\n        removeAccents(row.soKyHieu).includes(removeAccents(advSearch.trichYeu))')
        changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed {filepath}')

for root, _, files in os.walk('c:/Users/AD/Desktop/QLVB/frontend/src/app'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
