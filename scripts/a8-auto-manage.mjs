/**
 * A8.net 完全自動管理スクリプト v2
 *
 * やること:
 *   1. A8.netにログイン
 *   2. 提携済みプログラムリストを取得
 *   3. ターゲットプログラムのテキストリンク（a8mat URL）を取得
 *   4. 未提携の優良プログラムを探して自動申請
 *   5. affiliates.json・simulator/page.tsx を更新
 *   6. git commit & push
 *
 * 実行: node --env-file=.env.local scripts/a8-auto-manage.mjs
 */

import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const A8_LOGIN_ID = process.env.A8_LOGIN_ID
const A8_PASSWORD = process.env.A8_PASSWORD

if (!A8_LOGIN_ID || !A8_PASSWORD) {
  console.error('❌ A8_LOGIN_ID と A8_PASSWORD を設定してください')
  process.exit(1)
}

// 探すプログラムキーワードと最低報酬
const SEARCH_TARGETS = [
  { keyword: '保険見直し本舗', category: 'insurance', minReward: 3000 },
  { keyword: '保険見直しラボ', category: 'insurance', minReward: 3000 },
  { keyword: 'マネードクター',  category: 'insurance', minReward: 3000 },
  { keyword: 'ほけんの窓口',   category: 'insurance', minReward: 3000 },
  { keyword: 'みんなの介護',   category: 'kaigo',     minReward: 1000 },
  { keyword: 'LIFULL介護',    category: 'kaigo',     minReward: 1000 },
  { keyword: 'よりそうお葬式', category: 'funeral',   minReward: 1000 },
  { keyword: '安心葬儀',       category: 'funeral',   minReward: 1000 },
  { keyword: '相続税',         category: 'souzoku',   minReward: 3000 },
]

async function login(page) {
  console.log('🔑 A8.net にログイン中...')
  await page.goto('https://pub.a8.net/a8v2/asLoginAction.do', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.fill('input[name="login"]', A8_LOGIN_ID)
  await page.fill('input[name="passwd"]', A8_PASSWORD)
  await page.click('input[type="submit"]')
  await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})

  if (page.url().includes('loginAction')) {
    throw new Error('ログイン失敗 - IDまたはパスワードを確認してください')
  }
  console.log('✅ ログイン成功')
}

// 提携済みプログラムを全件取得（linkListAction）
async function getLinkedPrograms(page) {
  console.log('\n📋 提携済みプログラム一覧を取得中...')
  await page.goto(
    'https://pub.a8.net/a8v2/media/linkListAction.do?pageNo=1&pageSize=100',
    { waitUntil: 'networkidle', timeout: 60000 }
  )
  await page.waitForTimeout(3000)

  const programs = await page.evaluate(() => {
    const results = []
    const links = document.querySelectorAll('a[href*="insId="]')
    links.forEach(link => {
      const href = link.getAttribute('href') || ''
      const insIdMatch = href.match(/insId=(s\d+)/)
      if (insIdMatch) {
        const name = link.textContent.trim()
        if (name) {
          results.push({ name, insId: insIdMatch[1], href })
        }
      }
    })
    return [...new Map(results.map(r => [r.insId, r])).values()]
  })

  console.log(`  提携済み: ${programs.length}件`)
  programs.forEach(p => console.log(`    ✅ ${p.name} (${p.insId})`))
  return programs
}

