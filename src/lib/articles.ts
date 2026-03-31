import fs from 'fs'
import path from 'path'

export type ArticleSection = {
  heading: string
  body: string
}

export type Article = {
  slug: string
  category: 'nenkin' | 'souzoku' | 'kaigo'
  title: string
  description: string
  sections: ArticleSection[]
  keywords: string[]
  publishedAt: string
  relatedSlugs?: string[]
}

const ARTICLES_DIR = path.join(process.cwd(), 'src/data/articles')

export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'))
  return files.map(f => {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf-8')
    return JSON.parse(raw) as Article
  })
}

export function getArticlesByCategory(category: Article['category']): Article[] {
  return getAllArticles()
    .filter(a => a.category === category)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getArticleBySlug(slug: string): Article | undefined {
  const filePath = path.join(ARTICLES_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) return undefined
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Article
}

export const CATEGORY_LABELS: Record<Article['category'], string> = {
  nenkin: '年金',
  souzoku: '相続・遺言',
  kaigo: '介護',
}

export const CATEGORY_COLOR: Record<Article['category'], { border: string; bg: string; text: string }> = {
  nenkin:  { border: '#1a3a6b', bg: '#eff4fb', text: '#1a3a6b' },
  souzoku: { border: '#1a5c2e', bg: '#f0f7f2', text: '#1a5c2e' },
  kaigo:   { border: '#7a4200', bg: '#fdf5eb', text: '#7a4200' },
}
