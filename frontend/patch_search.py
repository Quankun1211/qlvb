import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # If it already has removeAccents, skip
    if 'const removeAccents' in content:
        print(f'Skipping {filepath}, already has removeAccents')
        return

    # Find where to inject removeAccents
    if 'if (searchKeyword) {' not in content:
        return

    remove_accents_func = """  const removeAccents = (str: string | undefined | null) => {
    if (!str) return "";
    return str.toString().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase();
  };
"""
    content = content.replace('if (searchKeyword) {', remove_accents_func + '  if (searchKeyword) {')

    # Replace toLowerCase().includes(kw) with removeAccents().includes(kw)
    content = re.sub(r'const kw = searchKeyword\.toLowerCase\(\);', 'const kw = removeAccents(searchKeyword);', content)
    content = re.sub(r'const kw = searchKeyword;', 'const kw = removeAccents(searchKeyword);', content)
    
    # We can just manually patch the common ones:
    content = re.sub(r'\(?row\.([a-zA-Z0-9_]+)\s*&&\s*row\.\1\.toLowerCase\(\)\.includes\([^)]+\)\)?', r'removeAccents(row.\1).includes(kw)', content)
    content = re.sub(r'row\.([a-zA-Z0-9_]+)\?\.toLowerCase\(\)\.includes\([^)]+\)', r'removeAccents(row.\1).includes(kw)', content)
    content = re.sub(r'row\.([a-zA-Z0-9_]+)\?\.toString\(\)\.includes\([^)]+\)', r'removeAccents(row.\1).includes(kw)', content)
    content = re.sub(r'\(?row\.([a-zA-Z0-9_]+)\s*&&\s*row\.\1\.toString\(\)\.includes\([^)]+\)\)?', r'removeAccents(row.\1).includes(kw)', content)
    content = re.sub(r'row\.([a-zA-Z0-9_]+)\.toLowerCase\(\)\.includes\([^)]+\)', r'removeAccents(row.\1).includes(kw)', content)
    
    # Double check if any `includes(kw)` is left without removeAccents.
    # e.g., if there are multiple conditions separated by ||
    # We already captured them with the above regexes.
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {filepath}')

for root, _, files in os.walk('c:/Users/AD/Desktop/QLVB/frontend/src/app'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
