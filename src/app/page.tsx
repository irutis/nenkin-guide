import Link from 'next/link'
import AdUnit from '@/components/AdUnit'
import { getAllArticles, CATEGORY_LABELS } from '@/lib/articles'

const TOPICS = [
  {
    href: '/nenkin',
    emoji: '💴',
    title: '年金のこと',
    desc: '「いくらもらえる？」「いつから？」「申請の方法は？」',
    borderColor: '#1a3a6b',
    bgColor: '#eff4fb',
    titleColor: '#1a3a6b',
    arrowColor: '#1a3a6b',
  },
  {
    href: '/souzoku',
    emoji: '🏠',
    title: '相続・遺言のこと',
    desc: '「遺産の分け方は？」「遺言書の書き方は？」「相続税は？」',
    borderColor: '#1a5c2e',
    bgColor: '#f0f7f2',
    titleColor: '#1a5c2e',
    arrowColor: '#1a5c2e',
  },
  {
    href: '/kaigo',
    emoji: '🤝',
    title: '介護のこと',
    desc: '「介護認定の申請は？」「施設はどう選ぶ？」「費用は？」',
    borderColor: '#7a4200',
    bgColor: '#fdf5eb',
    titleColor: '#7a4200',
    arrowColor: '#7a4200',
  },
]

const POPULAR = [
  { href: '/simulator', text: '📊 年金受取額シミュレーター（無料）', badge: 'おすすめ' },
  { href: '/article/nenkin-tsuki-ikura', text: '年金は月いくらもらえる？' },
  { href: '/article/nenkin-shinsei-houhou', text: '年金の受け取り申請方法' },
  { href: '/article/kokumin-kosei-chigai', text: '国民年金と厚生年金の違い' },
  { href: '/article/souzoku-nagare', text: '相続手続きの流れ（全体像）' },
  { href: '/article/yuigonsho-kakikata', text: '遺言書の書き方' },
  { href: '/article/sozokuzei-keisan', text: '相続税はいくら？計算方法' },
]

