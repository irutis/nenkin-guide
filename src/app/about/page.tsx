import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '運営者情報｜年金・相続・介護の手続きガイド',
  description: '年金・相続・介護の手続きガイドの運営者情報です。',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      <header style={{ background: '#1a3a6b' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" style={{ color: '#a8c4e8', fontSize: 14, textDecoration: 'none' }}>ホーム</Link>
          <span style={{ color: '#a8c4e8' }}>›</span>
          <span style={{ color: 'white', fontSize: 14 }}>運営者情報</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', marginBottom: 24 }}>運営者情報</h1>

        <div style={{ background: 'white', borderRadius: 16, padding: '24px 28px', border: '1px solid #ddd' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'サイト名', value: '年金・相続・介護の手続きガイド' },
                { label: '運営者', value: 'SOURO' },
                { label: '所在地', value: '京都市' },
                { label: '設立', value: '2026年' },
                { label: 'サイトの目的', value: '60代・70代の方が直面する年金・相続・介護の手続きをわかりやすく解説し、不安を解消すること' },
              ].map(row => (
                <tr key={row.label} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '14px 16px 14px 0', fontWeight: 700, color: '#555', fontSize: 15, whiteSpace: 'nowrap', verticalAlign: 'top', width: '30%' }}>
                    {row.label}
                  </td>
                  <td style={{ padding: '14px 0', color: '#333', fontSize: 16, lineHeight: 1.7 }}>
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 28, padding: '20px', background: '#f8f7f4', borderRadius: 12 }}>
            <p style={{ fontWeight: 700, color: '#1a3a6b', marginBottom: 8, fontSize: 16 }}>サイトについて</p>
            <p style={{ color: '#444', fontSize: 15, lineHeight: 1.85 }}>
              このサイトは、難しい制度や手続きをわかりやすく伝えることを使命としています。
              掲載情報は厚生労働省・法務省など公的機関の情報をもとに作成していますが、
              制度は変更になる場合があります。最新情報は各機関の公式サイトをご確認ください。
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-12 py-8 px-4" style={{ background: '#222' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none' }}>← トップへ戻る</Link>
            <Link href="/about" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none' }}>運営者情報</Link>
            <Link href="/privacy" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none' }}>プライバシーポリシー</Link>
            <Link href="/contact" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none' }}>お問い合わせ</Link>
          </div>
          <p style={{ color: '#777', fontSize: 12 }}>© 2026 年金・相続・介護の手続きガイド</p>
        </div>
      </footer>
    </div>
  )
}
