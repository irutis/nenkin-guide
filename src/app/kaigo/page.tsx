import Link from 'next/link'
import { getArticlesByCategory } from '@/lib/articles'
import { PREFECTURES } from '@/data/prefectures'
import AdUnit from '@/components/AdUnit'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '介護のこと｜介護認定・施設選び・費用を解説',
  description: '介護認定の申請・老人ホームの選び方・介護費用など、介護に関する疑問をわかりやすく解説。都道府県別の窓口情報も掲載。',
}

export default function KaigoPage() {
  const articles = getArticlesByCategory('kaigo')

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      <header style={{ background: '#7a4200' }}>
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
            <span style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>🤝 介護のこと</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* 相談ボックス */}
        <div style={{ background: '#7a4200', borderRadius: 14, padding: '20px 22px', marginBottom: 28, textAlign: 'center' }}>
          <p style={{ color: '#f5c48a', fontSize: 15, marginBottom: 6 }}>📞 介護の相談窓口（無料）</p>
          <p style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>地域包括支援センター</p>
          <p style={{ color: '#fde0b8', fontSize: 15 }}>お住まいの市区町村窓口でも相談できます</p>
        </div>

        <div style={{ borderLeft: '5px solid #7a4200', paddingLeft: 14, marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a' }}>介護に関する記事一覧</h1>
          <p style={{ color: '#555', fontSize: 17, marginTop: 6, lineHeight: 1.7 }}>
            「認定の申請は？」「施設はどう選ぶ？」「費用はいくら？」を解説します。
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
                <span style={{ color: '#7a4200', fontSize: 24, flexShrink: 0, fontWeight: 700 }}>›</span>
              </Link>
            ))}
          </div>
        )}

        <AdUnit slot="3456789013" format="horizontal" />

        <div style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', borderLeft: '5px solid #7a4200', paddingLeft: 14, marginBottom: 10 }}>
            📍 都道府県別の介護情報
          </h2>
          <p style={{ color: '#555', fontSize: 16, marginBottom: 20, lineHeight: 1.7 }}>
            お住まいの都道府県を選ぶと、地域の窓口・費用・施設情報が確認できます。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {PREFECTURES.map(p => (
              <Link
                key={p.slug}
                href={`/kaigo/${p.slug}`}
                style={{
                  background: 'white', border: '1px solid #e8c090', borderRadius: 10,
                  padding: '10px 16px', fontSize: 16, color: '#7a4200', textDecoration: 'none',
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