export default function HomePage() {
  const recentArticles = getAllArticles()
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 6)

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>

      {/* ヘッダー */}
      <header style={{ background: '#1a3a6b' }}>
        <div className="max-w-3xl mx-auto px-4 py-4">
          {/* サイト名 */}
          <div className="mb-3">
            <p className="text-white font-bold" style={{ fontSize: 22, lineHeight: 1.3 }}>年金・相続・介護</p>
            <p style={{ color: '#a8c4e8', fontSize: 15 }}>手続きガイド｜わかりやすく解説</p>
          </div>
          {/* ナビゲーション */}
          <nav className="flex gap-2">
            {[
              { href: '/nenkin', label: '💴 年金' },
              { href: '/souzoku', label: '🏠 相続' },
              { href: '/kaigo', label: '🤝 介護' },
            ].map(n => (
              <Link
                key={n.href}
                href={n.href}
                style={{
                  background: '#2a5298',
                  color: 'white',
                  fontSize: 17,
                  fontWeight: 700,
                  padding: '10px 16px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  minHeight: 48,
                  display: 'flex',
                  alignItems: 'center',
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* ヒーロー */}
      <section style={{ background: '#1a3a6b' }} className="pb-8">
        <div className="max-w-3xl mx-auto px-4 pt-6 text-center">
          <h1 className="text-white font-bold" style={{ fontSize: 28, lineHeight: 1.4, marginBottom: 10 }}>
            60代・70代のための<br />手続きガイド
          </h1>
          <p style={{ color: '#c8d9f0', fontSize: 18, lineHeight: 1.8 }}>
            厚生労働省・法務省の公式情報をもとに<br />
            <strong style={{ color: 'white' }}>手続きの流れと必要書類</strong>を解説します
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4">

        {/* テーマ選択 */}
        <section style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>
            何を知りたいですか？
          </h2>
          <p style={{ fontSize: 16, color: '#666', marginBottom: 16 }}>
            知りたいテーマをタップしてください
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {TOPICS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                style={{
                  borderColor: t.borderColor,
                  background: t.bgColor,
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderRadius: 16,
                  padding: '20px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  textDecoration: 'none',
                  minHeight: 100,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                }}
              >
                <span style={{ fontSize: 44, lineHeight: 1, flexShrink: 0 }}>{t.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 22, color: t.titleColor, lineHeight: 1.3, marginBottom: 6 }}>
                    {t.title}
                  </p>
                  <p style={{ color: '#444', fontSize: 15, lineHeight: 1.6 }}>{t.desc}</p>
                </div>
                <span style={{ color: t.arrowColor, fontSize: 28, flexShrink: 0, fontWeight: 700 }}>›</span>
              </Link>
            ))}
          </div>
        </section>

        {/* よく調べられていること */}
        <section style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>
            よく調べられていること
          </h2>
          <p style={{ fontSize: 16, color: '#666', marginBottom: 16 }}>
            多くの方が気にされている内容です
          </p>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #ddd', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
            {POPULAR.map((p, i) => (
              <Link
                key={p.href}
                href={p.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderTop: i > 0 ? '1px solid #eee' : 'none',
                  textDecoration: 'none',
                  color: '#1a1a1a',
                  minHeight: 64,
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  <span style={{ color: '#999', fontSize: 16, fontWeight: 700, minWidth: 24 }}>{i + 1}</span>
                  <span style={{ fontSize: 17, lineHeight: 1.5 }}>{p.text}</span>
                  {p.badge && (
                    <span style={{
                      background: '#e8f0fe',
                      color: '#1a3a6b',
                      fontSize: 13,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 20,
                      flexShrink: 0,
                    }}>{p.badge}</span>
                  )}
                </div>
                <span style={{ color: '#1a3a6b', fontSize: 22, flexShrink: 0, fontWeight: 700 }}>›</span>
              </Link>
            ))}
          </div>
        </section>

        <AdUnit slot="5678901234" format="auto" />

        {/* 新着記事 */}
        <section style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
            新着記事
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentArticles.map(a => (
              <Link
                key={a.slug}
                href={`/article/${a.slug}`}
                style={{
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: 14,
                  padding: '16px 20px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  minHeight: 72,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 17, color: '#1a1a1a', fontWeight: 600, lineHeight: 1.5, marginBottom: 4 }}>{a.title}</p>
                  <p style={{ fontSize: 14, color: '#888' }}>
                    {a.publishedAt} ·&nbsp;
                    <span style={{
                      background: '#f0f4f8',
                      color: '#1a3a6b',
                      padding: '1px 8px',
                      borderRadius: 10,
                      fontSize: 13,
                    }}>
                      {CATEGORY_LABELS[a.category]}
                    </span>
                  </p>
                </div>
                <span style={{ color: '#1a3a6b', fontSize: 22, flexShrink: 0, fontWeight: 700 }}>›</span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Link
              href="/nenkin"
              style={{
                color: '#2a5298',
                fontSize: 17,
                fontWeight: 700,
                textDecoration: 'none',
                padding: '12px 24px',
                border: '2px solid #2a5298',
                borderRadius: 10,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              すべての記事を見る →
            </Link>
          </div>
        </section>


      </div>

      {/* フッター */}
      <footer style={{ marginTop: 48, padding: '32px 16px', background: '#222', borderTop: '2px solid #444' }}>
        <div className="max-w-3xl mx-auto">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20, justifyContent: 'center' }}>
            {[
              { href: '/about', label: '運営者情報' },
              { href: '/privacy', label: 'プライバシーポリシー' },
              { href: '/contact', label: 'お問い合わせ' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ color: '#ccc', fontSize: 16, textDecoration: 'none' }}>
                {l.label}
              </Link>
            ))}
          </div>
          <p style={{ color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 1.8 }}>
            © 2026 年金・相続・介護の手続きガイド<br />
            本サイトの情報は参考情報です。詳細は各機関にご確認ください。
          </p>
        </div>
      </footer>

    </div>
  )
}
