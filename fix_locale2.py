import glob

files = glob.glob('src/**/*.tsx', recursive=True)
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False

    if ', locale }: ServicesClientProps' in content:
        content = content.replace(', locale }: ServicesClientProps', ' }: ServicesClientProps')
        changed = True

    if 'locale === \'ar\'' in content:
        content = content.replace("${locale === 'ar' ? 'flex-row-reverse' : 'flex-row'}", 'flex-row')
        content = content.replace("${locale === 'ar' ? 'dir-rtl' : 'dir-ltr'}", 'dir-ltr')
        changed = True

    if changed:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
            print('Updated ' + file)
