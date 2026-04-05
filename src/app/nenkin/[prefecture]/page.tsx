import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PREFECTURES, getPrefectureBySlug } from '@/data/prefectures'
import AffiliateBanners from '@/components/AffiliateBanners'
import AdUnit from '@/components/AdUnit'

export async function generateStaticParams() {
  return PREFECTURES.map(p => ({ prefecture: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ prefecture: string }> }): Promise<Metadata> {
  const { prefecture } = await params
  const pref = getPrefectureBySlug(prefecture)
  if (!pref) return {}
  return {
    title: `${pref.name}の年金相談窓口・手続きガイド｜申請方法・必要書類・受取額`,
    description: `${pref.name}で年金を受け取るための手続きを解説。${pref.capital}の年金事務所への相談方法、必要書類一覧、いくらもらえるかの目安をわかりやすく紹介。ねんきんダイヤル（0570-05-1165）でも相談できます。`,
  }
}

const RELATED_ARTICLES = [
  { href: '/article/nenkin-tsuki-ikura', title: '年金は月いくらもらえる？' },
  { href: '/article/nenkin-shinsei-houhou', title: '年金の受け取り申請方法' },
  { href: '/article/kokumin-kosei-chigai', title: '国民年金と厚生年金の違い' },
  { href: '/article/nenkin-kurisage', title: '繰り下げ受給はお得？' },
  { href: '/article/nenkin-kuriage', title: '繰り上げ受給のメリット・デメリット' },
  { href: '/article/izoku-nenkin-otto', title: '夫が亡くなったら年金はどうなる？' },
]

export default async function NenkinPrefecturePage({ params }: { params: Promise<{ prefecture: string }> }) {
  const { prefecture } = await params
  const pref = getPrefectureBySlug(prefecture)
  if (!pref) notFound()

  const color = { border: '#1a3a6b', bg: '#eff4fb', text: '#1a3a6b' }

  const sections = [
    {
      heading: `${pref.name}の年金相談窓口・問い合わせ先`,
      body: `${pref.name}で年金の相談・申請ができる窓口をご紹介します。\n\n【①ねんきんダイヤル（電話相談）】\n📞 0570-05-1165\n受付時間：月〜金 8:30〜17:15（月曜のみ19:00まで）、第2土曜 9:30〜16:00\n※050で始まるIP電話は 03-6700-1165\n\n【②年金事務所（直接窓口）】\n${pref.capital}をはじめ、${pref.name}内の各地区に日本年金機構の年金事務所があります。窓口に直接行くか、事前に予約して相談できます。場所は「日本年金機構 ${pref.name} 年金事務所」でネット検索するとすぐに見つかります。\n\n【③市区町村窓口】\nお住まいの市役所・町村役場でも国民年金に関する相談・手続きができます（国民年金保険料の免除申請など）。\n\n【④ねんきんネット（インターネット）】\nパソコンやスマートフォンから年金加入記録・受取見込額を確認できる無料サービスです。マイナンバーカードがあれば簡単に使えます。`,
    },
    {
      heading: `${pref.name}の平均的な年金受取額`,
      body: `年金の受取額は個人の加入歴・収入によって異なりますが、${pref.name}も含め全国の平均はおおよそ以下の通りです。\n\n【老齢基礎年金（国民年金のみ）】\n満額：月約68,000円（40年加入の場合）\n平均的な受取額：月5〜6万円程度\n\n【老齢厚生年金（会社員・公務員）】\n老齢基礎年金に上乗せ。平均的な会社員で合計月14〜16万円程度\n\n【夫婦2人の場合】\n夫が会社員・妻が専業主婦の標準的なモデルで、合計月約22万円（2026年度）\n\nご自身の正確な受取見込額は、毎年誕生月に届く「ねんきん定期便」またはねんきんネットで確認できます。${pref.capital}の年金事務所に相談するのも方法のひとつです。`,
    },
    {
      heading: `${pref.name}で年金申請に必要な書類`,
      body: `${pref.name}の年金事務所または市区町村窓口で年金を申請する際に必要な主な書類は以下の通りです。\n\n【全員共通の書類】\n・年金請求書（65歳前に日本年金機構から届く）\n・戸籍謄本（記載事項証明書）\n・住民票の写し\n・本人の銀行通帳（受取口座確認用）\n・マイナンバーカードまたは基礎年金番号がわかるもの（年金手帳など）\n\n【厚生年金に加入していた方は追加で】\n・雇用保険被保険者証（60〜65歳で申請する場合）\n\n【配偶者がいる方は追加で】\n・配偶者の戸籍謄本・住民票\n・配偶者の収入が確認できる書類\n\n書類の準備に時間がかかることがあるため、65歳になる2〜3ヶ月前から準備を始めましょう。不明な点はねんきんダイヤル（0570-05-1165）に電話で確認できます。`,
    },
    {
      heading: `${pref.name}での繰り上げ・繰り下げ受給の手続き`,
      body: `年金は65歳から受け取るのが原則ですが、${pref.name}の年金事務所でも繰り上げ・繰り下げの申請ができます。\n\n【繰り上げ受給（60〜64歳から）】\n1ヶ月早めるごとに0.4%永続的に減額されます。最大60歳から受け取ると24%減額に。一度選ぶと元に戻せないため、慎重に検討を。\n\n【繰り下げ受給（66〜75歳まで）】\n1ヶ月遅らせるごとに0.7%増額。75歳まで待つと最大84%増額になります。健康で長生きできる見込みの方にお得な選択です。\n\n【損益分岐点の目安】\n繰り下げが有利になる時期は65歳受給開始から約11〜12年後。${pref.name}の平均寿命（男性約81歳、女性約87歳）を考えると、健康な方は繰り下げも検討する価値があります。\n\n迷ったら${pref.capital}の年金事務所に相談してみましょう。無料で相談を受けられます。`,
    },
    {
      heading: `${pref.name}で受けられる年金関連の支援制度`,
      body: `${pref.name}では年金以外にも、高齢者を支援するさまざまな国の制度があります。\n\n【年金生活者支援給付金】\n年金が少ない方（老齢基礎年金受給者で前年の所得が一定以下の方）には、月最大5,000円が自動的に加算されます。手続き不要で日本年金機構から案内が届きます。\n\n【高齢者医療費の軽減】\n70歳以上は医療費の自己負担が原則1〜2割（現役並み所得者は3割）に軽減されます。${pref.name}でも全国一律で適用されます。\n\n【高額介護サービス費】\n介護サービスの自己負担が一定額を超えた場合に払い戻しを受けられる制度です。${pref.capital}の市区町村窓口で申請できます。\n\n【生活支援相談】\n年金収入が少なく生活が苦しい場合は、${pref.capital}の福祉事務所に相談することで「生活保護」や各種支援制度を受けられる可能性があります。`,
    },
  ]

  const faqs = [
    {
      q: `${pref.name}の年金事務所の電話番号を教えてください`,
      a: `全国共通のねんきんダイヤル（0570-05-1165）にお電話ください。平日8:30〜17:15（月曜は19:00まで）、第2土曜9:30〜16:00に受け付けています。担当の年金事務所につないでもらうことができます。IP電話の場合は03-6700-1165です。`,
    },
    {
      q: `${pref.name}で年金をもらうには何歳から手続きが必要ですか？`,
      a: `65歳になる約3ヶ月前に日本年金機構から「年金請求書」が届きます。届いたら書類を揃えて${pref.capital}の年金事務所または市区町村窓口に提出します。手続きしなければ自動的には振り込まれないため、忘れずに手続きを行いましょう。`,
    },
    {
      q: `${pref.name}で年金を受け取っていない場合はどうすればいいですか？`,
      a: `まずねんきんダイヤル（0570-05-1165）に電話するか、${pref.capital}の年金事務所の窓口に相談してください。未請求の年金は過去5年分まで遡って受け取ることができる場合があります。`,
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header style={{ background: '#1a3a6b' }}>
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link
            href="/"
            style={{ color: 'white', fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: 8, marginBottom: 10 }}
          >
            ← トップページに戻る
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/nenkin" style={{ color: '#a8c4e8', fontSize: 16, textDecoration: 'none' }}>年金</Link>
            <span style={{ color: '#a8c4e8', fontSize: 16 }}>›</span>
            <span style={{ color: 'white', fontSize: 15 }}>{pref.name}</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* 緊急連絡先ボックス */}
        <div style={{ background: '#1a3a6b', borderRadius: 16, padding: '20px 24px', marginBottom: 28, color: 'white' }}>
          <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#a8c4e8' }}>📞 今すぐ相談したい方へ</p>
          <p style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>0570-05-1165</p>
          <p style={{ fontSize: 15, color: '#c8d9f0' }}>ねんきんダイヤル（無料）｜平日 8:30〜17:15</p>
        </div>

        <span style={{ background: color.bg, color: color.text, border: `1px solid ${color.border}`, fontSize: 14, fontWeight: 700, padding: '5px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 14 }}>
          💴 年金・{pref.region}地方
        </span>

        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.45, marginBottom: 14 }}>
          {pref.name}の年金相談窓口・手続きガイド
        </h1>
        <p style={{ color: '#444', fontSize: 18, marginBottom: 10, lineHeight: 1.8, background: '#f8f8f8', borderLeft: `4px solid ${color.border}`, padding: '12px 16px', borderRadius: '0 8px 8px 0' }}>
          {pref.name}で年金の相談・申請ができる窓口と手続き方法、必要書類をわかりやすくまとめました。
        </p>
        <p style={{ color: '#888', fontSize: 15, marginBottom: 32 }}>更新日：2026年4月</p>

        {/* 目次 */}
        <div style={{ background: color.bg, border: `1px solid ${color.border}`, borderRadius: 14, padding: '20px 24px', marginBottom: 36 }}>
          <p style={{ fontWeight: 700, color: color.text, marginBottom: 14, fontSize: 18 }}>📋 この記事の目次</p>
          <ol style={{ paddingLeft: 22, margin: 0 }}>
            {sections.map((s, i) => (
              <li key={i} style={{ marginBottom: 10 }}>
                <a href={`#section-${i}`} style={{ color: '#2a5298', fontSize: 17, textDecoration: 'none', lineHeight: 1.5 }}>{s.heading}</a>
              </li>
            ))}
          </ol>
        </div>

        {/* 本文 */}
        {sections.map((s, i) => (
          <section key={i} id={`section-${i}`} style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', borderLeft: `5px solid ${color.border}`, paddingLeft: 16, marginBottom: 18, lineHeight: 1.45 }}>
              {s.heading}
            </h2>
            <div style={{ fontSize: 18, lineHeight: 1.95, color: '#222' }}>
              {s.body.split('\n').map((line, j) => (
                <p key={j} style={{ marginBottom: line === '' ? 14 : 0 }}>{line}</p>
              ))}
            </div>
            {i === 1 && <AdUnit slot="1234567891" format="auto" />}
          </section>
        ))}

        {/* FAQ */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', borderLeft: `5px solid ${color.border}`, paddingLeft: 16, marginBottom: 20 }}>
            よくある質問
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {faqs.map((faq, i) => (
              <details key={i} style={{ background: 'white', border: `2px solid ${color.border}30`, borderRadius: 14, padding: '18px 22px' }}>
                <summary style={{ fontWeight: 700, fontSize: 18, color: '#1a1a1a', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, minHeight: 36 }}>
                  <span style={{ lineHeight: 1.5 }}>Q. {faq.q}</span>
                  <span style={{ color: color.border, fontSize: 24, flexShrink: 0, fontWeight: 700 }}>＋</span>
                </summary>
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #eee' }}>
                  <p style={{ color: '#333', fontSize: 17, lineHeight: 1.9 }}>A. {faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        <AffiliateBanners />

        {/* 関連記事 */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 18 }}>年金に関する関連記事</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {RELATED_ARTICLES.map(a => (
              <Link
                key={a.href}
                href={a.href}
                style={{ background: 'white', border: '1px solid #ddd', borderRadius: 14, padding: '16px 20px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 64 }}
              >
                <span style={{ fontSize: 17, color: '#1a1a1a', fontWeight: 600, lineHeight: 1.5 }}>{a.title}</span>
                <span style={{ color: color.border, fontSize: 24, flexShrink: 0, marginLeft: 12, fontWeight: 700 }}>›</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 注意書き */}
        <div style={{ background: '#fff8e1', border: '1px solid #f5c518', borderRadius: 14, padding: '18px 22px', marginTop: 36 }}>
          <p style={{ fontSize: 16, color: '#7a5c00', lineHeight: 1.8, margin: 0 }}>
            ⚠️ 本記事は一般的な情報提供を目的としています。年金額は加入状況により異なります。詳細はねんきんダイヤル（0570-05-1165）または{pref.capital}の年金事務所にご確認ください。
          </p>
        </div>

        {/* 他の都道府県 */}
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>他の都道府県の年金情報</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PREFECTURES.filter(p => p.slug !== pref.slug).slice(0, 16).map(p => (
              <Link key={p.slug} href={`/nenkin/${p.slug}`} style={{ background: 'white', border: '1px solid #ddd', borderRadius: 10, padding: '10px 16px', fontSize: 16, color: '#333', textDecoration: 'none', minHeight: 44 }}>
                {p.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ナビゲーション */}
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Link href="/nenkin" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: color.border, color: 'white', fontWeight: 700, fontSize: 18, padding: '18px 32px', borderRadius: 14, textDecoration: 'none', minHeight: 60 }}>
            ← 年金の記事一覧へ
          </Link>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '2px solid #1a3a6b', color: '#1a3a6b', fontWeight: 700, fontSize: 18, padding: '18px 32px', borderRadius: 14, textDecoration: 'none', minHeight: 60 }}>
            🏠 トップページに戻る
          </Link>
        </div>
      </div>

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
