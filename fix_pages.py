import sys

def replace_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace('.order("title_en",', '.order("title",')
    content = content.replace('.order("question_en",', '.order("question",')

    content = content.replace('title: (s.title_en || s.title),', 'title: s.title,')
    content = content.replace('tagline: (s.tagline_en || s.tagline),', 'tagline: s.tagline,')
    content = content.replace('description: (s.description_en || s.description),', 'description: s.description,')
    content = content.replace('features: (s.features_en || s.features),', 'features: s.features,')
    content = content.replace('benefits: (s.benefits_en || s.benefits),', 'benefits: s.benefits,')

    content = content.replace('title: (p.title_en || p.title),', 'title: p.title,')
    content = content.replace('tagline: (p.tagline_en || p.tagline),', 'tagline: p.tagline,')
    content = content.replace('description: (p.description_en || p.description),', 'description: p.description,')
    content = content.replace('category: (p.category_en || p.category),', 'category: p.category,')
    content = content.replace('client: (p.client_en || p.client),', 'client: p.client,')
    content = content.replace('year: (p.year_en || p.year),', 'year: p.year,')
    content = content.replace('results: (p.results_en || p.results),', 'results: p.results,')

    content = content.replace('author: (t.author_en || t.author),', 'author: t.author,')
    content = content.replace('role: (t.role_en || t.role),', 'role: t.role,')
    content = content.replace('quote: (t.quote_en || t.quote),', 'quote: t.quote,')

    content = content.replace('question: (f.question_en || f.question),', 'question: f.question,')
    content = content.replace('answer: (f.answer_en || f.answer),', 'answer: f.answer,')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replace_file('src/app/page.tsx')
replace_file('src/app/projects/page.tsx')
replace_file('src/app/services/page.tsx')
