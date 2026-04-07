import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PREFECTURES, getPrefectureBySlug } from '@/data/prefectures'
import AffiliateBanners from '@/components/AffiliateBanners'
import AdUnit from '@/components/AdUnit'

// 主要都道府県の固有データ（SEO強化・独自コンテンツ）
const PREFECTURE_SPECIFIC: Record<string, {
  offices: { name: string; address: string; tel: string; hours: string }[]
  localStats: string
  extraSection: { heading: string; body: string }
  extraFaqs: { q: string; a: string }[]
}> = {
  kyoto: {
    offices: [
      { name: '京都年金事務所', address: '京都市南区東九条南烏丸町28 京都テルサ東館3F', tel: '075-622-5001', hours: '平日 8:30〜17:15（月曜19:00まで）' },
      { name: '京都北年金事務所', address: '京都市中京区烏丸通二条下る秋野々町529 ライオンズ烏丸二条ビル4F', tel: '075-256-8500', hours: '平日 8:30〜17:15（月曜19:00まで）' },
      { name: '福知山年金事務所', address: '福知山市字堀2459-10', tel: '0773-22-2951', hours: '平日 8:30〜17:15（月曜19:00まで）' },
    ],
    localStats: '京都府の高齢者（65歳以上）人口は約75万人（2024年）で、高齢化率は約29%。全国平均を上回る水準です。老齢基礎年金の平均受給額は月約56,000円、老齢厚生年金（基礎含む）の平均は月約145,000円（京都府内受給者の実績ベース）。',
    extraSection: {
      heading: '京都府の年金受給者向け地域サービス',
      body: '京都府では、年金生活者のための相談窓口が充実しています。\n\n【京都府社会保険労務士会の無料相談】\n京都府内の社会保険労務士が月1回程度、無料で年金相談を実施しています。詳細は京都府社会保険労務士会（TEL: 075-213-8220）にお問い合わせください。\n\n【京都市シニア活動センター】\n京都市内の高齢者向け相談窓口。年金に限らず、介護・生活全般の相談ができます。各区の「いきいき市民活動センター」でも対応可能。\n\n【京都府の特徴】\n京都府は古都として伝統産業（西陣織・清水焼など）の職人が多く、個人事業主・自営業者の割合が高い地域です。国民年金のみ加入の方も多いため、「年金生活者支援給付金」の対象になる方も多くいます。心当たりがある方は日本年金機構から案内が届いているか確認しましょう。',
    },
    extraFaqs: [
      {
        q: '京都年金事務所の場所・アクセスを教えてください',
        a: '京都年金事務所は京都市南区東九条南烏丸町28 京都テルサ東館3Fにあります。近鉄「東寺駅」から徒歩5分、地下鉄「九条駅」から徒歩8分です。予約は電話（075-622-5001）またはねんきんネットから行えます。',
      },
      {
        q: '京都府で年金の繰り下げ受給を選んだ場合の増額はどのくらいですか？',
        a: '1ヶ月繰り下げるごとに0.7%増額されます。70歳まで待てば42%増、75歳まで待てば最大84%増になります。京都府の平均寿命（男性約81歳・女性約88歳）を考慮すると、健康な方は繰り下げが有利な場合が多いです。京都年金事務所で試算してもらうことができます。',
      },
    ],
  },
  osaka: {
    offices: [
      { name: '大阪年金事務所', address: '大阪市中央区谷町2-3-25 日本年金機構大阪ビル', tel: '06-6941-7521', hours: '平日 8:30〜17:15（月曜19:00まで）' },
      { name: '大阪北年金事務所', address: '大阪市北区梅田1-2-2 大阪駅前第2ビル10F', tel: '06-6344-1941', hours: '平日 8:30〜17:15（月曜19:00まで）' },
      { name: '大阪西年金事務所', address: '大阪市西区靱本町2-2-4', tel: '06-6538-2941', hours: '平日 8:30〜17:15（月曜19:00まで）' },
      { name: '堺年金事務所', address: '堺市堺区三国ヶ丘御幸通59 泉北高速鉄道三国ヶ丘ビル5F', tel: '072-238-5101', hours: '平日 8:30〜17:15（月曜19:00まで）' },
    ],
    localStats: '大阪府の高齢者（65歳以上）人口は約220万人（2024年）で全国2位。高齢化率は約25%。老齢基礎年金の平均受給額は月約55,000円、老齢厚生年金（基礎含む）の平均は月約148,000円（大阪府内受給者の実績ベース）。大阪府は受給者数が多く、年金事務所が混雑しやすいため、事前予約が強く推奨されています。',
    extraSection: {
      heading: '大阪府の年金相談を賢く活用する方法',
      body: '大阪府内には10か所以上の年金事務所があります。混雑を避けるためのコツをご紹介します。\n\n【予約制の活用（強く推奨）】\n大阪の年金事務所は全国でも特に混雑します。予約なしで来所すると2〜3時間待つことも珍しくありません。必ずねんきんネット（https://www.nenkin.go.jp/n_net/）または電話で事前予約をしてから来所してください。\n\n【混雑しにくい曜日・時間帯】\n月曜と月末は特に混雑します。火〜木曜の午後（13:30〜15:30）が比較的空いています。\n\n【大阪市内の区役所でもできる手続き】\n住所変更届・国民年金保険料の免除申請・被扶養者届などは各区役所の保険年金担当窓口でも手続き可能。年金事務所への来所を省けます。\n\n【大阪府の特徴的なサービス】\n大阪府社会保険労務士会（TEL: 06-6941-1153）では年金に特化した無料電話相談を実施しています。複雑なケース（離婚後の年金分割・海外在住歴あり等）もこちらで相談できます。',
    },
    extraFaqs: [
      {
        q: '大阪で年金の手続きをするとき、どの年金事務所に行けばいいですか？',
        a: '基本的にはお住まいの住所を管轄する年金事務所に行きます。大阪市内であれば大阪北・大阪・大阪西・大阪東・大阪南の各事務所のいずれかが管轄です。管轄事務所はねんきんダイヤル（0570-05-1165）に問い合わせるか、日本年金機構のウェブサイトで住所を入力して確認できます。',
      },
      {
        q: '大阪の年金事務所は予約なしで行けますか？',
        a: '予約なしでも来所できますが、大阪の年金事務所は非常に混雑しており、1〜3時間待ちになることも多いです。ねんきんネットまたはお電話でご予約の上、来所することを強くお勧めします。',
      },
    ],
  },
  aichi: {
    offices: [
      { name: '名古屋南年金事務所', address: '名古屋市熱田区伝馬2-3-19', tel: '052-671-7836', hours: '平日 8:30〜17:15（月曜19:00まで）' },
      { name: '名古屋北年金事務所', address: '名古屋市北区清水4-17-1', tel: '052-911-1320', hours: '平日 8:30〜17:15（月曜19:00まで）' },
      { name: '名古屋西年金事務所', address: '名古屋市中村区名駅4-11-1 名古屋フォーラムビル6F', tel: '052-452-2711', hours: '平日 8:30〜17:15（月曜19:00まで）' },
      { name: '岡崎年金事務所', address: '岡崎市柱4-3-2', tel: '0564-52-6811', hours: '平日 8:30〜17:15（月曜19:00まで）' },
      { name: '豊橋年金事務所', address: '豊橋市大国町111', tel: '0532-52-7170', hours: '平日 8:30〜17:15（月曜19:00まで）' },
    ],
    localStats: '愛知県の高齢者（65歳以上）人口は約170万人（2024年）で全国4位。高齢化率は約22%と全国で最も低い水準の一つ（トヨタ関連企業が集まる製造業県のため現役世代が多い）。老齢厚生年金（基礎含む）の平均は月約160,000円と全国平均より高め（厚生年金の平均加入期間が長いため）。',
    extraSection: {
      heading: '愛知県（名古屋）の年金手続きの特徴と注意点',
      body: '愛知県は製造業・自動車産業の中心地として、会社員・厚生年金加入者の割合が高い地域です。\n\n【愛知県の年金の特徴】\nトヨタ・デンソー・アイシンなど大企業が多く、長期間厚生年金に加入している方が多いため、全国平均より年金受給額が高い傾向があります。また、企業年金（確定給付企業年金・企業型DC）と公的年金を両方受給している方も多いです。\n\n【企業年金との注意点】\n企業年金と公的老齢厚生年金を同時受給する場合、「在職老齢年金」のルールにより、月収+年金が50万円を超えると年金が一部カットされます。不安な方は名古屋南・北・西いずれかの年金事務所で無料試算を依頼できます。\n\n【名古屋市の区役所活用】\n名古屋市内の区役所（16区）でも国民年金の手続きが可能。住所変更・保険料免除申請・学生納付特例などは各区役所で対応できます。\n\n【愛知県社会保険労務士会の相談窓口】\nTEL: 052-962-5270。月〜金（除く祝日）10:00〜16:00に年金相談を受け付けています。',
    },
    extraFaqs: [
      {
        q: '名古屋（愛知）の年金事務所で手続きする際、何を持参すればいいですか？',
        a: '基本は①年金請求書（または年金手帳・基礎年金番号通知書）②マイナンバーカードまたは通知カード+身分証明書③戸籍謄本（3ヶ月以内）④住民票④受取口座の通帳またはキャッシュカード。厚生年金の方は雇用保険被保険者証も必要な場合があります。持参書類は事前にねんきんダイヤル（0570-05-1165）に確認することをお勧めします。',
      },
      {
        q: '愛知県で企業年金と公的年金を両方もらえますか？',
        a: '基本的には両方受給できます。ただし、在職中の場合は「在職老齢年金」の制度により、月収と年金の合計が一定額（2026年度は50万円）を超えると老齢厚生年金が一部停止される場合があります。詳細は名古屋の年金事務所でご確認ください。',
      },
    ],
  },
}

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
  { href: '/article/nenkin-tetsuzuki-kanzen-guide', title: '年金の手続き完全ガイド｜全種類を解説' },
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

  const specific = PREFECTURE_SPECIFIC[pref.slug]

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
    ...(specific?.extraFaqs ?? []),
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

        {/* 都道府県固有：年金事務所一覧テーブル */}
        {specific && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', borderLeft: `5px solid ${color.border}`, paddingLeft: 16, marginBottom: 18, lineHeight: 1.45 }}>
              {pref.name}の年金事務所一覧（住所・電話番号）
            </h2>
            <div style={{ fontSize: 16, color: '#333', lineHeight: 1.8, marginBottom: 14 }}>
              <p>{pref.name}内の主要な年金事務所の住所・電話番号・受付時間をまとめました。</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {specific.offices.map((office, i) => (
                <div key={i} style={{ background: 'white', border: `1px solid ${color.border}30`, borderRadius: 12, padding: '16px 20px' }}>
                  <p style={{ fontWeight: 700, fontSize: 17, color: '#1a1a1a', marginBottom: 6 }}>📍 {office.name}</p>
                  <p style={{ fontSize: 15, color: '#444', marginBottom: 4 }}>住所：{office.address}</p>
                  <p style={{ fontSize: 15, color: '#444', marginBottom: 4 }}>電話：<strong>{office.tel}</strong></p>
                  <p style={{ fontSize: 14, color: '#666' }}>受付：{office.hours}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 14, color: '#888', marginTop: 10 }}>※ 住所・電話番号は変更される場合があります。来所前に電話またはウェブサイトでご確認ください。</p>
          </section>
        )}

        {/* 都道府県固有：地域統計 */}
        {specific && (
          <div style={{ background: '#eff4fb', border: `1px solid ${color.border}`, borderRadius: 12, padding: '18px 22px', marginBottom: 36 }}>
            <p style={{ fontWeight: 700, color: color.text, fontSize: 16, marginBottom: 8 }}>📊 {pref.name}の年金受給状況（データ）</p>
            <p style={{ fontSize: 16, color: '#333', lineHeight: 1.8 }}>{specific.localStats}</p>
          </div>
        )}

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

        {/* 都道府県固有：追加セクション */}
        {specific && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', borderLeft: `5px solid ${color.border}`, paddingLeft: 16, marginBottom: 18, lineHeight: 1.45 }}>
              {specific.extraSection.heading}
            </h2>
            <div style={{ fontSize: 18, lineHeight: 1.95, color: '#222' }}>
              {specific.extraSection.body.split('\n').map((line, j) => (
                <p key={j} style={{ marginBottom: line === '' ? 14 : 0 }}>{line}</p>
              ))}
            </div>
          </section>
        )}

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
