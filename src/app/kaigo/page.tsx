import Link from 'next/link'
import { getArticlesByCategory } from '@/lib/articles'
import { PREFECTURES } from '@/data/prefectures'
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
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" style={{ color: '#f5c48a', fontSize: 14, textDecoration: 'none' }}>ホーム</Link>
          <span style={{ color: '#f5c48a' }}>›</span>
          <span style={{ color: 'white', fontSize: 14 }}>介護</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div style={{ borderLeft: '4px solid #7a4200', paddingLeft: 14, marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a' }}>🤝 介護のこと</h1>
          <p style={{ color: '#555', fontSize: 16, marginTop: 6 }}>介護認定の申請・施設の選び方・費用</p>
        </div>

        {articles.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
            {articles.map(a => (
              <Link key={a.slug} href={`/article/${a.slug}`} style={{ background: 'white', border: '1px solid #ddd', borderRadius: 14, padding: '18px 20px', textDecoration: 'none', display: 'block' }}>
                <p style={{ fontWeight: 700, fontSize: 17, color: '#1a1a1a', marginBottom: 6 }}>{a.title}</p>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{a.description}</p>
                <p style={{ fontSize: 12, color: '#999', marginTop: 8 }}>{a.publishedAt}</p>
              </Link>
            ))}
          </div>
        )}

        {/* 都道府県別介護情報 */}
        <div style={{ marginTop: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', borderLeft: '4px solid #7a4200', paddingLeft: 14, marginBottom: 16 }}>
            都道府県別の介護情報
          </h2>
          <p style={{ color: '#555', fontSize: 15, marginBottom: 16 }}>お住まいの都道府県を選ぶと、地域の窓口・費用・施設情報が確認できます。</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PREFECTURES.map(p => (
              <Link key={p.slug} href={`/kaigo/${p.slug}`} style={{ background: 'white', border: '1px solid #e8c090', borderRadius: 8, padding: '8px 14px', fontSize: 14, color: '#7a4200', textDecoration: 'none', fontWeight: 600 }}>
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-12 py-8 px-4" style={{ background: '#222' }}>
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none' }}>← トップへ戻る</Link>
          <p style={{ color: '#777', fontSize: 12, marginTop: 12 }}>© 2026 年金・相続・介護の手続きガイド</p>
        </div>
      </footer>
    </div>
  )
}
