import os
import re

directory = r"C:\Users\user\.gemini\antigravity-ide\scratch\economics_website"
folders_to_check = ['app', 'components', 'lib']

for folder in folders_to_check:
    folder_path = os.path.join(directory, folder)
    if not os.path.exists(folder_path):
        continue
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.js'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Replace the color
                new_content = content.replace('#7B6FE7', '#5C4DE3')
                new_content = new_content.replace('#7b6fe7', '#5c4de3')

                # We also want to make sure the font weight in these buttons is a bit thicker
                # Find buttons or divs that use this new color and have font-[500] or font-[600], replace with font-bold
                # A simple way is to use regex to find classNames with the new color and replace font-[500]
                def replace_font(match):
                    cls_str = match.group(0)
                    if 'bg-[#5C4DE3]' in cls_str or 'text-[#5C4DE3]' in cls_str:
                        cls_str = cls_str.replace('font-[500]', 'font-bold')
                        cls_str = cls_str.replace('font-[600]', 'font-bold')
                    return cls_str

                new_content = re.sub(r'className="[^"]+"', replace_font, new_content)

                if content != new_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")
