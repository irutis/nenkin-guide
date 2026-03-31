'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SimulatorPage() {
  const [age, setAge] = useState('')
  const [workYears, setWorkYears] = useState('')
  const [salary, setSalary] = useState('')
  const [result, setResult] = useState<null | { kiso: number; kosei: number; total: number }>(null)

  function calculate() {
    const y = parseInt(workYears) || 0
    const s = parseInt(salary) || 0

    // 老齢基礎年金：満額816,000円（2026年）× 加入月数/480
    const months = Math.min(y * 12, 480)
    const kiso = Math.round((816000 * months) / 480)

    // 老齢厚生年金：平均標準報酬額 × 5.481/1000 × 加入月数
    const kosei = Math.round((s * 1000 * 5.481) / 1000 * Math.min(y * 12, 480) / 12)

    setResult({ kiso, kosei, total: kiso + kosei })
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      <header style={{ background: '#1a3a6b' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" style={{ color: '#a8c4e8', fontSize: 14, textDecoration: 'none' }}>ホーム</Link>
          <span style={{ color: '#a8c4e8' }}>›</span>
          <Link href="/nenkin" style={{ color: '#a8c4e8', fontSize: 14, textDecoration: 'none' }}>年金</Link>
          <span style={{ color: '#a8c4e8' }}>›</span>
          <span style={{ color: 'white', fontSize: 14 }}>年金シミュレーター</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div style={{ borderLeft: '4px solid #1a3a6b', paddingLeft: 14, marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a' }}>💴 年金受取額シミュレーター</h1>
          <p style={{ color: '#555', fontSize: 15, marginTop: 6 }}>3つの情報を入力するだけで、あなたの年金受取額の目安がわかります</p>
        </div>

        {/* 入力フォーム */}
        <div style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid #ddd', marginBottom: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: 16, color: '#1a1a1a', marginBottom: 8 }}>
              ① 現在の年齢
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="例：60"
                min="20" max="75"
                style={{ fontSize: 18, padding: '10px 14px', border: '2px solid #ddd', borderRadius: 10, width: 120, outline: 'none' }}
              />
              <span style={{ fontSize: 16, color: '#555' }}>歳</span>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: 16, color: '#1a1a1a', marginBottom: 8 }}>
              ② 年金加入年数（働いた年数）
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number"
                value={workYears}
                onChange={e => setWorkYears(e.target.value)}
                placeholder="例：35"
                min="1" max="40"
                style={{ fontSize: 18, padding: '10px 14px', border: '2px solid #ddd', borderRadius: 10, width: 120, outline: 'none' }}
              />
              <span style={{ fontSize: 16, color: '#555' }}>年</span>
            </div>
            <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>会社員・公務員として働いた年数（自営業・専業主婦の期間は除く）</p>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: 16, color: '#1a1a1a', marginBottom: 8 }}>
              ③ 現役時代の平均年収
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number"
                value={salary}
                onChange={e => setSalary(e.target.value)}
                placeholder="例：400"
                min="100" max="2000"
                style={{ fontSize: 18, padding: '10px 14px', border: '2px solid #ddd', borderRadius: 10, width: 140, outline: 'none' }}
              />
              <span style={{ fontSize: 16, color: '#555' }}>万円</span>
            </div>
            <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>わからない場合は300〜400万円程度で入力してみてください</p>
          </div>

          <button
            onClick={calculate}
            style={{ width: '100%', background: '#1a3a6b', color: 'white', fontWeight: 700, fontSize: 18, padding: '16px', borderRadius: 12, border: 'none', cursor: 'pointer' }}
          >
            計算する →
          </button>
        </div>

        {/* 結果 */}
        {result && (
          <div style={{ background: '#eff4fb', border: '2px solid #1a3a6b', borderRadius: 16, padding: 28, marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a3a6b', marginBottom: 20 }}>📊 あなたの年金受取額（目安）</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <div style={{ background: 'white', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, color: '#555' }}>老齢基礎年金（国民年金）</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#1a3a6b' }}>月 {Math.round(result.kiso / 12).toLocaleString()}円</span>
              </div>
              <div style={{ background: 'white', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, color: '#555' }}>老齢厚生年金（会社員加算）</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#1a3a6b' }}>月 {Math.round(result.kosei / 12).toLocaleString()}円</span>
              </div>
              <div style={{ background: '#1a3a6b', borderRadius: 12, padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16, color: 'white', fontWeight: 700 }}>合計（月額）</span>
                <span style={{ fontSize: 26, fontWeight: 700, color: 'white' }}>月 {Math.round(result.total / 12).toLocaleString()}円</span>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#666', marginBottom: 20, lineHeight: 1.6 }}>
              ※ これはあくまで目安です。実際の受取額はねんきん定期便またはねんきんネットでご確認ください。
            </p>

            {/* アフィリエイトCTA */}
            <div style={{ background: '#fff8e1', border: '1px solid #f5c518', borderRadius: 12, padding: '18px 20px' }}>
              <p style={{ fontWeight: 700, fontSize: 16, color: '#7a5c00', marginBottom: 8 }}>
                💡 老後の生活費が心配な方へ
              </p>
              <p style={{ fontSize: 14, color: '#555', marginBottom: 14, lineHeight: 1.7 }}>
                年金だけでは老後の生活費が不足するケースも。保険の専門家に無料で相談して、今から備えましょう。
              </p>
              <a
                href="https://px.a8.net/svt/ejp?a8mat=4AZR8P+BBTY5U+3SPO+9FL80Y"
                target="_blank"
                rel="nofollow noopener noreferrer"
                style={{ display: 'block', background: '#1a3a6b', color: 'white', fontWeight: 700, fontSize: 16, padding: '14px', borderRadius: 10, textDecoration: 'none', textAlign: 'center' }}
              >
                保険の無料相談を予約する（保険見直し本舗）→
              </a>
            </div>
          </div>
        )}

        <div style={{ background: '#fff8e1', border: '1px solid #f5c518', borderRadius: 12, padding: '16px 20px' }}>
          <p style={{ fontSize: 13, color: '#7a5c00', lineHeight: 1.7, margin: 0 }}>
            ⚠️ 本シミュレーターは概算です。加入月数・標準報酬額の変動により実際の金額は異なります。正確な受取額は<a href="https://www.nenkin.go.jp/n_net/" target="_blank" rel="noopener noreferrer" style={{ color: '#1a3a6b' }}>ねんきんネット</a>でご確認ください。
          </p>
        </div>
      </div>

      <footer className="mt-12 py-8 px-4" style={{ background: '#222' }}>
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/nenkin" style={{ color: '#aaa', fontSize: 14, marginRight: 24, textDecoration: 'none' }}>← 年金の記事一覧へ</Link>
          <Link href="/" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none' }}>トップへ</Link>
          <p style={{ color: '#777', fontSize: 12, marginTop: 12 }}>© 2026 年金・相続・介護の手続きガイド</p>
        </div>
      </footer>
    </div>
  )
}
