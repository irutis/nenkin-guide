import { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nenkin-guide.jp'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: '2026-03-28T00:00:00.000Z', changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/nenkin`, lastModified: '2026-03-28T00:00:00.000Z', changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/souzoku`, lastModified: '2026-03-28T00:00:00.000Z', changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/kaigo`, lastModified: '2026-03-28T00:00:00.000Z', changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: '2026-03-28T00:00:00.000Z', changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: '2026-03-28T00:00:00.000Z', changeFrequency: 'monthly', priority: 0.3 },
  ]

  const articles = getAllArticles()
  const articlePages: MetadataRoute.Sitemap = articles.map(a => ({
    url: `${baseUrl}/article/${a.slug}`,
    lastModified: `${a.publishedAt}T00:00:00.000Z`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...articlePages]
}
