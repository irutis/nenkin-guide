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
    title: `${pref.name}の介護施設・老人ホーム｜費用・申請方法・選び方ガイド`,
    description: `${pref.name}の介護認定申請・老人ホーム選び・費用について詳しく解説。${pref.capital}など${pref.name}全域の介護施設を無料で比較できます。`,
  }
}

export default async function KaigoPrefecturePage({ params }: { params: Promise<{ prefecture: string }> }) {
  const { prefecture } = await params
  const pref = getPrefectureBySlug(prefecture)
  if (!pref) notFound()

  const color = { border: '#7a4200', bg: '#fdf5eb', text: '#7a4200' }

  const sections = [
    {
      heading: `${pref.name}の介護認定申請の方法`,
      body: `${pref.name}で介護認定を申請するには、まずお住まいの市区町村の窓口（${pref.capital}の場合は市役所・区役所の介護保険担当課）に「要介護認定申請書」を提出します。\n\n申請後、市区町村の調査員が自宅を訪問し、心身の状態を調査します（認定調査）。その後、主治医の意見書と合わせて介護認定審査会で審査され、通常30日以内に「要支援1〜2」または「要介護1〜5」の認定結果が届きます。\n\n申請から認定まで約30〜60日かかるため、早めの申請をおすすめします。`,
    },
    {
      heading: `${pref.name}の老人ホームの種類と費用`,
      body: `${pref.name}の老人ホームには大きく分けて「特別養護老人ホーム（特養）」「介護付有料老人ホーム」「グループホーム」「サービス付き高齢者向け住宅（サ高住）」があります。\n\n【費用の目安（${pref.name}の場合）】\n・特別養護老人ホーム：月5〜15万円（所得により異なる）\n・介護付有料老人ホーム：月15〜35万円\n・グループホーム：月12〜20万円\n・サービス付き高齢者向け住宅：月10〜25万円\n\n特養は費用が安いですが、入居待機者が多く、すぐに入れないケースが多いです。${pref.name}では特に${pref.capital}周辺で待機期間が長くなる傾向があります。`,
    },
    {
      heading: `${pref.name}で使える介護保険サービス`,
      body: `要介護認定を受けると、介護保険を使ってさまざまなサービスが1〜3割の自己負担で利用できます。\n\n【在宅で使えるサービス】\n・訪問介護（ホームヘルパー）：日常生活のお手伝い\n・通所介護（デイサービス）：日中施設に通うサービス\n・訪問看護：看護師が自宅を訪問\n・福祉用具のレンタル：車いす・介護ベッドなど\n\n【施設サービス】\n・特別養護老人ホーム（要介護3以上）\n・老人保健施設（リハビリが目的）\n・介護医療院\n\n${pref.name}のケアマネジャー（介護支援専門員）に相談すると、適切なサービスを組み合わせた「ケアプラン」を無料で作成してもらえます。`,
    },
    {
      heading: `${pref.name}の介護で使える支援制度`,
      body: `${pref.name}には介護保険以外にも、介護者を支援するさまざまな制度があります。\n\n【高額介護サービス費】同一月内の介護保険サービスの自己負担が上限額を超えた場合、超過分が払い戻されます。上限は所得に応じて月15,000円〜44,400円。\n\n【介護休業制度】家族を介護するために仕事を休む場合、「介護休業」（通算93日まで）や「介護休暇」（年5日）を取得できます。${pref.name}の企業でも取得できる権利です。\n\n【認知症サポート】${pref.name}の各市区町村には「地域包括支援センター」があり、認知症に関する相談を無料で受け付けています。`,
    },
    {
      heading: `${pref.name}の介護施設を探すには`,
      body: `${pref.name}の介護施設を探す方法は主に3つあります。\n\n①**地域包括支援センターに相談する**：${pref.name}内の各市区町村に設置されており、施設の情報提供や入居相談を無料で行っています。\n\n②**介護施設紹介サービスを使う**：「みんなの介護」「LIFULL介護」などの無料サービスを使うと、${pref.name}全域の施設を条件で絞り込んで比較できます。専任のアドバイザーが無料で相談に乗ってくれます。\n\n③**市区町村の窓口**：${pref.capital}の場合は市役所・区役所の介護保険担当課で、施設一覧を入手できます。`,
    },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      <header style={{ background: '#7a4200' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3 flex-wrap">
          <Link href="/" style={{ color: '#f5c48a', fontSize: 14, textDecoration: 'none' }}>ホーム</Link>
          <span style={{ color: '#f5c48a' }}>›</span>
          <Link href="/kaigo" style={{ color: '#f5c48a', fontSize: 14, textDecoration: 'none' }}>介護</Link>
          <span style={{ color: '#f5c48a' }}>›</span>
          <span style={{ color: 'white', fontSize: 14 }}>{pref.name}</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <span style={{ background: color.bg, color: color.text, border: `1px solid ${color.border}`, fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20, display: 'inline-block', marginBottom: 12 }}>
          🤝 介護・{pref.region}地方
        </span>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.45, marginBottom: 12 }}>
          {pref.name}の介護施設・老人ホーム完全ガイド｜費用・申請・選び方
        </h1>
        <p style={{ color: '#555', fontSize: 16, marginBottom: 8, lineHeight: 1.7 }}>
          {pref.name}で介護が必要になったとき、どこに相談すればいいか、費用はいくらかかるかを詳しく解説します。{pref.capital}をはじめ{pref.name}全域の情報をまとめました。
        </p>
        <p style={{ color: '#999', fontSize: 13, marginBottom: 32 }}>更新日：2026年3月</p>

        {/* 目次 */}
        <div style={{ background: '#fdf5eb', border: '1px solid #e8c090', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }}>
          <p style={{ fontWeight: 700, color: '#7a4200', marginBottom: 10, fontSize: 15 }}>この記事の目次</p>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            {sections.map((s, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                <a href={`#section-${i}`} style={{ color: '#b85c00', fontSize: 15, textDecoration: 'none' }}>{s.heading}</a>
              </li>
            ))}
          </ol>
        </div>

        {/* 本文 */}
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
            ⚠️ 本記事は一般的な情報提供を目的としています。施設の空き状況・費用は変動します。詳細はお住まいの市区町村窓口または各施設にご確認ください。
          </p>
        </div>

        {/* 他都道府県リンク */}
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>他の都道府県の介護情報</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PREFECTURES.filter(p => p.slug !== pref.slug).slice(0, 12).map(p => (
              <Link key={p.slug} href={`/kaigo/${p.slug}`} style={{ background: 'white', border: '1px solid #ddd', borderRadius: 8, padding: '6px 12px', fontSize: 14, color: '#333', textDecoration: 'none' }}>
                {p.name}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Link href="/kaigo" style={{ display: 'inline-block', background: color.border, color: 'white', fontWeight: 700, fontSize: 16, padding: '14px 32px', borderRadius: 12, textDecoration: 'none' }}>
            ← 介護の記事一覧へ
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
