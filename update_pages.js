const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/HP/Documents/flamnow/src/app/admin/(dashboard)';
const dirs = fs.readdirSync(baseDir);

for (const dir of dirs) {
  if (dir === 'hero' || dir === 'about') continue;
  
  const pagePath = path.join(baseDir, dir, 'page.tsx');
  if (!fs.existsSync(pagePath)) continue;
  
  let content = fs.readFileSync(pagePath, 'utf8');
  let originalContent = content;

  // 1. Add state
  if (!content.includes('const [focusedField, setFocusedField]')) {
    content = content.replace(/const \[errorMsg, setErrorMsg\] = useState\(''\)/, "const [errorMsg, setErrorMsg] = useState('')\n  const [focusedField, setFocusedField] = useState<string | null>(null)");
  }

  // 2. Add onFocus/onBlur to inputs
  content = content.replace(/<input([^>]+)value={([^}]+)}([^>]*)>/g, (match, p1, p2, p3) => {
    if (match.includes('onFocus')) return match;
    return `<input${p1}value={${p2}}\n                      onFocus={() => setFocusedField('${p2}')}\n                      onBlur={() => setFocusedField(null)}${p3}>`;
  });

  content = content.replace(/<textarea([^>]+)value={([^}]+)}([^>]*)>/g, (match, p1, p2, p3) => {
    if (match.includes('onFocus')) return match;
    return `<textarea${p1}value={${p2}}\n                      onFocus={() => setFocusedField('${p2}')}\n                      onBlur={() => setFocusedField(null)}${p3}>`;
  });

  // 3. Pass focusedField to Preview components
  content = content.replace(/<([A-Za-z]+Preview)([^>]*)\/>/g, (match, p1, p2) => {
    if (match.includes('focusedField')) return match;
    return `<${p1}${p2}\n              focusedField={focusedField}\n            />`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(pagePath, content, 'utf8');
    console.log('Updated ' + pagePath);
  }
}
