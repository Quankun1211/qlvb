import os

# Paths to process
paths = [
    r"c:\Users\AD\Desktop\QLVB\frontend\src\app\van-ban-du-thao\[slug]",
    r"c:\Users\AD\Desktop\QLVB\frontend\src\app\van-ban-trinh\[slug]",
    r"c:\Users\AD\Desktop\QLVB\frontend\src\app\van-ban-den\[slug]"
]

for base_path in paths:
    for filename in os.listdir(base_path):
        if filename.endswith(".tsx"):
            filepath = os.path.join(base_path, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            # Fix text colors for inputs, labels, and dropdowns
            content = content.replace('text-gray-700', 'text-gray-900')
            content = content.replace('text-gray-500', 'text-gray-900')
            content = content.replace('placeholder:text-gray-500', 'placeholder:text-gray-700')
            
            # In case we replaced placeholder:text-gray-500 to placeholder:text-gray-900 (because of text-gray-500 replacement)
            content = content.replace('placeholder:text-gray-900', 'placeholder:text-gray-700')
            
            # Write back
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            
            print(f"Fixed colors in {filepath}")
