/**
 * A8.net 完全自動管理スクリプト
 *
 * やること:
 *   1. A8.netにログイン
 *   2. 提携済みプログラムのテキストリンク（a8mat URL）を取得
 *   3. 未提携の優良プログラムを探して自動申請
 *   4. affiliates.json を更新
 *   5. simulator ページのリンクを更新
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
  console.error('❌ .env.local に A8_LOGIN_ID と A8_PASSWORD を設定してください')
  process.exit(1)
}

// ターゲットプログラム（カテゴリ別キーワード）
const SEARCH_TARGETS = [
  { keyword: '保険相談',  category: 'insurance', minReward: 5000 },
  { keyword: '保険見直し', category: 'insurance', minReward: 5000 },
  { keyword: '老人ホーム', category: 'kaigo',     minReward: 1000 },
  { keyword: '介護',      category: 'kaigo',     minReward: 1000 },
  { keyword: 'お葬式',    category: 'funeral',   minReward: 2000 },
  { keyword: '葬儀',      category: 'funeral',   minReward: 2000 },
  { keyword: '相続',      category: 'souzoku',   minReward: 3000 },
]

// simulatorページで使う保険系プログラムのカテゴリ
const SIMULATOR_CATEGORY = 'insurance'

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

// 提携済みプログラムのテキストリンク（a8mat URL）を取得
async function getTextLink(page, insId) {
  try {
    await page.goto(
      `https://pub.a8.net/a8v2/media/linkAction.do?insId=${insId}`,
      { waitUntil: 'networkidle', timeout: 60000 }
    )
    await page.waitForTimeout(3000)

    // テキストリンクのtextareaを探す
    const textareas = await page.locator('textarea').all()
    for (const ta of textareas) {
      const val = await ta.inputValue().catch(() => '')
      // a8mat= を含むURLを探す（テキストリンク）
      const match = val.match(/https:\/\/px\.a8\.net\/svt\/ejp\?a8mat=[^\s"'<]+/)
      if (match) return match[0]
    }

    // textareaにない場合、ページ内のリンクを探す
    const links = await page.locator('a[href*="px.a8.net"]').all()
    for (const link of links) {
      const href = await link.getAttribute('href').catch(() => '')
      if (href && href.includes('a8mat=')) return href
    }

    return null
  } catch (e) {
    console.warn(`  ⚠️ テキストリンク取得失敗: ${e.message}`)
    return null
  }
}

// プログラム申請状況を確認
async function checkProgramStatus(page, insId) {
  try {
    await page.goto(
      `https://pub.a8.net/a8v2/media/linkAction.do?insId=${insId}`,
      { waitUntil: 'networkidle', timeout: 60000 }
    )
    await page.waitForTimeout(2000)
    const url = page.url()
    const content = await page.content()

    if (content.includes('提携中') || content.includes('a8mat=') || content.includes('linkAction')) {
      return 'approved'
    } else if (content.includes('審査中') || content.includes('申請中')) {
      return 'pending'
    } else if (content.includes('提携申請') || url.includes('programDetail')) {
      return 'not_applied'
    }
    return 'unknown'
  } catch {
    return 'error'
  }
}

// キーワードでプログラムを検索して優良プログラムを探す
async function searchPrograms(page, keyword, minReward) {
  try {
    const searchUrl = `https://pub.a8.net/a8v2/media/searchAction/keyword.do?keyword=${encodeURIComponent(keyword)}&s_sortKey=epc&s_orderBy=DESC`
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(3000)

    const programs = await page.evaluate((minReward) => {
      const results = []
      // プログラム一覧の各エントリを取得
      const items = document.querySelectorAll('.program-item, .search-result-item, [class*="program"]')

      items.forEach(item => {
        const nameEl = item.querySelector('a[href*="programDetail"], .program-name a, h3 a, h4 a')
        const rewardText = item.textContent || ''
        const insIdMatch = item.innerHTML.match(/insId=([s\d]+)/) || item.innerHTML.match(/ECID:([s\d]+)/)
        const epcMatch = rewardText.match(/EPC[^\d]*([\d.]+)/)
        const rewardMatch = rewardText.match(/(\d{1,6})円/)

        if (nameEl && insIdMatch) {
          const reward = rewardMatch ? parseInt(rewardMatch[1]) : 0
          const epc = epcMatch ? parseFloat(epcMatch[1]) : 0
          if (reward >= minReward || epc > 0) {
            results.push({
              name: nameEl.textContent.trim(),
              insId: insIdMatch[1],
              reward,
              epc,
              href: nameEl.getAttribute('href'),
            })
          }
        }
      })
      return results
    }, minReward)

    return programs
  } catch (e) {
    console.warn(`  ⚠️ 検索エラー (${keyword}): ${e.message}`)
    return []
  }
}

// プログラムに申請する
async function applyProgram(page, insId, name) {
  try {
    await page.goto(
      `https://pub.a8.net/a8v2/media/programDetailAction.do?insId=${insId}`,
      { waitUntil: 'networkidle', timeout: 60000 }
    )
    await page.waitForTimeout(2000)

    // 申請ボタンを探す
    const applyBtn = page.locator('input[value*="申請"], button:has-text("申請"), a:has-text("提携申請")').first()
    if (await applyBtn.isVisible().catch(() => false)) {
      await applyBtn.click()
      await page.waitForTimeout(2000)
      console.log(`  📨 申請完了: ${name}`)
      return true
    } else {
      const content = await page.content()
      if (content.includes('提携中')) {
        console.log(`  ✅ 既に提携中: ${name}`)
        return false
      }
      console.log(`  ⚠️ 申請ボタンが見つからない: ${name}`)
      return false
    }
  } catch (e) {
    console.warn(`  ❌ 申請エラー (${name}): ${e.message}`)
    return false
  }
}

// affiliates.jsonを更新
function updateAffiliates(updates) {
  const path = join(ROOT, 'src/data/affiliates.json')
  const affiliates = JSON.parse(readFileSync(path, 'utf-8'))

  let changed = false
  for (const [id, data] of Object.entries(updates)) {
    const target = affiliates.find(a => a.id === id)
    if (target) {
      Object.assign(target, data)
      changed = true
    }
  }

  if (changed) {
    writeFileSync(path, JSON.stringify(affiliates, null, 2) + '\n')
    console.log('✅ affiliates.json を更新しました')
  }
  return changed
}

// simulatorページのアフィリエイトリンクを更新
function updateSimulatorLink(url, name) {
  const path = join(ROOT, 'src/app/simulator/page.tsx')
  let content = readFileSync(path, 'utf-8')

  const ctaBlock = `              <a
                href="${url}"
                target="_blank"
                rel="nofollow noopener noreferrer"
                style={{ display: 'block', background: '#1a3a6b', color: 'white', fontWeight: 700, fontSize: 16, padding: '14px', borderRadius: 10, textDecoration: 'none', textAlign: 'center' }}
              >
                保険の無料相談を予約する（${name}）→
              </a>`

  // プレースホルダーを置き換え
  if (content.includes('※ 保険の無料相談サービスは近日公開予定です')) {
    content = content.replace(
      `              <p style={{ fontSize: 14, color: '#888', textAlign: 'center', margin: 0 }}>
                ※ 保険の無料相談サービスは近日公開予定です
              </p>`,
      ctaBlock
    )
    writeFileSync(path, content)
    console.log(`✅ simulator ページのリンクを更新 (${name})`)
    return true
  } else if (content.includes('px.a8.net')) {
    // 既存のa8リンクを更新
    content = content.replace(
      /href="https:\/\/px\.a8\.net\/svt\/ejp\?a8mat=[^"]*"/,
      `href="${url}"`
    )
    content = content.replace(
      /保険の無料相談を予約する（[^）]+）/,
      `保険の無料相談を予約する（${name}）`
    )
    writeFileSync(path, content)
    console.log(`✅ simulator ページのリンクを更新 (${name})`)
    return true
  }
  return false
}

// git commit & push
function gitPush(message) {
  try {
    execSync('git add src/data/affiliates.json src/app/simulator/page.tsx', { cwd: ROOT })
    execSync(`git commit -m "${message}"`, { cwd: ROOT })
    execSync('git push origin main', { cwd: ROOT })
    console.log('✅ Git push 完了')
  } catch (e) {
    console.warn('⚠️ git push エラー（変更なしの可能性）:', e.message.split('\n')[0])
  }
}

async function main() {
  console.log('='.repeat(50))
  console.log('🤖 A8.net 自動管理スクリプト開始')
  console.log('='.repeat(50))

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  try {
    await login(page)

    const affiliates = JSON.parse(readFileSync(join(ROOT, 'src/data/affiliates.json'), 'utf-8'))
    const updates = {}
    let simulatorUpdated = false

    // ── STEP 1: 既存提携プログラムのリンク取得 ──
    console.log('\n📋 STEP 1: 提携済みプログラムのリンク確認')
    for (const aff of affiliates) {
      if (!aff.a8_ins_id) continue

      console.log(`\n🔍 ${aff.name} (${aff.a8_ins_id})`)
      const status = await checkProgramStatus(page, aff.a8_ins_id)
      console.log(`  ステータス: ${status}`)

      if (status === 'approved') {
        const link = await getTextLink(page, aff.a8_ins_id)
        if (link) {
          console.log(`  ✅ テキストリンク取得: ${link.substring(0, 60)}...`)
          updates[aff.id] = { ...aff, fallback_url: link }

          // 保険系プログラムはsimulatorにも反映
          if (aff.id === 'hoken-minaoshi' || aff.id === 'money-doctor') {
            if (!simulatorUpdated) {
              simulatorUpdated = updateSimulatorLink(link, aff.name)
            }
          }
        } else {
          console.log('  ⚠️ テキストリンク未取得')
        }
      }
    }

    // ── STEP 2: 新規優良プログラムを探して申請 ──
    console.log('\n\n🔎 STEP 2: 新規優良プログラム探索')
    const applied = new Set(affiliates.map(a => a.a8_ins_id).filter(Boolean))
    const newApplications = []

    for (const target of SEARCH_TARGETS) {
      console.log(`\n  検索: "${target.keyword}" (最低報酬: ${target.minReward}円)`)
      const programs = await searchPrograms(page, target.keyword, target.minReward)

      for (const prog of programs.slice(0, 3)) { // 上位3件のみ
        if (applied.has(prog.insId)) {
          console.log(`  ⏭️  ${prog.name}: 申請済み`)
          continue
        }
        console.log(`  📌 新規発見: ${prog.name} | 報酬:${prog.reward}円 | EPC:${prog.epc}`)
        const success = await applyProgram(page, prog.insId, prog.name)
        if (success) {
          newApplications.push({ ...prog, category: target.category })
          applied.add(prog.insId)
        }
      }
    }

    if (newApplications.length > 0) {
      console.log(`\n📨 新規申請: ${newApplications.length}件`)
      newApplications.forEach(p => console.log(`  - ${p.name} (${p.insId})`))
    }

    // ── STEP 3: 更新をファイルに反映してpush ──
    console.log('\n\n💾 STEP 3: ファイル更新 & Git push')
    const affiliatesChanged = updateAffiliates(updates)

    if (affiliatesChanged || simulatorUpdated) {
      gitPush('auto: update affiliate links via A8.net automation')
    } else {
      console.log('ℹ️  更新なし（提携承認待ちのプログラムあり）')
    }

  } finally {
    await browser.close()
  }

  console.log('\n' + '='.repeat(50))
  console.log('✅ 自動管理スクリプト完了')
  console.log('='.repeat(50))
}

main().catch(e => { console.error('❌ エラー:', e.message); process.exit(1) })
