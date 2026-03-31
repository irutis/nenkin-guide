import Link from 'next/link'

const TOPICS = [
  {
    href: '/nenkin',
    emoji: '💴',
    title: '年金のこと',
    desc: 'いくらもらえる？いつから？申請の方法',
    borderColor: '#1a3a6b',
    bgColor: '#eff4fb',
    titleColor: '#1a3a6b',
  },
  {
    href: '/souzoku',
    emoji: '🏠',
    title: '相続・遺言のこと',
    desc: '亡くなった後の手続き・遺言書の書き方',
    borderColor: '#1a5c2e',
    bgColor: '#f0f7f2',
    titleColor: '#1a5c2e',
  },
  {
    href: '/kaigo',
    emoji: '🤝',
    title: '介護のこと',
    desc: '介護認定の申請・施設の選び方・費用',
    borderColor: '#7a4200',
    bgColor: '#fdf5eb',
    titleColor: '#7a4200',
  },
]

const POPULAR = [
  { href: '/nenkin/ikura', text: '年金は月いくらもらえる？' },
  { href: '/nenkin/shinsei', text: '年金の受け取り申請方法' },
  { href: '/nenkin/kurisage', text: '繰り下げ受給はお得？' },
  { href: '/souzoku/nagare', text: '相続手続きの流れ（全体像）' },
  { href: '/kaigo/nintei', text: '要介護認定の申請方法' },
  { href: '/kaigo/hiyo', text: '介護にかかる費用の目安' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>

      {/* ヘッダー */}
      <header style={{ background: '#1a3a6b' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-lg leading-tight">年金・相続・介護</p>
            <p style={{ color: '#a8c4e8' }} className="text-sm">手続きガイド</p>
          </div>
          <nav className="flex gap-2">
            {[
              { href: '/nenkin', label: '年金' },
              { href: '/souzoku', label: '相続' },
              { href: '/kaigo', label: '介護' },
            ].map(n => (
              <Link
                key={n.href}
                href={n.href}
                className="text-white text-sm px-3 rounded-lg hover:opacity-80 transition-opacity"
                style={{ background: '#2a5298', minHeight: 36, display: 'flex', alignItems: 'center' }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* ヒーロー */}
      <section style={{ background: '#1a3a6b' }} className="pb-10">
        <div className="max-w-3xl mx-auto px-4 pt-8 text-center">
          <h1 className="text-white font-bold text-2xl sm:text-3xl leading-snug mb-3">
            60代・70代のための<br />手続きガイド
          </h1>
          <p style={{ color: '#a8c4e8' }} className="text-base">
            年金・相続・介護の手続きを<br className="sm:hidden" />やさしい言葉でわかりやすく解説します
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4">

        {/* テーマ選択 */}
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
            何を知りたいですか？
          </h2>
          <div className="grid grid-cols-1 gap-4">
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
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  textDecoration: 'none',
                  minHeight: 88,
                }}
              >
                <span style={{ fontSize: 40, lineHeight: 1 }}>{t.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 20, color: t.titleColor, lineHeight: 1.3 }}>{t.title}</p>
                  <p style={{ color: '#555', fontSize: 15, marginTop: 4 }}>{t.desc}</p>
                </div>
                <span style={{ color: '#aaa', fontSize: 24, flexShrink: 0 }}>›</span>
              </Link>
            ))}
          </div>
        </section>

        {/* よく調べられていること */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
            よく調べられていること
          </h2>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #ddd', overflow: 'hidden' }}>
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
                  minHeight: 56,
                }}
              >
                <span style={{ fontSize: 16 }}>{p.text}</span>
                <span style={{ color: '#aaa', fontSize: 20, flexShrink: 0, marginLeft: 12 }}>›</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 信頼バッジ */}
        <section className="mt-10" style={{ background: 'white', borderRadius: 16, border: '1px solid #ddd', padding: '20px 24px' }}>
          <p style={{ fontWeight: 700, color: '#555', fontSize: 14, marginBottom: 16 }}>このサイトについて</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: '無料', label: 'すべて無料で読める' },
              { value: '公式', label: '厚労省・法務省の公式情報をもとに作成' },
              { value: '簡単', label: '難しい言葉を使いません' },
            ].map(b => (
              <div key={b.value}>
                <p style={{ fontSize: 24, fontWeight: 700, color: '#1a3a6b' }}>{b.value}</p>
                <p style={{ fontSize: 12, color: '#777', marginTop: 4, lineHeight: 1.5 }}>{b.label}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* フッター */}
      <footer className="mt-12 py-8 px-4" style={{ background: '#222', borderTop: '1px solid #444' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-6 mb-4 justify-center">
            <Link href="/about" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none' }}>運営者情報</Link>
            <Link href="/privacy" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none' }}>プライバシーポリシー</Link>
          </div>
          <p className="text-center" style={{ color: '#777', fontSize: 12 }}>
            © 2026 年金・相続・介護の手続きガイド｜本サイトの情報は参考情報です。詳細は各機関にご確認ください。
          </p>
        </div>
      </footer>

    </div>
  )
}
