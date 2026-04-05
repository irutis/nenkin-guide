/**
 * FAQゼロの既存記事にFAQを一括追加するスクリプト
 * ANTHROPIC_API_KEY が必要
 * 1回の実行で10記事分のFAQを生成・上書き保存
 */
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ARTICLES_DIR = join(__dirname, '../src/data/articles')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function generateFaqs(article) {
  const prompt = `あなたは年金・相続・介護の専門家です。
以下の記事に対して、Googleで実際に検索されそうなよくある質問（FAQ）を5件作成してください。

記事タイトル: ${article.title}
カテゴリ: ${article.category}
キーワード: ${(article.keywords || []).join(', ')}
記事の概要: ${article.description}

条件：
- 60代70代の方が実際に検索しそうな質問を選ぶ
- 回答は具体的な数字・手順・金額を含める
- 「〜です」「〜ます」調で書く
- 質問は30文字以内、回答は100〜150文字

以下のJSON配列のみで返答してください：
[
  {
    "q": "質問文",
    "a": "回答文"
  }
]`

  const res = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = res.content[0].text.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '')
  return JSON.parse(raw)
}

async function main() {
  const files = readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'))

  const noFaqFiles = files.filter(f => {
    const article = JSON.parse(readFileSync(join(ARTICLES_DIR, f), 'utf-8'))
    return !article.faqs || article.faqs.length === 0
  })

  console.log(`FAQなし記事: ${noFaqFiles.length}件`)

  const targets = noFaqFiles
  let patched = 0

  for (const file of targets) {
    const filePath = join(ARTICLES_DIR, file)
    const article = JSON.parse(readFileSync(filePath, 'utf-8'))
    console.log(`\n処理中: ${article.title}`)

    try {
      const faqs = await generateFaqs(article)
      article.faqs = faqs
      writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf-8')
      console.log(`  ✅ FAQ ${faqs.length}件追加: ${file}`)
      patched++
    } catch (e) {
      console.error(`  ❌ 失敗: ${file}`, e.message)
    }
  }

  console.log(`\n完了: ${patched}件パッチ済み / 残り${noFaqFiles.length - patched}件`)
}

main()
