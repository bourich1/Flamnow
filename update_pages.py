import re
import os
import glob

base_dir = r'c:\Users\HP\Documents\flamnow\src\app\admin\(dashboard)'
pages = glob.glob(os.path.join(base_dir, '*', 'page.tsx'))

for page_path in pages:
    if 'hero' in page_path or 'about' in page_path:
        continue
    
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False

    if 'const [focusedField, setFocusedField]' not in content:
        if "const [errorMsg, setErrorMsg] = useState('')" in content:
            content = content.replace("const [errorMsg, setErrorMsg] = useState('')", "const [errorMsg, setErrorMsg] = useState('')\n  const [focusedField, setFocusedField] = useState<string | null>(null)")
            changed = True

    # Add to inputs
    def replace_input(m):
        full_match = m.group(0)
        var_name = m.group(1)
        if 'onFocus' in full_match: return full_match
        return full_match.replace('value={' + var_name + '}', f'value={{{var_name}}}\n                      onFocus={{() => setFocusedField(\'{var_name}\')}}\n                      onBlur={{() => setFocusedField(null)}}')

    new_content = re.sub(r'<input[^>]*value={([^}]+)}[^>]*>', replace_input, content)
    if new_content != content:
        content = new_content
        changed = True

    new_content = re.sub(r'<textarea[^>]*value={([^}]+)}[^>]*>', replace_input, content)
    if new_content != content:
        content = new_content
        changed = True

    # Pass focusedField to Previews
    def inject_prop(m):
        if 'focusedField' in m.group(0): return m.group(0)
        return m.group(0).replace('/>', 'focusedField={focusedField}\n            />')
        
    new_content = re.sub(r'<[A-Za-z]+Preview[^>]*/>', inject_prop, content)
    if new_content != content:
        content = new_content
        changed = True

    if changed:
        with open(page_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {page_path}')
