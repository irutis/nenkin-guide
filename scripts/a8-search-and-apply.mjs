/**
 * A8.net プログラム検索・insId取得スクリプト
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOGIN_ID = process.env.A8_LOGIN_ID
const PASSWORD = process.env.A8_PASSWORD

async function main() {
  const browser = await chromium.launch({ headless: true })
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
  console.log('✅ ログイン成功\n')

  // 登録サイト一覧を確認
  console.log('=== 登録サイト確認 ===')
  await page.goto('https://pub.a8.net/a8v2/media/mediaListAction.do', { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(2000)
  await page.screenshot({ path: join(__dirname, '../ss-sites.png'), fullPage: true })

  const sites = await page.evaluate(() => {
    const rows = document.querySelectorAll('table tr')
    const found = []
    rows.forEach(row => {
      const cells = row.querySelectorAll('td')
      if (cells.length >= 2) {
        found.push(Array.from(cells).map(c => c.textContent.trim()).join(' | '))
      }
    })
    return found
  })
  console.log('登録サイト:')
  sites.forEach(s => console.log(' ', s))

  // プログラム検索（nenkin向けキーワード）
  const searchTerms = [
    '保険見直し本舗',
    'ほけんの窓口',
    'みんなの介護',
    '小さなお葬式',
    'いい葬儀',
    'LIFULL介護',
    'マネードクター',
    '終活',
  ]

  const foundPrograms = []

  for (const term of searchTerms) {
    console.log(`\n🔍 「${term}」を検索中...`)
    await page.goto(
      `https://pub.a8.net/a8v2/program/programListAction.do?searchWord=${encodeURIComponent(term)}&genreId=&pageNo=1`,
      { waitUntil: 'networkidle', timeout: 60000 }
    )
    await page.waitForTimeout(2000)

    const programs = await page.evaluate(() => {
      const results = []
      // プログラム名とリンクを取得
      const links = document.querySelectorAll('a')
      links.forEach(link => {
        const href = link.getAttribute('href') || ''
        // insIdパターン
        const insIdMatch = href.match(/[?&]insId=(s\d+)/)
        if (insIdMatch) {
          results.push({
            name: link.textContent.trim(),
            insId: insIdMatch[1],
            href,
          })
        }
      })

      // プログラムリスト行からも取得
      const rows = document.querySelectorAll('table tr')
      rows.forEach(row => {
        const nameCell = row.querySelector('td.programName, td:first-child')
        const linkEl = row.querySelector('a[href*="programDetail"]')
        if (nameCell && linkEl) {
          const href = linkEl.getAttribute('href')
          const insMatch = href?.match(/insId=(s\d+)/)
          if (insMatch) {
            results.push({ name: nameCell.textContent.trim(), insId: insMatch[1], href })
          }
        }
      })
      return [...new Map(results.map(r => [r.insId, r])).values()]
    })

    if (programs.length > 0) {
      console.log(`  ${programs.length}件見つかりました:`)
      programs.forEach(p => console.log(`    ✅ ${p.name}: ${p.insId}`))
      foundPrograms.push(...programs)
    } else {
      // ページのテキストを確認
      const pageText = await page.evaluate(() => document.body.innerText.slice(0, 500))
      console.log('  該当なし / ページ内容:', pageText.slice(0, 100))
    }

    await page.screenshot({ path: join(__dirname, `../ss-search-${term.replace(/\//g, '-')}.png`) })
  }

  // 提携済みプログラム（広告リンク取得ページ）
  console.log('\n\n=== 提携済みプログラム全件 ===')
  await page.goto('https://pub.a8.net/a8v2/media/linkListAction.do?pageNo=1&pageSize=100', { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(3000)
  await page.screenshot({ path: join(__dirname, '../ss-linked.png'), fullPage: true })

  const linkedPrograms = await page.evaluate(() => {
    const results = []
    const links = document.querySelectorAll('a[href*="insId="]')
    links.forEach(link => {
      const href = link.getAttribute('href')
      const insIdMatch = href.match(/insId=(s\d+)/)
      if (insIdMatch) {
        results.push({ name: link.textContent.trim(), insId: insIdMatch[1] })
      }
    })
    return [...new Map(results.map(r => [r.insId, r])).values()]
  })

  console.log(`提携済み: ${linkedPrograms.length}件`)
  linkedPrograms.forEach(p => console.log(`  - ${p.name}: ${p.insId}`))

  const allResults = {
    linked: linkedPrograms,
    found: [...new Map(foundPrograms.map(r => [r.insId, r])).values()],
  }

  writeFileSync(join(__dirname, '../a8-results.json'), JSON.stringify(allResults, null, 2), 'utf-8')
  console.log('\n💾 結果保存: a8-results.json')

  await browser.close()
}

main().catch(e => { console.error(e); process.exit(1) })
