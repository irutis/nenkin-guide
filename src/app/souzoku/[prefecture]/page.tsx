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
    title: `${pref.name}の相続手続き｜必要書類・費用・期限を徹底解説`,
    description: `${pref.name}で相続が発生したときにすべきこと。銀行口座の凍結解除・不動産名義変更・相続税申告の手続きを${pref.capital}の窓口情報とともに解説します。`,
  }
}

const RELATED_ARTICLES = [
  { href: '/article/souzoku-nagare', title: '相続手続きの流れ（全体像）' },
  { href: '/article/yuigonsho-kakikata', title: '遺言書の書き方' },
  { href: '/article/sozokuzei-keisan', title: '相続税はいくら？計算方法' },
  { href: '/article/houtei-sozokumin', title: '法定相続人とは？' },
  { href: '/article/ginko-kouza-touketsu', title: '銀行口座が凍結されたら？' },
  { href: '/article/fudosan-souzoku', title: '不動産の相続手続き' },
]

export default async function SouzokuPrefecturePage({ params }: { params: Promise<{ prefecture: string }> }) {
  const { prefecture } = await params
  const pref = getPrefectureBySlug(prefecture)
  if (!pref) notFound()

  const color = { border: '#1a5c2e', bg: '#f0f7f2', text: '#1a5c2e' }

  const sections = [
    {
      heading: `${pref.name}で相続が発生したらまずすること`,
      body: `家族が亡くなったとき、${pref.name}でもやるべき手続きは全国共通です。ただし手続きの窓口は${pref.capital}など各市区町村によって異なります。\n\n【死亡後すぐ（7日以内）】\n・死亡診断書の取得（病院から）\n・死亡届の提出（${pref.capital}の市区町村役場）\n・火葬許可証の取得\n\n【1〜3ヶ月以内】\n・遺言書の有無の確認\n・相続人の確認（戸籍謄本を集める）\n・相続財産の調査（預金・不動産・株式など）\n・銀行口座の凍結解除手続き\n\n【3〜4ヶ月以内】\n・相続放棄の判断（借金がある場合）※家庭裁判所に申請\n\n【10ヶ月以内】\n・相続税の申告・納付（課税対象の場合）`,
    },
    {
      heading: `${pref.name}の銀行口座凍結の解除方法`,
      body: `亡くなった方の銀行口座は、金融機関が死亡を知った時点で凍結されます。${pref.name}の銀行（地方銀行・ゆうちょ・メガバンク等）でも同様です。\n\n【解除に必要な書類】\n・被相続人の死亡戸籍（除籍謄本）\n・相続人全員の戸籍謄本\n・相続人全員の印鑑証明書\n・遺産分割協議書（相続人が複数の場合）\n・通帳・キャッシュカード\n\n${pref.capital}の各銀行窓口に上記書類を持参して手続きします。書類の準備に時間がかかるため、早めに動き出すことが大切です。\n\n遺言書がある場合は、遺言書の内容に従って手続きがシンプルになります。`,
    },
    {
      heading: `${pref.name}の不動産相続の名義変更`,
      body: `${pref.name}内の不動産（土地・建物）を相続した場合、2024年4月から相続登記が義務化されました。相続を知った日から3年以内に登記しないと罰則（10万円以下の過料）の対象になります。\n\n【名義変更の手続き先】\n${pref.name}を管轄する法務局（${pref.capital}法務局またはその支局・出張所）\n\n【必要書類】\n・被相続人の出生から死亡までの戸籍謄本\n・相続人全員の戸籍謄本・住民票\n・遺産分割協議書（相続人全員署名・実印押印）\n・固定資産評価証明書\n・登記申請書\n\n登録免許税：固定資産税評価額×0.4%\n\n複雑な場合は${pref.capital}の司法書士に依頼するのが確実です（費用：5〜15万円程度）。`,
    },
    {
      heading: `${pref.name}の相続税の申告が必要かチェック`,
      body: `相続税の申告が必要なのは、遺産総額が「基礎控除額」を超える場合だけです。\n\n基礎控除額 ＝ 3,000万円 ＋ 600万円 × 法定相続人の数\n\n例：相続人が配偶者と子2人（計3人）の場合\n基礎控除 ＝ 3,000万円 ＋ 600万円×3 ＝ 4,800万円\n\n→ 遺産が4,800万円以下なら相続税はかかりません。\n\n${pref.name}でも相続税の申告が必要な割合は約1割程度です。\n\n申告が必要な場合は、亡くなった日から10ヶ月以内に${pref.capital}税務署に申告・納付します。税理士に依頼する場合の費用は遺産総額の0.5〜1%程度。`,
    },
    {
      heading: `${pref.name}で遺言書を作るには`,
      body: `遺言書を作ることで、${pref.name}に残した財産を自分の意思通りに分けることができます。また相続人間のトラブルを防ぐ効果もあります。\n\n【自筆証書遺言】費用ほぼ0円\n全文・日付・氏名を自書し、押印する。財産目録はPCで作成可。${pref.capital}の法務局で保管してもらえます（手数料3,900円）。\n\n【公正証書遺言】より確実\n${pref.capital}の公証役場で公証人が作成。費用は財産額により1〜10万円程度。証人2人が必要。最も確実で改ざんリスクがない方法です。\n\n遺言書がない場合、相続人全員で「遺産分割協議」が必要になり、意見が合わないとトラブルになることがあります。`,
    },
  ]

  const faqs = [
    {
      q: `${pref.name}で相続が発生したらまず何をすればいいですか？`,
      a: `死亡後7日以内に死亡届を${pref.capital}の市区町村役場に提出します。その後、1〜3ヶ月以内に相続人の確認・財産調査・銀行口座の凍結解除を行います。相続放棄が必要な場合は3ヶ月以内、相続税申告は10ヶ月以内が期限です。`,
    },
    {
      q: `${pref.name}で相続税はかかりますか？`,
      a: `相続税は遺産総額が基礎控除（3,000万円＋600万円×法定相続人数）を超える場合のみかかります。例えば相続人が3人なら4,800万円以下なら非課税です。${pref.name}でも申告が必要なのは全体の約1割程度です。`,
    },
    {
      q: `${pref.name}の相続手続きを専門家に頼むといくらかかりますか？`,
      a: `不動産の名義変更（相続登記）を司法書士に依頼する場合は5〜15万円程度。相続税申告を税理士に依頼する場合は遺産総額の0.5〜1%程度（最低報酬10万円前後）。遺産分割で揉めた場合の弁護士費用は30〜100万円程度です。`,
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
      { '@type': 'ListItem', position: 2, name: '相続・遺言', item: 'https://nenkin-guide.jp/souzoku' },
      { '@type': 'ListItem', position: 3, name: `${pref.name}の相続手続き`, item: `https://nenkin-guide.jp/souzoku/${pref.slug}` },
    ],
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <header style={{ background: '#1a5c2e' }}>
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
            <Link href="/souzoku" style={{ color: '#a8d8b9', fontSize: 16, textDecoration: 'none' }}>相続・遺言</Link>
            <span style={{ color: '#a8d8b9', fontSize: 16 }}>›</span>
            <span style={{ color: 'white', fontSize: 15 }}>{pref.name}</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <span style={{ background: color.bg, color: color.text, border: `1px solid ${color.border}`, fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20, display: 'inline-block', marginBottom: 12 }}>
          🏠 相続・遺言・{pref.region}地方
        </span>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.45, marginBottom: 12 }}>
          {pref.name}の相続手続き完全ガイド｜必要書類・窓口・費用
        </h1>
        <p style={{ color: '#555', fontSize: 17, marginBottom: 8, lineHeight: 1.7 }}>
          {pref.name}で相続が発生した場合の手続きを、期限・必要書類・{pref.capital}の窓口情報とともに解説します。
        </p>
        <p style={{ color: '#999', fontSize: 14, marginBottom: 32 }}>更新日：2026年4月</p>

        {/* 相談窓口ボックス */}
        <div style={{ background: '#1a5c2e', borderRadius: 14, padding: '20px 22px', marginBottom: 28, textAlign: 'center' }}>
          <p style={{ color: '#a8d8b9', fontSize: 15, marginBottom: 6 }}>📞 相続の相談窓口</p>
          <p style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            {pref.capital}の法務局・税務署・公証役場
          </p>
          <p style={{ color: '#c8e8d0', fontSize: 15 }}>相続登記：法務局 ／ 相続税：税務署 ／ 遺言書：公証役場</p>
        </div>

        {/* 目次 */}
        <div style={{ background: '#f0f7f2', border: '1px solid #a8d8b9', borderRadius: 12, padding: '20px 24px', marginBottom: 36 }}>
          <p style={{ fontWeight: 700, color: '#1a5c2e', marginBottom: 14, fontSize: 18 }}>📋 この記事の目次</p>
          <ol style={{ paddingLeft: 22, margin: 0 }}>
            {sections.map((s, i) => (
              <li key={i} style={{ marginBottom: 10 }}>
                <a href={`#section-${i}`} style={{ color: '#1a7a3e', fontSize: 17, textDecoration: 'none', lineHeight: 1.5 }}>{s.heading}</a>
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
                <AdUnit slot="2345678901" format="auto" />
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
            ⚠️ 本記事は一般的な情報提供を目的としています。個別の手続きについては、{pref.capital}の各窓口・専門家（司法書士・税理士）にご相談ください。
          </p>
        </div>

        {/* 関連記事 */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 18 }}>相続に関する記事</h2>
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
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>他の都道府県の相続情報</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {PREFECTURES.filter(p => p.slug !== pref.slug).map(p => (
              <Link
                key={p.slug}
                href={`/souzoku/${p.slug}`}
                style={{
                  background: 'white',
                  border: '1px solid #c8e8d0',
                  borderRadius: 10,
                  padding: '8px 14px',
                  fontSize: 16,
                  color: '#1a5c2e',
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
            href="/souzoku"
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
            ← 相続・遺言の記事一覧へ
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
