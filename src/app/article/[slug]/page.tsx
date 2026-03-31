import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug, getAllArticles, CATEGORY_LABELS, CATEGORY_COLOR } from '@/lib/articles'
import AffiliateBanners from '@/components/AffiliateBanners'
import AdUnit from '@/components/AdUnit'
import type { Metadata } from 'next'



export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: `${article.title}｜年金・相続・介護ガイド`,
    description: article.description,
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const colors = CATEGORY_COLOR[article.category]
  const categoryLabel = CATEGORY_LABELS[article.category]
  const categoryHref = `/${article.category}`

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>

      {/* ヘッダー */}
      <header style={{ background: '#1a3a6b' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" style={{ color: '#a8c4e8', fontSize: 14, textDecoration: 'none' }}>ホーム</Link>
          <span style={{ color: '#a8c4e8' }}>›</span>
          <Link href={categoryHref} style={{ color: '#a8c4e8', fontSize: 14, textDecoration: 'none' }}>{categoryLabel}</Link>
          <span style={{ color: '#a8c4e8' }}>›</span>
          <span style={{ color: 'white', fontSize: 14 }} className="truncate">{article.title}</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* カテゴリバッジ */}
        <span style={{
          background: colors.bg,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          fontSize: 13,
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: 20,
          display: 'inline-block',
          marginBottom: 12,
        }}>
          {categoryLabel}
        </span>

        {/* タイトル */}
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.45, marginBottom: 12 }}>
          {article.title}
        </h1>

        <p style={{ color: '#555', fontSize: 16, marginBottom: 24, lineHeight: 1.7 }}>
          {article.description}
        </p>

        {/* 更新日 */}
        <p style={{ color: '#999', fontSize: 13, marginBottom: 32 }}>
          更新日：{article.publishedAt}
        </p>

        {/* 目次 */}
        {article.sections.length > 2 && (
          <div style={{ background: '#f0f4f8', border: '1px solid #d0daea', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }}>
            <p style={{ fontWeight: 700, color: '#1a3a6b', marginBottom: 10, fontSize: 15 }}>この記事の目次</p>
            <ol style={{ paddingLeft: 20, margin: 0 }}>
              {article.sections.map((s, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  <a href={`#section-${i}`} style={{ color: '#2a5298', fontSize: 15, textDecoration: 'none' }}>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* 本文 */}
        <div>
          {article.sections.map((s, i) => (
            <section key={i} id={`section-${i}`} style={{ marginBottom: 36 }}>
              <h2 style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#1a1a1a',
                borderLeft: `4px solid ${colors.border}`,
                paddingLeft: 14,
                marginBottom: 16,
                lineHeight: 1.45,
              }}>
                {s.heading}
              </h2>
              <div style={{ fontSize: 17, lineHeight: 1.9, color: '#222' }}>
                {s.body.split('\n').map((line, j) => (
                  <p key={j} style={{ marginBottom: line === '' ? 12 : 0 }}>
                    {line}
                  </p>
                ))}
              </div>
              {/* 記事の真ん中に広告を挿入 */}
              {i === Math.floor(article.sections.length / 2) - 1 && (
                <AdUnit slot="3456789012" format="auto" />
              )}
            </section>
          ))}
        </div>

        {/* アフィリエイトバナー */}
        <AffiliateBanners />

        {/* 注意書き */}
        <div style={{ background: '#fff8e1', border: '1px solid #f5c518', borderRadius: 12, padding: '16px 20px', marginTop: 32 }}>
          <p style={{ fontSize: 14, color: '#7a5c00', lineHeight: 1.7, margin: 0 }}>
            ⚠️ 本記事は一般的な情報提供を目的としています。個別の状況については、年金事務所・市区町村の窓口・専門家にご相談ください。
          </p>
        </div>

        {/* 関連記事 */}
        {article.relatedSlugs && article.relatedSlugs.length > 0 && (() => {
          const related = article.relatedSlugs!.map(s => getArticleBySlug(s)).filter(Boolean)
          if (related.length === 0) return null
          return (
            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>関連記事</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {related.map(r => (
                  <Link
                    key={r!.slug}
                    href={`/article/${r!.slug}`}
                    style={{
                      background: 'white',
                      border: '1px solid #ddd',
                      borderRadius: 12,
                      padding: '14px 18px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: 16, color: '#1a1a1a', fontWeight: 600 }}>{r!.title}</span>
                    <span style={{ color: '#aaa', fontSize: 20, flexShrink: 0, marginLeft: 12 }}>›</span>
                  </Link>
                ))}
              </div>
            </div>
          )
        })()}

        {/* カテゴリへ戻る */}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Link
            href={categoryHref}
            style={{
              display: 'inline-block',
              background: colors.border,
              color: 'white',
              fontWeight: 700,
              fontSize: 16,
              padding: '14px 32px',
              borderRadius: 12,
              textDecoration: 'none',
            }}
          >
            ← {categoryLabel}の記事一覧へ
          </Link>
        </div>

      </div>

      {/* フッター */}
      <footer className="mt-12 py-8 px-4" style={{ background: '#222' }}>
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/about" style={{ color: '#aaa', fontSize: 14, marginRight: 24, textDecoration: 'none' }}>運営者情報</Link>
          <Link href="/privacy" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none' }}>プライバシーポリシー</Link>
          <p style={{ color: '#777', fontSize: 12, marginTop: 12 }}>© 2026 年金・相続・介護の手続きガイド</p>
        </div>
      </footer>

    </div>
  )
}
