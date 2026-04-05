import Link from 'next/link'
import { getArticlesByCategory } from '@/lib/articles'
import { PREFECTURES } from '@/data/prefectures'
import AdUnit from '@/components/AdUnit'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '年金のこと｜受取額・申請方法・都道府県別窓口を解説',
  description: '年金はいくらもらえる？いつから？申請方法は？都道府県別の年金事務所情報・必要書類をわかりやすく解説します。ねんきんダイヤル：0570-05-1165',
}

export default function NenkinPage() {
  const articles = getArticlesByCategory('nenkin')

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      <header style={{ background: '#1a3a6b' }}>
        <div className="max-w-3xl mx-auto px-4 py-4">
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>💴 年金のこと</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* ねんきんダイヤル */}
        <div style={{ background: '#1a3a6b', borderRadius: 14, padding: '20px 22px', marginBottom: 28, textAlign: 'center' }}>
          <p style={{ color: '#a8c4e8', fontSize: 15, marginBottom: 6 }}>📞 電話で相談できます（無料案内）</p>
          <p style={{ color: 'white', fontSize: 28, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>
            0570-05-1165
          </p>
          <p style={{ color: '#c8d9f0', fontSize: 15 }}>ねんきんダイヤル ／ 月〜金 8:30〜19:00</p>
        </div>

        <div style={{ borderLeft: '5px solid #1a3a6b', paddingLeft: 14, marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a' }}>年金に関する記事一覧</h1>
          <p style={{ color: '#555', fontSize: 17, marginTop: 6, lineHeight: 1.7 }}>
            「いくらもらえる？」「いつから？」「申請方法は？」をわかりやすく解説します。
          </p>
        </div>

        {articles.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  minHeight: 72,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 17, color: '#1a1a1a', marginBottom: 4, lineHeight: 1.5 }}>{a.title}</p>
                  <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{a.description}</p>
                  <p style={{ fontSize: 13, color: '#999', marginTop: 6 }}>{a.publishedAt}</p>
                </div>
                <span style={{ color: '#1a3a6b', fontSize: 24, flexShrink: 0, fontWeight: 700 }}>›</span>
              </Link>
            ))}
          </div>
        )}

        <AdUnit slot="1234567890" format="horizontal" />

        {/* 都道府県別年金情報 */}
        <div style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', borderLeft: '5px solid #1a3a6b', paddingLeft: 14, marginBottom: 10 }}>
            📍 都道府県別の年金事務所・窓口情報
          </h2>
          <p style={{ color: '#555', fontSize: 16, marginBottom: 20, lineHeight: 1.7 }}>
            お住まいの都道府県を選ぶと、年金事務所の電話番号・申請手順・必要書類が確認できます。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {PREFECTURES.map(p => (
              <Link
                key={p.slug}
                href={`/nenkin/${p.slug}`}
                style={{
                  background: 'white',
                  border: '1px solid #a8c4e8',
                  borderRadius: 10,
                  padding: '10px 16px',
                  fontSize: 16,
                  color: '#1a3a6b',
                  textDecoration: 'none',
                  fontWeight: 600,
                  minHeight: 48,
                  display: 'inline-flex',
                  alignItems: 'center',
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
