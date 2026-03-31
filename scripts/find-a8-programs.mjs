/**
 * A8.net 提携済みプログラムからinsIdを取得するスクリプト
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const AFFILIATES_PATH = join(__dirname, '../src/data/affiliates.json')

const LOGIN_ID = process.env.A8_LOGIN_ID
const PASSWORD = process.env.A8_PASSWORD

async function main() {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  // ログイン
  console.log('A8.net にログイン中...')
  await page.goto('https://pub.a8.net/a8v2/asLoginAction.do', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.fill('input[name="login"]', LOGIN_ID)
  await page.fill('input[name="passwd"]', PASSWORD)
  await page.click('input[type="submit"]')
  await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})

  if (page.url().includes('loginAction')) {
    console.error('❌ ログイン失敗 - 認証情報を確認してください')
    await browser.close()
    process.exit(1)
  }
  console.log('✅ ログイン成功\n')

  // 提携済みプログラム一覧を取得
  console.log('提携済みプログラムを検索中...')
  await page.goto('https://pub.a8.net/a8v2/media/linkAction.do', { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(3000)

  // 検索キーワードリスト（nenkin-guide向け）
  const searchTerms = ['保険見直し', 'ほけんの窓口', 'みんなの介護', '小さなお葬式', 'いい葬儀', 'LIFULL介護', '保険相談', '生命保険']

  const results = []

  for (const term of searchTerms) {
    console.log(`\n🔍 「${term}」を検索中...`)
    try {
      await page.goto(`https://pub.a8.net/a8v2/media/linkAction.do?searchWord=${encodeURIComponent(term)}`, {
        waitUntil: 'networkidle', timeout: 30000
      })
      await page.waitForTimeout(2000)

      // プログラム一覧のリンクを取得
      const programs = await page.evaluate(() => {
        const rows = document.querySelectorAll('table tr')
        const found = []
        rows.forEach(row => {
          const link = row.querySelector('a[href*="insId="]')
          if (link) {
            const href = link.getAttribute('href')
            const insIdMatch = href.match(/insId=(s\d+)/)
            if (insIdMatch) {
              found.push({
                name: link.textContent.trim(),
                insId: insIdMatch[1],
                href,
              })
            }
          }
        })
        return found
      })

      if (programs.length > 0) {
        console.log(`  見つかりました: ${programs.length}件`)
        programs.forEach(p => console.log(`    - ${p.name}: ${p.insId}`))
        results.push(...programs)
      } else {
        console.log('  該当なし')
      }
    } catch (e) {
      console.error(`  エラー: ${e.message}`)
    }
  }

  // 提携済みプログラムのページを直接確認
  console.log('\n\n📋 提携済みプログラム全件確認...')
  await page.goto('https://pub.a8.net/a8v2/media/linkAction.do?pageNo=1&pageSize=50', {
    waitUntil: 'networkidle', timeout: 60000
  })
  await page.waitForTimeout(3000)

  const allPrograms = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*="insId="]')
    const found = []
    links.forEach(link => {
      const href = link.getAttribute('href')
      const insIdMatch = href.match(/insId=(s\d+)/)
      if (insIdMatch) {
        found.push({
          name: link.textContent.trim(),
          insId: insIdMatch[1],
        })
      }
    })
    return [...new Map(found.map(item => [item.insId, item])).values()]
  })

  console.log(`\n✅ 提携済み全プログラム: ${allPrograms.length}件`)
  allPrograms.forEach(p => console.log(`  - ${p.name}: ${p.insId}`))

  // スクリーンショット保存
  await page.screenshot({ path: join(__dirname, '../a8-programs.png'), fullPage: true })
  console.log('\n📸 スクリーンショット保存: scripts/../a8-programs.png')

  // 結果をJSONで保存
  const allResults = [...new Map([...results, ...allPrograms].map(item => [item.insId, item])).values()]
  writeFileSync(join(__dirname, '../a8-found-programs.json'), JSON.stringify(allResults, null, 2), 'utf-8')
  console.log('💾 結果保存: a8-found-programs.json')

  await browser.close()
}

main().catch(e => { console.error(e); process.exit(1) })
