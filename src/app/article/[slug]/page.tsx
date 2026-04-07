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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { '@type': 'Organization', name: 'SOURO', url: 'https://nenkin-guide.jp' },
    publisher: { '@type': 'Organization', name: '年金・相続・介護の手続きガイド', url: 'https://nenkin-guide.jp' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://nenkin-guide.jp/article/${article.slug}` },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://nenkin-guide.jp' },
      { '@type': 'ListItem', position: 2, name: categoryLabel, item: `https://nenkin-guide.jp${categoryHref}` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `https://nenkin-guide.jp/article/${article.slug}` },
    ],
  }

  const faqLd = article.faqs && article.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      {/* ヘッダー */}
      <header style={{ background: '#1a3a6b' }}>
        <div className="max-w-3xl mx-auto px-4 py-4">
          {/* ホームに戻るボタン */}
          <Link
            href="/"
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,0.15)',
              padding: '8px 16px',
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            ← トップページに戻る
          </Link>
          {/* パンくず */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Link href={categoryHref} style={{ color: '#a8c4e8', fontSize: 16, textDecoration: 'none' }}>{categoryLabel}</Link>
            <span style={{ color: '#a8c4e8', fontSize: 16 }}>›</span>
            <span style={{ color: 'white', fontSize: 15, lineHeight: 1.4 }}>{article.title}</span>
          </div>
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
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.45, marginBottom: 14 }}>
          {article.title}
        </h1>

        <p style={{ color: '#444', fontSize: 18, marginBottom: 20, lineHeight: 1.8, background: '#f8f8f8', borderLeft: `4px solid ${colors.border}`, padding: '12px 16px', borderRadius: '0 8px 8px 0' }}>
          {article.description}
        </p>

        {/* 更新日 */}
        <p style={{ color: '#888', fontSize: 15, marginBottom: 28 }}>
          更新日：{article.publishedAt}
        </p>

        {/* 目次 */}
        {article.sections.length > 2 && (
          <div style={{ background: '#f0f4f8', border: '1px solid #d0daea', borderRadius: 14, padding: '20px 24px', marginBottom: 36 }}>
            <p style={{ fontWeight: 700, color: '#1a3a6b', marginBottom: 14, fontSize: 18 }}>📋 この記事の目次</p>
            <ol style={{ paddingLeft: 22, margin: 0 }}>
              {article.sections.map((s, i) => (
                <li key={i} style={{ marginBottom: 10 }}>
                  <a href={`#section-${i}`} style={{ color: '#2a5298', fontSize: 17, textDecoration: 'none', lineHeight: 1.5 }}>
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
            <section key={i} id={`section-${i}`} style={{ marginBottom: 52 }}>
              <h2 style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#1a1a1a',
                borderLeft: `5px solid ${colors.border}`,
                paddingLeft: 16,
                marginBottom: 20,
                lineHeight: 1.5,
              }}>
                {s.heading}
              </h2>
              <div style={{ fontSize: 17, lineHeight: 2.0, color: '#222' }}>
                {s.body.split('\n').map((line, j) => {
                  if (line === '') return <div key={j} style={{ height: 12 }} />
                  // 【...】で始まる行：小見出し
                  if (/^【.+】$/.test(line.trim())) {
                    return (
                      <p key={j} style={{ fontWeight: 700, color: '#1a3a6b', fontSize: 16, marginTop: 20, marginBottom: 6, background: '#f0f4f8', padding: '6px 12px', borderRadius: 6, display: 'inline-block' }}>
                        {line}
                      </p>
                    )
                  }
                  // 【...】を含む行（行の途中に含む場合）：太字部分を強調
                  if (line.includes('【') && line.includes('】')) {
                    return (
                      <p key={j} style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 16, marginTop: 18, marginBottom: 4 }}>
                        {line}
                      </p>
                    )
                  }
                  // ・で始まる行：箇条書き
                  if (line.startsWith('・')) {
                    return (
                      <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 6, paddingLeft: 8 }}>
                        <span style={{ color: colors.border, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>●</span>
                        <p style={{ margin: 0, lineHeight: 1.8 }}>{line.replace(/^・/, '')}</p>
                      </div>
                    )
                  }
                  // ①②③などで始まる行：番号付きリスト
                  if (/^[①②③④⑤⑥⑦⑧⑨]/.test(line)) {
                    return (
                      <div key={j} style={{ display: 'flex', gap: 10, marginBottom: 10, paddingLeft: 8, alignItems: 'flex-start' }}>
                        <span style={{ background: colors.border, color: 'white', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
                          {line.slice(0, 1)}
                        </span>
                        <p style={{ margin: 0, lineHeight: 1.8 }}>{line.slice(1).replace(/^[．.]\s*/, '')}</p>
                      </div>
                    )
                  }
                  // 通常の段落
                  return (
                    <p key={j} style={{ marginBottom: 12 }}>
                      {line}
                    </p>
                  )
                })}
              </div>
              {i === Math.floor(article.sections.length / 2) - 1 && (
                <AdUnit slot="3456789012" format="auto" />
              )}
            </section>
          ))}
        </div>

        {/* よくある質問 */}
        {article.faqs && article.faqs.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', borderLeft: `5px solid ${colors.border}`, paddingLeft: 16, marginBottom: 20 }}>
              よくある質問
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {article.faqs.map((faq, i) => (
                <details key={i} style={{ background: 'white', border: `2px solid ${colors.border}20`, borderRadius: 14, padding: '18px 22px' }}>
                  <summary style={{ fontWeight: 700, fontSize: 18, color: '#1a1a1a', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, minHeight: 36 }}>
                    <span style={{ lineHeight: 1.5 }}>Q. {faq.q}</span>
                    <span style={{ color: colors.border, fontSize: 24, flexShrink: 0, fontWeight: 700 }}>＋</span>
                  </summary>
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #eee' }}>
                    <p style={{ color: '#333', fontSize: 17, lineHeight: 1.9 }}>A. {faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* アフィリエイトバナー */}
        <AffiliateBanners />

        {/* 年金カテゴリ：都道府県別ページへの誘導 */}
        {article.category === 'nenkin' && (
          <div style={{ background: '#eff4fb', border: '2px solid #1a3a6b', borderRadius: 14, padding: '20px 22px', marginTop: 36 }}>
            <p style={{ fontWeight: 700, color: '#1a3a6b', fontSize: 18, marginBottom: 12 }}>
              📍 お近くの年金事務所を探す
            </p>
            <p style={{ color: '#333', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
              年金の相談・手続きはお住まいの都道府県の年金事務所へ。場所・電話番号・持ち物を都道府県別に案内しています。
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                ['tokyo', '東京'],['kanagawa', '神奈川'],['osaka', '大阪'],['aichi', '愛知'],
                ['saitama', '埼玉'],['chiba', '千葉'],['hyogo', '兵庫'],['hokkaido', '北海道'],
              ].map(([pref, label]) => (
                <Link
                  key={pref}
                  href={`/nenkin/${pref}`}
                  style={{
                    background: 'white',
                    border: '1px solid #a8c4e8',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 16,
                    color: '#1a3a6b',
                    textDecoration: 'none',
                    fontWeight: 600,
                    minHeight: 44,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/nenkin"
                style={{
                  background: '#1a3a6b',
                  border: '1px solid #1a3a6b',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: 16,
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 600,
                  minHeight: 44,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                すべての都道府県を見る →
              </Link>
            </div>
          </div>
        )}

        {/* 注意書き */}
        <div style={{ background: '#fff8e1', border: '1px solid #f5c518', borderRadius: 14, padding: '18px 22px', marginTop: 36 }}>
          <p style={{ fontSize: 16, color: '#7a5c00', lineHeight: 1.8, margin: 0 }}>
            ⚠️ 本記事は一般的な情報提供を目的としています。個別の状況については、年金事務所・市区町村の窓口・専門家にご相談ください。
          </p>
        </div>

        {/* 関連記事 */}
        {article.relatedSlugs && article.relatedSlugs.length > 0 && (() => {
          const related = article.relatedSlugs!.map(s => getArticleBySlug(s)).filter(Boolean)
          if (related.length === 0) return null
          return (
            <div style={{ marginTop: 48 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 18 }}>関連記事</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {related.map(r => (
                  <Link
                    key={r!.slug}
                    href={`/article/${r!.slug}`}
                    style={{
                      background: 'white',
                      border: '1px solid #ddd',
                      borderRadius: 14,
                      padding: '18px 22px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      minHeight: 68,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    }}
                  >
                    <span style={{ fontSize: 17, color: '#1a1a1a', fontWeight: 600, lineHeight: 1.5 }}>{r!.title}</span>
                    <span style={{ color: colors.border, fontSize: 24, flexShrink: 0, marginLeft: 12, fontWeight: 700 }}>›</span>
                  </Link>
                ))}
              </div>
            </div>
          )
        })()}

        {/* ナビゲーションボタン */}
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Link
            href={categoryHref}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: colors.border,
              color: 'white',
              fontWeight: 700,
              fontSize: 18,
              padding: '18px 32px',
              borderRadius: 14,
              textDecoration: 'none',
              minHeight: 60,
              textAlign: 'center',
            }}
          >
            ← {categoryLabel}の記事一覧へ
          </Link>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              border: '2px solid #1a3a6b',
              color: '#1a3a6b',
              fontWeight: 700,
              fontSize: 18,
              padding: '18px 32px',
              borderRadius: 14,
              textDecoration: 'none',
              minHeight: 60,
              textAlign: 'center',
            }}
          >
            🏠 トップページに戻る
          </Link>
        </div>

      </div>

      {/* フッター */}
      <footer style={{ marginTop: 48, padding: '28px 16px', background: '#222' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
            <Link href="/about" style={{ color: '#ccc', fontSize: 16, textDecoration: 'none' }}>運営者情報</Link>
            <Link href="/privacy" style={{ color: '#ccc', fontSize: 16, textDecoration: 'none' }}>プライバシーポリシー</Link>
            <Link href="/contact" style={{ color: '#ccc', fontSize: 16, textDecoration: 'none' }}>お問い合わせ</Link>
          </div>
          <p style={{ color: '#888', fontSize: 14 }}>© 2026 年金・相続・介護の手続きガイド</p>
        </div>
      </footer>

    </div>
  )
}
