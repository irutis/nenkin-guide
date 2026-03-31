/**
 * 年金・相続・介護 記事自動生成スクリプト
 * ANTHROPIC_API_KEY が必要
 * 1回の実行で5記事生成
 */
import Anthropic from '@anthropic-ai/sdk'
import { writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ARTICLES_DIR = join(__dirname, '../src/data/articles')

if (!existsSync(ARTICLES_DIR)) mkdirSync(ARTICLES_DIR, { recursive: true })

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// 既存記事のslugを取得
const existingSlugs = new Set(
  readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
)

// ターゲットキーワードリスト（検索ボリューム順）
const KEYWORDS = [
  // 年金
  { category: 'nenkin', title: '年金は月いくらもらえる？平均額と計算方法をわかりやすく解説', slug: 'nenkin-tsuki-ikura', keywords: ['年金 月いくら', '年金 平均'] },
  { category: 'nenkin', title: '年金の受け取り申請方法｜手続きの流れと必要書類', slug: 'nenkin-shinsei-houhou', keywords: ['年金 申請方法', '年金 手続き'] },
  { category: 'nenkin', title: '繰り下げ受給はお得？65歳以降に受け取りを遅らせるメリット・デメリット', slug: 'nenkin-kurisage', keywords: ['繰り下げ受給', '年金 遅らせる'] },
  { category: 'nenkin', title: '夫が亡くなったら年金はどうなる？遺族年金のしくみ', slug: 'izoku-nenkin-otto', keywords: ['遺族年金', '夫 死亡 年金'] },
  { category: 'nenkin', title: '年金の繰り上げ受給とは？60歳から受け取るメリット・デメリット', slug: 'nenkin-kuriage', keywords: ['繰り上げ受給', '60歳 年金'] },
  { category: 'nenkin', title: '国民年金と厚生年金の違いをわかりやすく解説', slug: 'kokumin-kosei-chigai', keywords: ['国民年金 厚生年金 違い'] },
  { category: 'nenkin', title: '年金の「ねんきん定期便」の見方・読み方完全ガイド', slug: 'nenkin-teikiben-mikata', keywords: ['ねんきん定期便 見方'] },
  { category: 'nenkin', title: 'パート・アルバイトでも年金はもらえる？受給条件を解説', slug: 'nenkin-part-jouken', keywords: ['パート 年金 もらえる'] },
  { category: 'nenkin', title: '障害年金とは？対象条件・金額・申請方法を解説', slug: 'shougai-nenkin', keywords: ['障害年金 条件', '障害年金 申請'] },
  { category: 'nenkin', title: '年金が少ない場合の対処法｜老後の生活費を補う方法', slug: 'nenkin-sukunai-taisho', keywords: ['年金 少ない', '老後 生活費'] },

  // 相続
  { category: 'souzoku', title: '相続手続きの流れ｜亡くなってから何をすればいい？', slug: 'souzoku-nagare', keywords: ['相続 手続き 流れ', '相続 何をする'] },
  { category: 'souzoku', title: '遺言書の書き方｜自筆証書遺言の正しい作成方法', slug: 'yuigonsho-kakikata', keywords: ['遺言書 書き方', '自筆証書遺言'] },
  { category: 'souzoku', title: '銀行口座が凍結されたら？解除の手続き方法を解説', slug: 'ginko-kouza-touketsu', keywords: ['銀行口座 凍結', '相続 銀行'] },
  { category: 'souzoku', title: '相続税はいくら？計算方法と基礎控除をわかりやすく解説', slug: 'sozokuzei-keisan', keywords: ['相続税 計算', '相続税 いくら'] },
  { category: 'souzoku', title: '法定相続人とは？相続の順番と割合をわかりやすく解説', slug: 'houtei-sozokumin', keywords: ['法定相続人', '相続 順番'] },
  { category: 'souzoku', title: '相続放棄の方法｜借金を引き継がないための手続き', slug: 'souzoku-hoki', keywords: ['相続放棄', '相続 借金'] },
  { category: 'souzoku', title: '不動産の相続手続き｜名義変更の方法と必要書類', slug: 'fudosan-souzoku', keywords: ['不動産 相続', '名義変更 相続'] },
  { category: 'souzoku', title: '遺産分割協議書とは？作り方と注意点を解説', slug: 'isan-bunkatsu-kyogisho', keywords: ['遺産分割協議書', '遺産分割'] },
  { category: 'souzoku', title: '終活とは何か？60代から始めるエンディングノートの書き方', slug: 'shukatsu-ending-note', keywords: ['終活', 'エンディングノート 書き方'] },
  { category: 'souzoku', title: '生命保険は相続財産になる？受取人と税金の関係', slug: 'seimei-hoken-souzoku', keywords: ['生命保険 相続', '死亡保険金 相続税'] },

  // 介護
  { category: 'kaigo', title: '要介護認定の申請方法｜手続きの流れとかかる日数', slug: 'kaigo-nintei-shinsei', keywords: ['要介護認定 申請', '介護認定 手続き'] },
  { category: 'kaigo', title: '介護にかかる費用の目安｜在宅介護と施設介護の比較', slug: 'kaigo-hiyo-meyasu', keywords: ['介護 費用', '介護 いくらかかる'] },
  { category: 'kaigo', title: '老人ホームの種類と選び方｜特養・有料老人ホームの違い', slug: 'roujinhome-erabi', keywords: ['老人ホーム 選び方', '特養 有料老人ホーム 違い'] },
  { category: 'kaigo', title: '介護保険で使えるサービスの一覧｜利用できることを知っておこう', slug: 'kaigo-hoken-service', keywords: ['介護保険 サービス', '介護 使えるサービス'] },
  { category: 'kaigo', title: '在宅介護の限界サイン｜施設への移行を考えるタイミング', slug: 'zaitaku-kaigo-genkai', keywords: ['在宅介護 限界', '施設 入居 タイミング'] },
  { category: 'kaigo', title: '介護休業・介護休暇とは？会社員が使える制度を解説', slug: 'kaigo-kyugyo', keywords: ['介護休業', '介護休暇 制度'] },
  { category: 'kaigo', title: '認知症の親の介護｜症状別の対応方法と相談窓口', slug: 'ninchisho-kaigo', keywords: ['認知症 介護', '認知症 親 どうする'] },
  { category: 'kaigo', title: '介護の「ケアマネジャー」とは？役割と選び方', slug: 'care-manager-toha', keywords: ['ケアマネジャー', 'ケアマネ 選び方'] },
  { category: 'kaigo', title: 'デイサービスとは？費用・利用方法・選び方を解説', slug: 'day-service-toha', keywords: ['デイサービス 費用', 'デイサービス 選び方'] },
  { category: 'kaigo', title: '高額介護サービス費とは？申請すれば介護費が戻ってくる', slug: 'kougaku-kaigo-service-hi', keywords: ['高額介護サービス費', '介護費 払い戻し'] },
]

async function generateArticle(keyword) {
  const today = new Date().toISOString().split('T')[0]

  const prompt = `あなたは年金・相続・介護の専門家です。以下の記事をJSON形式で生成してください。

タイトル: ${keyword.title}
カテゴリ: ${keyword.category}
slug: ${keyword.slug}
ターゲットキーワード: ${keyword.keywords.join(', ')}

60代70代の方が読むことを想定し、以下の条件で書いてください：
- 難しい専門用語は使わない（使う場合はすぐ説明を加える）
- 具体的な数字や例を必ず入れる
- 「〜です」「〜ます」調で書く
- 各セクションは300〜500文字程度

以下のJSON形式のみで返答してください：
{
  "slug": "${keyword.slug}",
  "category": "${keyword.category}",
  "title": "${keyword.title}",
  "description": "120文字以内の記事説明文",
  "sections": [
    {
      "heading": "見出し（20文字以内）",
      "body": "本文（段落は改行で区切る）"
    }
  ],
  "keywords": ${JSON.stringify(keyword.keywords)},
  "publishedAt": "${today}",
  "relatedSlugs": []
}`

  const res = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = res.content[0].text.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '')
  return JSON.parse(raw)
}

async function main() {
  // 未生成のキーワードを抽出
  const remaining = KEYWORDS.filter(k => !existingSlugs.has(k.slug))
  console.log(`未生成: ${remaining.length}件 / 全${KEYWORDS.length}件`)

  if (remaining.length === 0) {
    console.log('✅ 全記事生成済み')
    return
  }

  // 1回の実行で5記事生成
  const targets = remaining.slice(0, 5)
  let generated = 0

  for (const kw of targets) {
    console.log(`\n生成中: ${kw.title}`)
    try {
      const article = await generateArticle(kw)
      const filePath = join(ARTICLES_DIR, `${kw.slug}.json`)
      writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf-8')
      console.log(`  ✅ 完了: ${kw.slug}.json`)
      generated++
      await new Promise(r => setTimeout(r, 1000))
    } catch (e) {
      console.error(`  ❌ エラー: ${e.message}`)
    }
  }

  console.log(`\n✅ ${generated}件生成完了（残り${remaining.length - generated}件）`)
}

main().catch(e => { console.error(e); process.exit(1) })