// テキストリンク（a8mat URL）を取得
async function getTextLink(page, insId, name) {
  try {
    await page.goto(
      `https://pub.a8.net/a8v2/media/linkAction.do?insId=${insId}`,
      { waitUntil: 'networkidle', timeout: 60000 }
    )
    await page.waitForTimeout(3000)

    // textareaからa8mat URLを取得
    const textareas = await page.locator('textarea').all()
    for (const ta of textareas) {
      const val = await ta.inputValue().catch(() => '')
      const match = val.match(/https:\/\/px\.a8\.net\/svt\/ejp\?a8mat=[^\s"'<&]+/)
      if (match) {
        console.log(`    🔗 テキストリンク取得: ${match[0].substring(0, 70)}...`)
        return match[0]
      }
    }

    // ページ内テキストからも探す
    const bodyText = await page.evaluate(() => document.body.innerHTML)
    const match = bodyText.match(/https:\/\/px\.a8\.net\/svt\/ejp\?a8mat=[^\s"'<&]+/)
    if (match) {
      console.log(`    🔗 テキストリンク取得（本文より）: ${match[0].substring(0, 70)}...`)
      return match[0]
    }

    console.log(`    ⚠️ ${name}: テキストリンクが見つかりません`)
    return null
  } catch (e) {
    console.warn(`    ❌ ${name} リンク取得エラー: ${e.message}`)
    return null
  }
}

// キーワード検索でプログラムを探す（フォーム送信方式）
async function searchProgram(page, keyword) {
  try {
    // まず検索ページを開く
    await page.goto(
      'https://pub.a8.net/a8v2/media/searchAction/keyword.do',
      { waitUntil: 'networkidle', timeout: 60000 }
    )
    await page.waitForTimeout(1500)

    // キーワード入力フィールドを探して入力
    const keywordInput = page.locator('input[name="keyword"], input[type="text"][name*="word"], input[placeholder*="キーワード"], input[placeholder*="検索"]').first()
    if (await keywordInput.isVisible().catch(() => false)) {
      await keywordInput.fill(keyword)
      // フォーム送信
      await keywordInput.press('Enter')
    } else {
      // フォームのinputを全て試す
      const inputs = await page.locator('input[type="text"], input[type="search"]').all()
      let filled = false
      for (const input of inputs) {
        if (await input.isVisible().catch(() => false)) {
          await input.fill(keyword)
          await input.press('Enter')
          filled = true
          break
        }
      }
      if (!filled) {
        // submitボタンがある場合
        const submitBtn = page.locator('input[type="submit"], button[type="submit"], button:has-text("検索")').first()
        if (await submitBtn.isVisible().catch(() => false)) {
          await submitBtn.click()
        }
      }
    }

    await page.waitForTimeout(3000)

    const programs = await page.evaluate(() => {
      const results = []

      // A8検索結果は id="pg-sXXXXX" という div に格納されている
      document.querySelectorAll('[id^="pg-s"]').forEach(el => {
        const insId = el.id.replace('pg-', '')
        if (!/^s\d+$/.test(insId)) return

        // プログラム名を取得（pgList内の最初のリンクテキスト or h3/h4）
        const nameEl = el.querySelector('h2, h3, h4, .pgName, .programName, a[href*="programDetail"], a[href*="insId"]')
        const name = nameEl ? nameEl.textContent.trim() : insId

        results.push({ name: name || insId, insId })
      })

      return results
    })

    const resultCount = await page.evaluate(() => {
      const t = document.body.innerText
      const m = t.match(/該当件数[：:]\s*(\d+)/)
      return m ? parseInt(m[1]) : null
    })

    if (resultCount !== null) {
      console.log(`    該当件数: ${resultCount}件, insId取得: ${programs.length}件`)
      if (resultCount > 0 && programs.length === 0) {
        // 結果はあるがinsId取れない場合、HTMLを一部ダンプ
        const htmlSnippet = await page.evaluate(() => {
          const body = document.body.innerHTML
          // insId関連のHTML断片を探す
          const idx = body.indexOf('s00000')
          if (idx >= 0) return body.slice(Math.max(0, idx-100), idx+200)
          return body.slice(0, 500)
        })
        console.log(`    HTMLデバッグ: ${htmlSnippet.replace(/\s+/g, ' ').slice(0, 300)}`)
      }
    } else if (programs.length === 0) {
      const snippet = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 150))
      console.log(`    結果なし | ページ: ${snippet}`)
    }

    return programs
  } catch (e) {
    console.warn(`  ⚠️ 検索エラー (${keyword}): ${e.message}`)
    return []
  }
}

// プログラム詳細ページから申請
async function applyProgram(page, insId, name) {
  try {
    await page.goto(
      `https://pub.a8.net/a8v2/media/programDetailAction.do?insId=${insId}`,
      { waitUntil: 'networkidle', timeout: 60000 }
    )
    await page.waitForTimeout(2000)

    const content = await page.content()

    // 既に提携中
    if (content.includes('提携中') || content.includes('linkAction')) {
      console.log(`    ✅ 既に提携中: ${name}`)
      return 'already_linked'
    }

    // 審査中
    if (content.includes('審査中') || content.includes('申請中')) {
      console.log(`    ⏳ 審査中: ${name}`)
      return 'pending'
    }

    // 申請ボタンを探す
    const applySelectors = [
      'input[value*="申請"]',
      'input[value*="提携"]',
      'button:has-text("申請")',
      'a:has-text("提携申請")',
      'a:has-text("参加申請")',
    ]

    for (const sel of applySelectors) {
      const btn = page.locator(sel).first()
      if (await btn.isVisible().catch(() => false)) {
        await btn.click()
        await page.waitForTimeout(3000)
        console.log(`    📨 申請完了: ${name}`)
        return 'applied'
      }
    }

    console.log(`    ⚠️ 申請ボタン未発見: ${name}`)
    return 'no_button'
  } catch (e) {
    console.warn(`    ❌ 申請エラー (${name}): ${e.message}`)
    return 'error'
  }
}

// affiliates.json を更新
function updateAffiliatesJson(id, textLink) {
  const filePath = join(ROOT, 'src/data/affiliates.json')
  const affiliates = JSON.parse(readFileSync(filePath, 'utf-8'))
  const target = affiliates.find(a => a.id === id)
  if (!target) return false

  if (target.fallback_url === textLink) return false // 変更なし

  target.fallback_url = textLink
  writeFileSync(filePath, JSON.stringify(affiliates, null, 2) + '\n')
  console.log(`  ✅ affiliates.json 更新: ${target.name}`)
  return true
}

// simulator/page.tsx のアフィリエイトリンクを更新
function updateSimulatorPage(url, name) {
  const filePath = join(ROOT, 'src/app/simulator/page.tsx')
  let content = readFileSync(filePath, 'utf-8')

  const newLink = `              <a
                href="${url}"
                target="_blank"
                rel="nofollow noopener noreferrer"
                style={{ display: 'block', background: '#1a3a6b', color: 'white', fontWeight: 700, fontSize: 16, padding: '14px', borderRadius: 10, textDecoration: 'none', textAlign: 'center' }}
              >
                保険の無料相談を予約する（${name}）→
              </a>`

  if (content.includes('近日公開予定')) {
    content = content.replace(
      /              <p style=\{\{ fontSize: 14, color: '#888', textAlign: 'center', margin: 0 \}\}>\n                ※ 保険の無料相談サービスは近日公開予定です\n              <\/p>/,
      newLink
    )
    writeFileSync(filePath, content)
    console.log(`  ✅ simulator ページ更新: ${name}`)
    return true
  }

  // 既存リンクを更新
  if (content.includes('px.a8.net')) {
    const updated = content
      .replace(/href="https:\/\/px\.a8\.net\/svt\/ejp\?a8mat=[^"]*"/, `href="${url}"`)
      .replace(/保険の無料相談を予約する（[^）]+）/, `保険の無料相談を予約する（${name}）`)
    if (updated !== content) {
      writeFileSync(filePath, updated)
      console.log(`  ✅ simulator ページ更新（リンク差替）: ${name}`)
      return true
    }
  }

  return false
}

// git commit & push
function gitPush(message) {
  try {
    execSync('git add src/data/affiliates.json src/app/simulator/page.tsx', { cwd: ROOT, stdio: 'pipe' })
    const diff = execSync('git diff --staged --stat', { cwd: ROOT }).toString().trim()
    if (!diff) {
      console.log('  ℹ️  git: 変更なし')
      return
    }
    execSync(`git commit -m "${message}"`, { cwd: ROOT, stdio: 'pipe' })
    execSync('git pull --rebase origin main', { cwd: ROOT, stdio: 'pipe' })
    execSync('git push origin main', { cwd: ROOT, stdio: 'pipe' })
    console.log('  ✅ git push 完了')
  } catch (e) {
    console.warn('  ⚠️ git エラー:', e.message.split('\n')[0])
  }
}

async function main() {
  console.log('='.repeat(55))
  console.log('🤖 A8.net 自動管理スクリプト v2 開始')
  console.log('='.repeat(55))

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  try {
    await login(page)

    // ── STEP 1: 提携済みプログラム一覧を取得 ──
    const linkedPrograms = await getLinkedPrograms(page)
    const linkedInsIds = new Set(linkedPrograms.map(p => p.insId))

    const affiliates = JSON.parse(readFileSync(join(ROOT, 'src/data/affiliates.json'), 'utf-8'))
    let anyChanged = false

    // ── STEP 2: 各ターゲットのリンクを取得 ──
    console.log('\n🔗 STEP 2: テキストリンク取得')
    for (const aff of affiliates) {
      if (!aff.a8_ins_id) continue

      if (linkedInsIds.has(aff.a8_ins_id)) {
        console.log(`\n  ${aff.name} → 提携済み`)
        const link = await getTextLink(page, aff.a8_ins_id, aff.name)
        if (link) {
          const changed = updateAffiliatesJson(aff.id, link)
          if (changed) anyChanged = true

          // 保険系プログラムはsimulatorページにも反映
          if (aff.id === 'hoken-minaoshi' || aff.id === 'money-doctor') {
            const simChanged = updateSimulatorPage(link, aff.name)
            if (simChanged) anyChanged = true
          }
        }
      } else {
        console.log(`\n  ${aff.name} → 未提携（審査中または申請待ち）`)
      }
    }

    // ── STEP 3: 新規プログラム探索・申請 ──
    console.log('\n\n🔎 STEP 3: 新規優良プログラム探索・申請')
    const knownInsIds = new Set([
      ...linkedInsIds,
      ...affiliates.map(a => a.a8_ins_id).filter(Boolean),
    ])

    for (const target of SEARCH_TARGETS) {
      console.log(`\n  検索: "${target.keyword}"`)
      const found = await searchProgram(page, target.keyword)

      if (found.length === 0) {
        console.log(`    該当なし`)
        continue
      }

      for (const prog of found.slice(0, 5)) {
        if (knownInsIds.has(prog.insId)) {
          console.log(`    ⏭️  ${prog.name} (${prog.insId}): 申請済み`)
          continue
        }
        console.log(`    📌 新規: ${prog.name} (${prog.insId})`)
        const result = await applyProgram(page, prog.insId, prog.name)
        if (result === 'applied') {
          knownInsIds.add(prog.insId)
        }
      }
    }

    // ── STEP 4: Git push ──
    console.log('\n\n💾 STEP 4: Git push')
    gitPush(`auto: A8アフィリエイトリンク更新 ${new Date().toISOString().slice(0, 10)}`)

  } finally {
    await browser.close()
  }

  console.log('\n' + '='.repeat(55))
  console.log('✅ 完了')
  console.log('='.repeat(55))
}

main().catch(e => { console.error('❌ エラー:', e.message); process.exit(1) })
