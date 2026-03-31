import Link from 'next/link'
import { getArticlesByCategory } from '@/lib/articles'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '介護のこと｜年金・相続・介護ガイド',
  description: '介護認定の申請・施設の選び方・介護費用など、介護に関する疑問をわかりやすく解説します。',
}

export default function KaigoPage() {
  const articles = getArticlesByCategory('kaigo')

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      <header style={{ background: '#1a3a6b' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" style={{ color: '#a8c4e8', fontSize: 14, textDecoration: 'none' }}>ホーム</Link>
          <span style={{ color: '#a8c4e8' }}>›</span>
          <span style={{ color: 'white', fontSize: 14 }}>介護</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div style={{ borderLeft: '4px solid #7a4200', paddingLeft: 14, marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a' }}>🤝 介護のこと</h1>
          <p style={{ color: '#555', fontSize: 16, marginTop: 6 }}>介護認定の申請・施設の選び方・費用</p>
        </div>

        {articles.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 16, padding: 32, textAlign: 'center', color: '#999' }}>
            <p style={{ fontSize: 18 }}>記事を準備中です。もうしばらくお待ちください。</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {articles.map(a => (
              <Link
                key={a.slug}
                href={`/article/${a.slug}`}
                style={{
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: 14,
                  padding: '18px 20px',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                <p style={{ fontWeight: 700, fontSize: 17, color: '#1a1a1a', marginBottom: 6 }}>{a.title}</p>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{a.description}</p>
                <p style={{ fontSize: 12, color: '#999', marginTop: 8 }}>{a.publishedAt}</p>
              </Link>
            ))}
          </div>
        )}
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
