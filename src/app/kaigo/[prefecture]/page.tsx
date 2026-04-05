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
    title: `${pref.name}の介護施設・老人ホーム｜費用・申請方法・選び方ガイド`,
    description: `${pref.name}の介護認定申請・老人ホーム選び・費用について詳しく解説。${pref.capital}など${pref.name}全域の介護相談窓口と手続きの流れをわかりやすく紹介します。`,
  }
}

const RELATED_ARTICLES = [
  { href: '/article/kaigo-nintei-shinsei', title: '要介護認定の申請方法' },
  { href: '/article/kaigo-hiyo-meyasu', title: '介護にかかる費用の目安' },
  { href: '/article/roujinhome-erabi', title: '老人ホームの種類と選び方' },
  { href: '/article/kaigo-hoken-service', title: '介護保険で使えるサービス一覧' },
  { href: '/article/care-manager-toha', title: 'ケアマネジャーとは？' },
  { href: '/article/ninchisho-kaigo', title: '認知症の親の介護' },
]

export default async function KaigoPrefecturePage({ params }: { params: Promise<{ prefecture: string }> }) {
  const { prefecture } = await params
  const pref = getPrefectureBySlug(prefecture)
  if (!pref) notFound()

  const color = { border: '#7a4200', bg: '#fdf5eb', text: '#7a4200' }

  const sections = [
    {
      heading: `${pref.name}の介護認定申請の方法`,
      body: `${pref.name}で介護認定を申請するには、まずお住まいの市区町村の窓口（${pref.capital}の場合は市役所・区役所の介護保険担当課）に「要介護認定申請書」を提出します。\n\n申請後、市区町村の調査員が自宅を訪問し、心身の状態を調査します（認定調査）。その後、主治医の意見書と合わせて介護認定審査会で審査され、通常30日以内に「要支援1〜2」または「要介護1〜5」の認定結果が届きます。\n\n申請から認定まで約30〜60日かかるため、早めの申請をお勧めします。申請に迷う場合は、${pref.capital}の「地域包括支援センター」に相談すると無料でサポートを受けられます。`,
    },
    {
      heading: `${pref.name}の老人ホームの種類と費用`,
      body: `${pref.name}の老人ホームには大きく分けて「特別養護老人ホーム（特養）」「介護付有料老人ホーム」「グループホーム」「サービス付き高齢者向け住宅（サ高住）」があります。\n\n【費用の目安（${pref.name}の場合）】\n・特別養護老人ホーム：月5〜15万円（所得により異なる）\n・介護付有料老人ホーム：月15〜35万円\n・グループホーム：月12〜20万円\n・サービス付き高齢者向け住宅：月10〜25万円\n\n特養は費用が安いですが、入居待機者が多く、すぐに入れないケースが多いです。${pref.name}では特に${pref.capital}周辺で待機期間が長くなる傾向があります。\n\n施設探しには「みんなの介護」などの無料比較サービスの活用も便利です。`,
    },
    {
      heading: `${pref.name}で使える介護保険サービス`,
      body: `要介護認定を受けると、介護保険を使ってさまざまなサービスが1〜3割の自己負担で利用できます。\n\n【在宅で使えるサービス】\n・訪問介護（ホームヘルパー）：日常生活のお手伝い\n・通所介護（デイサービス）：日中施設に通うサービス\n・訪問看護：看護師が自宅を訪問\n・福祉用具のレンタル：車いす・介護ベッドなど\n\n【施設サービス】\n・特別養護老人ホーム（要介護3以上）\n・老人保健施設（リハビリが目的）\n・介護医療院\n\n${pref.name}のケアマネジャー（介護支援専門員）に相談すると、適切なサービスを組み合わせた「ケアプラン」を無料で作成してもらえます。`,
    },
    {
      heading: `${pref.name}の介護で使える支援制度`,
      body: `${pref.name}には介護保険以外にも、介護者を支援するさまざまな国の制度があります。\n\n【高額介護サービス費】同一月内の介護保険サービスの自己負担が上限額を超えた場合、超過分が払い戻されます。上限は所得に応じて月15,000円〜44,400円。\n\n【介護休業制度】家族を介護するために仕事を休む場合、「介護休業」（通算93日まで）や「介護休暇」（年5日）を取得できます。${pref.name}の企業でも取得できる権利です。\n\n【認知症サポート】${pref.name}の各市区町村には「地域包括支援センター」があり、認知症に関する相談を無料で受け付けています。`,
    },
    {
      heading: `${pref.name}の介護施設を探すには`,
      body: `${pref.name}の介護施設を探す方法は主に3つあります。\n\n①地域包括支援センターに相談する：${pref.name}内の各市区町村に設置されており、施設の情報提供や入居相談を無料で行っています。\n\n②介護施設紹介サービスを使う：「みんなの介護」「LIFULL介護」などの無料サービスを使うと、${pref.name}全域の施設を条件で絞り込んで比較できます。専任のアドバイザーが無料で相談に乗ってくれます。\n\n③市区町村の窓口：${pref.capital}の場合は市役所・区役所の介護保険担当課で、施設一覧を入手できます。`,
    },
  ]

  const faqs = [
    {
      q: `${pref.name}で介護認定の申請はどこにすればいいですか？`,
      a: `お住まいの市区町村の窓口（市役所・区役所の介護保険担当課）に申請します。「${pref.capital}」にお住まいの場合は${pref.capital}市役所・区役所です。申請に迷う場合はお近くの「地域包括支援センター」に相談すると無料でサポートを受けられます。`,
    },
    {
      q: `${pref.name}の特別養護老人ホームの費用はいくらですか？`,
      a: `特別養護老人ホーム（特養）の費用は所得によって異なりますが、月5〜15万円程度が目安です。介護保険が適用されるため実費負担は1〜3割です。待機期間が長いため、早めに申込みをすることをお勧めします。`,
    },
    {
      q: `${pref.name}で介護の相談ができる窓口を教えてください`,
      a: `お住まいの市区町村にある「地域包括支援センター」が最初の相談窓口です。介護認定の申請サポート・ケアマネジャーの紹介・施設情報の提供を無料で行っています。${pref.capital}の場合は${pref.capital}市・区のホームページから最寄りのセンターを検索できます。`,
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

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://nenkin-guide.jp' },
      { '@type': 'ListItem', position: 2, name: '介護', item: 'https://nenkin-guide.jp/kaigo' },
      { '@type': 'ListItem', position: 3, name: `${pref.name}の介護情報`, item: `https://nenkin-guide.jp/kaigo/${pref.slug}` },
    ],
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <header style={{ background: '#7a4200' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/kaigo" style={{ color: '#f5c48a', fontSize: 16, textDecoration: 'none' }}>介護</Link>
            <span style={{ color: '#f5c48a', fontSize: 16 }}>›</span>
            <span style={{ color: 'white', fontSize: 15 }}>{pref.name}</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <span style={{ background: color.bg, color: color.text, border: `1px solid ${color.border}`, fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20, display: 'inline-block', marginBottom: 12 }}>
          🤝 介護・{pref.region}地方
        </span>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.45, marginBottom: 12 }}>
          {pref.name}の介護施設・老人ホーム完全ガイド｜費用・申請・選び方
        </h1>
        <p style={{ color: '#555', fontSize: 17, marginBottom: 8, lineHeight: 1.7 }}>
          {pref.name}で介護が必要になったとき、どこに相談すればいいか、費用はいくらかかるかを詳しく解説します。
        </p>
        <p style={{ color: '#999', fontSize: 14, marginBottom: 28 }}>更新日：2026年4月</p>

        {/* 相談窓口ボックス */}
        <div style={{ background: '#7a4200', borderRadius: 14, padding: '20px 22px', marginBottom: 28, textAlign: 'center' }}>
          <p style={{ color: '#f5c48a', fontSize: 15, marginBottom: 6 }}>📞 介護の相談窓口</p>
          <p style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            地域包括支援センター（無料）
          </p>
          <p style={{ color: '#fde0b8', fontSize: 15 }}>{pref.capital}の市区町村窓口でも相談できます</p>
        </div>

        {/* 目次 */}
        <div style={{ background: '#fdf5eb', border: '1px solid #e8c090', borderRadius: 12, padding: '20px 24px', marginBottom: 36 }}>
          <p style={{ fontWeight: 700, color: '#7a4200', marginBottom: 14, fontSize: 18 }}>📋 この記事の目次</p>
          <ol style={{ paddingLeft: 22, margin: 0 }}>
            {sections.map((s, i) => (
              <li key={i} style={{ marginBottom: 10 }}>
                <a href={`#section-${i}`} style={{ color: '#b85c00', fontSize: 17, textDecoration: 'none', lineHeight: 1.5 }}>{s.heading}</a>
              </li>
            ))}
          </ol>
        </div>

        {/* 本文 */}
        <div>
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
              {i === Math.floor(sections.length / 2) - 1 && (
                <AdUnit slot="3456789012" format="auto" />
              )}
            </section>
          ))}
        </div>

        {/* よくある質問 */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', borderLeft: `5px solid ${color.border}`, paddingLeft: 16, marginBottom: 20 }}>
            よくある質問
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {faqs.map((faq, i) => (
              <details key={i} style={{ background: 'white', border: `2px solid ${color.border}20`, borderRadius: 14, padding: '18px 22px' }}>
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

        {/* 注意書き */}
        <div style={{ background: '#fff8e1', border: '1px solid #f5c518', borderRadius: 14, padding: '18px 22px', marginTop: 36 }}>
          <p style={{ fontSize: 16, color: '#7a5c00', lineHeight: 1.8, margin: 0 }}>
            ⚠️ 本記事は一般的な情報提供を目的としています。施設の空き状況・費用は変動します。詳細はお住まいの市区町村窓口または各施設にご確認ください。
          </p>
        </div>

        {/* 関連記事 */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 18 }}>介護に関する記事</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {RELATED_ARTICLES.map(r => (
              <Link
                key={r.href}
                href={r.href}
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
                <span style={{ fontSize: 17, color: '#1a1a1a', fontWeight: 600, lineHeight: 1.5 }}>{r.title}</span>
                <span style={{ color: color.border, fontSize: 24, flexShrink: 0, marginLeft: 12, fontWeight: 700 }}>›</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 他都道府県リンク */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>他の都道府県の介護情報</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {PREFECTURES.filter(p => p.slug !== pref.slug).map(p => (
              <Link
                key={p.slug}
                href={`/kaigo/${p.slug}`}
                style={{
                  background: 'white',
                  border: '1px solid #e8c090',
                  borderRadius: 10,
                  padding: '8px 14px',
                  fontSize: 16,
                  color: '#7a4200',
                  textDecoration: 'none',
                  minHeight: 44,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ナビゲーションボタン */}
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Link
            href="/kaigo"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: color.border,
              color: 'white',
              fontWeight: 700,
              fontSize: 18,
              padding: '18px 32px',
              borderRadius: 14,
              textDecoration: 'none',
              minHeight: 60,
            }}
          >
            ← 介護の記事一覧へ
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
            }}
          >
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
