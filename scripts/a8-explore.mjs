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

  await page.goto('https://pub.a8.net/a8v2/asLoginAction.do', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.fill('input[name="login"]', LOGIN_ID)
  await page.fill('input[name="passwd"]', PASSWORD)
  await page.click('input[type="submit"]')
  await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  console.log('✅ ログイン成功:', page.url())

  // ホームのスクリーンショット
  await page.screenshot({ path: join(__dirname, '../ss-home.png'), fullPage: true })

  // ナビゲーションの全リンクを取得
  const navLinks = await page.evaluate(() => {
    const links = document.querySelectorAll('a')
    return Array.from(links).map(l => ({ text: l.textContent.trim(), href: l.getAttribute('href') }))
      .filter(l => l.href && l.text && l.text.length < 50)
  })
  console.log('\n=== ナビリンク ===')
  navLinks.forEach(l => console.log(`  ${l.text}: ${l.href}`))

  // プログラム検索ページを探す
  console.log('\n=== プログラム検索ページ ===')
  const programLink = navLinks.find(l => l.text.includes('プログラム検索') || l.text.includes('プログラム'))
  if (programLink) {
    console.log('発見:', programLink)
    const url = programLink.href.startsWith('http') ? programLink.href : `https://pub.a8.net${programLink.href}`
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(2000)
    await page.screenshot({ path: join(__dirname, '../ss-program-search.png'), fullPage: true })
    console.log('プログラム検索URL:', page.url())

    // 検索フォームを確認
    const forms = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input, select')
      return Array.from(inputs).map(el => ({
        type: el.tagName,
        name: el.getAttribute('name'),
        id: el.getAttribute('id'),
        placeholder: el.getAttribute('placeholder'),
      }))
    })
    console.log('フォーム要素:', JSON.stringify(forms, null, 2))
  }

  await browser.close()
}

main().catch(e => { console.error(e); process.exit(1) })
