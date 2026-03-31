import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const AFFILIATES_PATH = join(__dirname, '../src/data/affiliates.json')
const LOGIN_ID = process.env.A8_LOGIN_ID
const PASSWORD = process.env.A8_PASSWORD

async function login(page) {
  await page.goto('https://pub.a8.net/a8v2/asLoginAction.do', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.fill('input[name="login"]', LOGIN_ID)
  await page.fill('input[name="passwd"]', PASSWORD)
  await page.click('input[type="submit"]')
  await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  await page.waitForTimeout(3000)

  if (page.url().includes('loginAction')) {
    throw new Error('ログイン失敗')
  }
  console.log('✅ ログイン成功')
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()
  await login(page)

  // メニューからプログラム検索のURLを取得
  console.log('\n=== プログラム検索メニューを探す ===')
  const allLinks = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a')).map(a => ({
      text: a.textContent.trim(),
      href: a.getAttribute('href') || ''
    })).filter(l => l.text && l.href)
  )
  const programSearchLink = allLinks.find(l => l.text.includes('プログラム検索'))
  console.log('プログラム検索リンク:', programSearchLink)

  await page.screenshot({ path: join(__dirname, '../ss-after-login.png'), fullPage: false })

  // プログラム検索ページへ
  if (programSearchLink) {
    const url = programSearchLink.href.startsWith('http')
      ? programSearchLink.href
      : `https://pub.a8.net${programSearchLink.href}`
    console.log('\n検索ページへ移動:', url)
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(2000)
    await page.screenshot({ path: join(__dirname, '../ss-program-list.png'), fullPage: true })
    console.log('現在URL:', page.url())

    // ページ内の全リンクとinsIdを取得
    const insIds = await page.evaluate(() => {
      const results = []
      document.querySelectorAll('a[href]').forEach(a => {
        const m = a.getAttribute('href').match(/insId=(s\d+)/)
        if (m) results.push({ name: a.textContent.trim(), insId: m[1] })
      })
      return [...new Map(results.map(r => [r.insId, r])).values()]
    })
    console.log('\n提携済みinsId一覧:')
    insIds.forEach(p => console.log(`  ${p.name}: ${p.insId}`))

    // nenkin向けプログラムをキーワード検索
    const keywords = ['保険', '介護', '葬儀', '終活', '相続', '年金']
    const allFound = [...insIds]

    for (const kw of keywords) {
      console.log(`\n🔍「${kw}」で検索...`)

      // 検索フォームを探す
      const searchInput = page.locator('input[name="searchWord"], input[type="text"], input[placeholder*="キーワード"]').first()
      const hasSearch = await searchInput.count() > 0

      if (hasSearch) {
        await searchInput.fill(kw)
        await page.keyboard.press('Enter')
        await page.waitForTimeout(2000)
      } else {
        // URLパラメータで検索
        const baseUrl = page.url().split('?')[0]
        await page.goto(`${baseUrl}?searchWord=${encodeURIComponent(kw)}`, { waitUntil: 'networkidle', timeout: 30000 })
        await page.waitForTimeout(2000)
      }

      const found = await page.evaluate(() => {
        const results = []
        document.querySelectorAll('a[href]').forEach(a => {
          const m = a.getAttribute('href').match(/insId=(s\d+)/)
          if (m) results.push({ name: a.textContent.trim(), insId: m[1] })
        })
        return [...new Map(results.map(r => [r.insId, r])).values()]
      })

      if (found.length > 0) {
        console.log(`  ${found.length}件:`, found.map(f => f.name).join(', '))
        allFound.push(...found)
      } else {
        const pageText = await page.evaluate(() => document.body.innerText.slice(0, 200))
        console.log('  0件 / テキスト:', pageText.slice(0, 80))
      }

      await page.screenshot({ path: join(__dirname, `../ss-kw-${kw}.png`) })
    }

    // 重複除去して保存
    const unique = [...new Map(allFound.map(r => [r.insId, r])).values()]
    writeFileSync(join(__dirname, '../a8-insids.json'), JSON.stringify(unique, null, 2), 'utf-8')
    console.log(`\n✅ 合計${unique.length}件のinsIdを保存: a8-insids.json`)

    // affiliates.jsonに該当プログラムがあれば自動更新
    if (unique.length > 0) {
      const affiliates = JSON.parse(readFileSync(AFFILIATES_PATH, 'utf-8'))
      let updated = 0
      for (const aff of affiliates) {
        const match = unique.find(u =>
          u.name.includes(aff.name) || aff.name.includes(u.name) ||
          u.name.includes(aff.program_name_keyword) || aff.program_name_keyword.includes(u.name)
        )
        if (match && !aff.a8_ins_id) {
          aff.a8_ins_id = match.insId
          console.log(`  ✅ ${aff.name} → ${match.insId}`)
          updated++
        }
      }
      if (updated > 0) {
        writeFileSync(AFFILIATES_PATH, JSON.stringify(affiliates, null, 2), 'utf-8')
        console.log(`\n✅ affiliates.json を${updated}件更新`)
      }
    }
  }

  await browser.close()
}

main().catch(e => { console.error(e); process.exit(1) })
