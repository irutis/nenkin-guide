import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PREFECTURES, getPrefectureBySlug } from '@/data/prefectures'
import AffiliateBanners from '@/components/AffiliateBanners'

export async function generateStaticParams() {
  return PREFECTURES.map(p => ({ prefecture: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ prefecture: string }> }): Promise<Metadata> {
  const { prefecture } = await params
  const pref = getPrefectureBySlug(prefecture)
  if (!pref) return {}
  return {
    title: `${pref.name}の年金手続き｜申請窓口・必要書類・受取額の目安`,
    description: `${pref.name}で年金を受け取るための手続き方法を解説。${pref.capital}の年金事務所への申請方法、必要書類、いくらもらえるかの目安をわかりやすく紹介します。`,
  }
}

export default async function NenkinPrefecturePage({ params }: { params: Promise<{ prefecture: string }> }) {
  const { prefecture } = await params
  const pref = getPrefectureBySlug(prefecture)
  if (!pref) notFound()

  const color = { border: '#1a3a6b', bg: '#eff4fb', text: '#1a3a6b' }

  const sections = [
    {
      heading: `${pref.name}の年金申請窓口`,
      body: `${pref.name}で老齢年金を受け取るための申請は、主に以下の窓口で行います。\n\n【年金事務所】\n${pref.capital}をはじめ、${pref.name}内の各地区に日本年金機構の年金事務所があります。年金の受取申請・相談はここで行います。\n\n【市区町村窓口】\n国民年金に関する手続き（保険料の免除申請など）は、お住まいの市区町村役場でも手続きできます。\n\n【ねんきんダイヤル】\n0570-05-1165（平日8:30〜17:15）に電話して、${pref.name}の担当年金事務所を確認することもできます。\n\n年金の受取申請は、原則として65歳になる3ヶ月前に「年金請求書」が届くので、書類を揃えて提出します。`,
    },
    {
      heading: `${pref.name}の平均的な年金受取額`,
      body: `年金の受取額は個人の加入歴・収入によって異なりますが、${pref.name}も含め全国の平均はおおよそ以下の通りです。\n\n【老齢基礎年金（国民年金のみ）】\n満額：月約68,000円（40年加入の場合）\n平均的な受取額：月5〜6万円程度\n\n【老齢厚生年金（会社員・公務員）】\n老齢基礎年金に上乗せ。平均的な会社員で合計月14〜16万円程度\n\n【夫婦2人の場合】\n夫が会社員・妻が専業主婦の標準的なモデルで、合計月約22万円（2026年度）\n\n${pref.name}の物価水準や生活費と比較して、老後の収支を確認しておくことをおすすめします。`,
    },
    {
      heading: `${pref.name}で年金申請に必要な書類`,
      body: `${pref.name}の年金事務所または市区町村窓口で年金を申請する際に必要な主な書類は以下の通りです。\n\n【全員共通】\n・年金請求書（65歳前に日本年金機構から届く）\n・戸籍謄本（記載事項証明書）\n・住民票の写し\n・本人の銀行通帳（受取口座確認）\n・マイナンバーカードまたは基礎年金番号がわかるもの\n\n【厚生年金の方は追加で】\n・雇用保険被保険者証（60〜65歳で申請する場合）\n\n【配偶者がいる方は追加で】\n・配偶者の戸籍謄本・住民票\n・配偶者の収入が確認できる書類\n\n書類の準備に時間がかかることがあるため、65歳になる2〜3ヶ月前から準備を始めましょう。`,
    },
    {
      heading: `${pref.name}で繰り上げ・繰り下げ受給を選ぶには`,
      body: `年金は65歳から受け取るのが原則ですが、${pref.name}の年金事務所でも繰り上げ・繰り下げの申請ができます。\n\n【繰り上げ受給（60〜64歳から）】\n1ヶ月早めるごとに0.4%減額。最大60歳から受け取ると24%減額になります。一度選ぶと元に戻せないため慎重に検討を。\n\n【繰り下げ受給（66〜75歳まで）】\n1ヶ月遅らせるごとに0.7%増額。75歳まで待つと最大84%増額になります。長生きするほどお得です。\n\n【どちらが得か】\n繰り下げが有利になる損益分岐点は、65歳から受け取った場合と比べて約11〜12年後。${pref.name}の平均寿命（男性約81歳、女性約87歳）を考えると、健康な方は繰り下げも検討の余地があります。`,
    },
    {
      heading: `${pref.name}で受けられる年金関連の支援`,
      body: `${pref.name}では年金以外にも、高齢者を支援するさまざまな制度があります。\n\n【低年金者への補足的老齢給付】\n年金が少ない方には、月最大5,000円の「年金生活者支援給付金」が自動的に加算されます。\n\n【高齢者医療費の軽減】\n70歳以上は医療費の自己負担が原則1〜2割（現役並み所得者は3割）。${pref.name}でも同様に適用されます。\n\n【生活困窮者への支援】\n年金収入が少なく生活が苦しい場合、${pref.capital}の福祉事務所に相談すると「生活保護」や「住宅扶助」を受けられる可能性があります。\n\n【無料年金相談】\n${pref.name}内の年金事務所では、事前予約で無料の年金相談を受けられます。`,
    },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      <header style={{ background: '#1a3a6b' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3 flex-wrap">
          <Link href="/" style={{ color: '#a8c4e8', fontSize: 14, textDecoration: 'none' }}>ホーム</Link>
          <span style={{ color: '#a8c4e8' }}>›</span>
          <Link href="/nenkin" style={{ color: '#a8c4e8', fontSize: 14, textDecoration: 'none' }}>年金</Link>
          <span style={{ color: '#a8c4e8' }}>›</span>
          <span style={{ color: 'white', fontSize: 14 }}>{pref.name}</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <span style={{ background: color.bg, color: color.text, border: `1px solid ${color.border}`, fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20, display: 'inline-block', marginBottom: 12 }}>
          💴 年金・{pref.region}地方
        </span>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.45, marginBottom: 12 }}>
          {pref.name}の年金手続きガイド｜申請窓口・必要書類・受取額
        </h1>
        <p style={{ color: '#555', fontSize: 16, marginBottom: 8, lineHeight: 1.7 }}>
          {pref.name}で年金を受け取るための申請手続き、{pref.capital}の年金事務所への行き方、必要書類をわかりやすくまとめました。
        </p>
        <p style={{ color: '#999', fontSize: 13, marginBottom: 32 }}>更新日：2026年3月</p>

        <div style={{ background: color.bg, border: `1px solid ${color.border}`, borderRadius: 12, padding: '16px 20px', marginBottom: 32 }}>
          <p style={{ fontWeight: 700, color: color.text, marginBottom: 10, fontSize: 15 }}>この記事の目次</p>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            {sections.map((s, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                <a href={`#section-${i}`} style={{ color: '#2a5298', fontSize: 15, textDecoration: 'none' }}>{s.heading}</a>
              </li>
            ))}
          </ol>
        </div>

        {sections.map((s, i) => (
          <section key={i} id={`section-${i}`} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', borderLeft: `4px solid ${color.border}`, paddingLeft: 14, marginBottom: 16, lineHeight: 1.45 }}>
              {s.heading}
            </h2>
            <div style={{ fontSize: 17, lineHeight: 1.9, color: '#222' }}>
              {s.body.split('\n').map((line, j) => (
                <p key={j} style={{ marginBottom: line === '' ? 12 : 6 }}>{line}</p>
              ))}
            </div>
          </section>
        ))}

        <AffiliateBanners />

        <div style={{ background: '#fff8e1', border: '1px solid #f5c518', borderRadius: 12, padding: '16px 20px', marginTop: 32 }}>
          <p style={{ fontSize: 14, color: '#7a5c00', lineHeight: 1.7, margin: 0 }}>
            ⚠️ 本記事は一般的な情報提供を目的としています。年金額は加入状況により異なります。詳細は{pref.capital}の年金事務所または「ねんきんネット」でご確認ください。
          </p>
        </div>

        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>他の都道府県の年金情報</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PREFECTURES.filter(p => p.slug !== pref.slug).slice(0, 12).map(p => (
              <Link key={p.slug} href={`/nenkin/${p.slug}`} style={{ background: 'white', border: '1px solid #ddd', borderRadius: 8, padding: '6px 12px', fontSize: 14, color: '#333', textDecoration: 'none' }}>
                {p.name}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Link href="/nenkin" style={{ display: 'inline-block', background: color.border, color: 'white', fontWeight: 700, fontSize: 16, padding: '14px 32px', borderRadius: 12, textDecoration: 'none' }}>
            ← 年金の記事一覧へ
          </Link>
        </div>
      </div>

      <footer className="mt-12 py-8 px-4" style={{ background: '#222' }}>
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/about" style={{ color: '#aaa', fontSize: 14, marginRight: 24, textDecoration: 'none' }}>運営者情報</Link>
          <Link href="/privacy" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none' }}>プライバシーポリシー</Link>
          <p style={{ color: '#777', fontSize: 12, marginTop: 12 }}>© 2026 年金・相続・介護の手続きガイド</p>
        </div>
      </footer>
    </div>
  )
}
