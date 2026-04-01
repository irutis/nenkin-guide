import Link from 'next/link'
import { getArticlesByCategory } from '@/lib/articles'
import { PREFECTURES } from '@/data/prefectures'
import AdUnit from '@/components/AdUnit'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '年金のこと｜受取額・申請方法・手続きを解説',
  description: '年金はいくらもらえる？いつから？申請方法は？都道府県別の年金事務所情報・必要書類をわかりやすく解説します。',
}

export default function NenkinPage() {
  const articles = getArticlesByCategory('nenkin')

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      <header style={{ background: '#1a3a6b' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" style={{ color: '#a8c4e8', fontSize: 14, textDecoration: 'none' }}>ホーム</Link>
          <span style={{ color: '#a8c4e8' }}>›</span>
          <span style={{ color: 'white', fontSize: 14 }}>年金</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div style={{ borderLeft: '4px solid #1a3a6b', paddingLeft: 14, marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a' }}>💴 年金のこと</h1>
          <p style={{ color: '#555', fontSize: 16, marginTop: 6 }}>いくらもらえる？いつから？申請の方法</p>
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

        <AdUnit slot="1234567890" format="horizontal" />

        {/* 都道府県別年金情報 */}
        <div style={{ marginTop: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', borderLeft: '4px solid #1a3a6b', paddingLeft: 14, marginBottom: 16 }}>
            都道府県別の年金窓口・手続き情報
          </h2>
          <p style={{ color: '#555', fontSize: 15, marginBottom: 16 }}>お住まいの都道府県を選ぶと、年金事務所の情報・申請手順・必要書類が確認できます。</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PREFECTURES.map(p => (
              <Link key={p.slug} href={`/nenkin/${p.slug}`} style={{ background: 'white', border: '1px solid #b0c8e8', borderRadius: 8, padding: '8px 14px', fontSize: 14, color: '#1a3a6b', textDecoration: 'none', fontWeight: 600 }}>
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-12 py-8 px-4" style={{ background: '#222' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none' }}>← トップへ戻る</Link>
            <Link href="/about" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none' }}>運営者情報</Link>
            <Link href="/privacy" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none' }}>プライバシーポリシー</Link>
            <Link href="/contact" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none' }}>お問い合わせ</Link>
          </div>
          <p style={{ color: '#777', fontSize: 12 }}>© 2026 年金・相続・介護の手続きガイド</p>
        </div>
      </footer>
    </div>
  )
}
