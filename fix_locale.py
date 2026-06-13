import glob

files = glob.glob('src/**/*.tsx', recursive=True)
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False
    
    # Remove locale params
    if '{ params: { locale } }: { params: { locale: string } }' in content:
        content = content.replace('({ params: { locale } }: { params: { locale: string } })', '()')
        content = content.replace('{ params: { locale } }: { params: { locale: string } }', '')
        changed = True

    if 'locale: string' in content:
        content = content.replace('locale: string;', '')
        content = content.replace('locale: string', '')
        content = content.replace('locale={locale}', '')
        changed = True

    if 'locale === \'ar\'' in content:
        content = content.replace("${locale === 'ar' ? 'dir-rtl' : 'dir-ltr'}", 'dir-ltr')
        changed = True

    if changed:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
            print('Updated ' + file)
