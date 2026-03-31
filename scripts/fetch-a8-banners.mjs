/**
 * A8.net バナーHTML自動取得スクリプト（nenkin-guide用）
 * 環境変数: A8_LOGIN_ID, A8_PASSWORD
 */

import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const AFFILIATES_PATH = join(__dirname, '../src/data/affiliates.json')

const LOGIN_ID = process.env.A8_LOGIN_ID
const PASSWORD = process.env.A8_PASSWORD

if (!LOGIN_ID || !PASSWORD) {
  console.error('❌ A8_LOGIN_ID と A8_PASSWORD を設定してください')
  process.exit(1)
}

const PREFERRED_SIZES = ['300x250', '468x60', '728x90', '320x50']

async function main() {
  const affiliates = JSON.parse(readFileSync(AFFILIATES_PATH, 'utf-8'))

  const targets = affiliates.filter(a => a.a8_ins_id)
  if (targets.length === 0) {
    console.log('⚠️ a8_ins_id が設定されているプログラムがありません')
    console.log('src/data/affiliates.json に各プログラムのa8_ins_idを設定してください')
    process.exit(0)
  }

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  try {
    console.log('A8.net にログイン中...')
    await page.goto('https://pub.a8.net/a8v2/asLoginAction.do', { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.fill('input[name="login"]', LOGIN_ID)
    await page.fill('input[name="passwd"]', PASSWORD)
    await page.click('input[type="submit"]')
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})

    if (page.url().includes('loginAction')) {
      console.error('❌ ログイン失敗')
      process.exit(1)
    }
    console.log('✅ ログイン成功')

    let updated = 0

    for (const affiliate of affiliates) {
      if (!affiliate.a8_ins_id) {
        console.log(`⏭️  ${affiliate.name}: a8_ins_id未設定のためスキップ`)
        continue
      }

      console.log(`\n🔍 ${affiliate.name} のバナーを取得中...`)

      try {
        await page.goto(
          `https://pub.a8.net/a8v2/media/linkAction.do?insId=${affiliate.a8_ins_id}`,
          { waitUntil: 'networkidle', timeout: 60000 }
        )
        await page.waitForTimeout(5000)

        let bannerHtml = ''
        const textareas = await page.locator('textarea').all()

        for (const size of PREFERRED_SIZES) {
          const [w, h] = size.split('x')
          for (const ta of textareas) {
            const val = await ta.inputValue().catch(() => '')
            if (
              val.includes('a8.net') &&
              val.includes('<img') &&
              val.includes(`width="${w}"`) &&
              val.includes(`height="${h}"`)
            ) {
              bannerHtml = val.trim()
              console.log(`  ✅ ${size} バナーを取得`)
              break
            }
          }
          if (bannerHtml) break
        }

        if (bannerHtml) {
          affiliate.banner_html = bannerHtml
          updated++
        } else {
          console.warn(`  ⚠️ バナーが見つかりませんでした`)
        }
      } catch (e) {
        console.error(`  ❌ エラー: ${e.message}`)
      }
    }

    writeFileSync(AFFILIATES_PATH, JSON.stringify(affiliates, null, 2), 'utf-8')
    console.log(`\n✅ ${updated}件のバナーを更新しました`)
  } finally {
    await browser.close()
  }
}

main().catch(e => { console.error(e); process.exit(1) })
