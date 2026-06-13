import glob

files = glob.glob('src/**/*.tsx', recursive=True)
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False

    if 'import { Link, usePathname } from "next/navigation";' in content:
        content = content.replace('import { Link, usePathname } from "next/navigation";', 'import { usePathname } from "next/navigation";\nimport Link from "next/link";')
        changed = True

    if changed:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
            print('Updated ' + file)
