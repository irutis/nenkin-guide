import { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'
import { PREFECTURES } from '@/data/prefectures'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nenkin-guide.jp'
  const today = new Date().toISOString()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: today, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/nenkin`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/souzoku`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/kaigo`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/simulator`, lastModified: today, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: today, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: today, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified: today, changeFrequency: 'monthly', priority: 0.3 },
  ]

  const articles = getAllArticles()
  const articlePages: MetadataRoute.Sitemap = articles.map(a => ({
    url: `${baseUrl}/article/${a.slug}`,
    lastModified: `${a.publishedAt}T00:00:00.000Z`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // 都道府県別ページ（47都道府県 × 3カテゴリ = 141ページ）
  const prefecturePages: MetadataRoute.Sitemap = PREFECTURES.flatMap(p => [
    { url: `${baseUrl}/nenkin/${p.slug}`, lastModified: today, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/souzoku/${p.slug}`, lastModified: today, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/kaigo/${p.slug}`, lastModified: today, changeFrequency: 'monthly' as const, priority: 0.7 },
  ])

  return [...staticPages, ...articlePages, ...prefecturePages]
}
