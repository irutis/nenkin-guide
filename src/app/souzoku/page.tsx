import Link from 'next/link'
import { getArticlesByCategory } from '@/lib/articles'
import { PREFECTURES } from '@/data/prefectures'
import AdUnit from '@/components/AdUnit'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '相続・遺言のこと｜手続き・必要書類・費用を解説',
  description: '相続手続きの流れ・遺言書の書き方・相続税の計算方法を解説。都道府県別の手続き窓口情報も掲載。',
}

export default function SouzokuPage() {
  const articles = getArticlesByCategory('souzoku')

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      <header style={{ background: '#1a5c2e' }}>
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link
            href="/"
            style={{
              color: 'white', fontSize: 16, fontWeight: 700, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: 8, marginBottom: 10,
            }}
          >
            ← トップページに戻る
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>🏠 相続・遺言のこと</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* 相談ボックス */}
        <div style={{ background: '#1a5c2e', borderRadius: 14, padding: '20px 22px', marginBottom: 28, textAlign: 'center' }}>
          <p style={{ color: '#a8d8b9', fontSize: 15, marginBottom: 6 }}>📞 相続の相談窓口</p>
          <p style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>法務局・税務署・公証役場</p>
          <p style={{ color: '#c8e8d0', fontSize: 15 }}>お住まいの都道府県を選ぶと窓口情報が確認できます</p>
        </div>

        <div style={{ borderLeft: '5px solid #1a5c2e', paddingLeft: 14, marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a' }}>相続・遺言に関する記事一覧</h1>
          <p style={{ color: '#555', fontSize: 17, marginTop: 6, lineHeight: 1.7 }}>
            「手続きの流れは？」「遺言書はどう書く？」「相続税はかかる？」を解説します。
          </p>
        </div>

        {articles.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
            {articles.map(a => (
              <Link
                key={a.slug}
                href={`/article/${a.slug}`}
                style={{
                  background: 'white', border: '1px solid #ddd', borderRadius: 14,
                  padding: '18px 20px', textDecoration: 'none', display: 'flex',
                  alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 72,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 17, color: '#1a1a1a', marginBottom: 4, lineHeight: 1.5 }}>{a.title}</p>
                  <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{a.description}</p>
                  <p style={{ fontSize: 13, color: '#999', marginTop: 6 }}>{a.publishedAt}</p>
                </div>
                <span style={{ color: '#1a5c2e', fontSize: 24, flexShrink: 0, fontWeight: 700 }}>›</span>
              </Link>
            ))}
          </div>
        )}

        <AdUnit slot="2345678901" format="horizontal" />

        <div style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', borderLeft: '5px solid #1a5c2e', paddingLeft: 14, marginBottom: 10 }}>
            📍 都道府県別の相続手続き情報
          </h2>
          <p style={{ color: '#555', fontSize: 16, marginBottom: 20, lineHeight: 1.7 }}>
            お住まいの都道府県を選ぶと、相続手続きの窓口・必要書類・費用の目安が確認できます。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {PREFECTURES.map(p => (
              <Link
                key={p.slug}
                href={`/souzoku/${p.slug}`}
                style={{
                  background: 'white', border: '1px solid #a8d8b9', borderRadius: 10,
                  padding: '10px 16px', fontSize: 16, color: '#1a5c2e', textDecoration: 'none',
                  fontWeight: 600, minHeight: 48, display: 'inline-flex', alignItems: 'center',
                }}
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ marginTop: 48, padding: '28px 16px', background: '#222' }}>
        <div className="max-w-3xl mx-auto">
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#ccc', fontSize: 16, textDecoration: 'none' }}>← トップへ戻る</Link>
            <Link href="/about" style={{ color: '#ccc', fontSize: 16, textDecoration: 'none' }}>運営者情報</Link>
            <Link href="/privacy" style={{ color: '#ccc', fontSize: 16, textDecoration: 'none' }}>プライバシーポリシー</Link>
            <Link href="/contact" style={{ color: '#ccc', fontSize: 16, textDecoration: 'none' }}>お問い合わせ</Link>
          </div>
          <p style={{ color: '#888', fontSize: 14, textAlign: 'center' }}>© 2026 年金・相続・介護の手続きガイド</p>
        </div>
      </footer>
    </div>
  )
}
