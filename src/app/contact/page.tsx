import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'お問い合わせ｜年金・相続・介護の手続きガイド',
  description: '年金・相続・介護の手続きガイドへのお問い合わせページです。',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      <header style={{ background: '#1a3a6b' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" style={{ color: '#a8c4e8', fontSize: 14, textDecoration: 'none' }}>ホーム</Link>
          <span style={{ color: '#a8c4e8' }}>›</span>
          <span style={{ color: 'white', fontSize: 14 }}>お問い合わせ</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', marginBottom: 24 }}>お問い合わせ</h1>

        <div style={{ background: 'white', borderRadius: 16, padding: '28px', border: '1px solid #ddd', marginBottom: 24 }}>
          <p style={{ color: '#444', fontSize: 16, lineHeight: 1.85, marginBottom: 20 }}>
            当サイトへのお問い合わせは、以下のメールアドレスまでご連絡ください。
            内容を確認のうえ、3営業日以内にご返信いたします。
          </p>

          <div style={{ background: '#eff4fb', borderRadius: 12, padding: '16px 20px', display: 'inline-block' }}>
            <p style={{ fontWeight: 700, color: '#1a3a6b', fontSize: 16, margin: 0 }}>
              📧 souro.info.contact@gmail.com
            </p>
          </div>

          <div style={{ marginTop: 28, borderTop: '1px solid #eee', paddingTop: 24 }}>
            <p style={{ fontWeight: 700, color: '#333', fontSize: 16, marginBottom: 12 }}>お問い合わせの種類</p>
            <ul style={{ paddingLeft: 20, color: '#555', fontSize: 15, lineHeight: 2 }}>
              <li>掲載情報の誤りに関するご指摘</li>
              <li>サイトに関するご意見・ご要望</li>
              <li>その他のお問い合わせ</li>
            </ul>
          </div>

          <div style={{ marginTop: 20, background: '#fff8e1', border: '1px solid #f5c518', borderRadius: 10, padding: '14px 18px' }}>
            <p style={{ fontSize: 14, color: '#7a5c00', lineHeight: 1.7, margin: 0 }}>
              ⚠️ 年金・相続・介護に関する個別の手続きのご相談は、年金事務所・市区町村の窓口・専門家（社会保険労務士・弁護士・司法書士）にお問い合わせください。当サイトでは個別相談への対応はしておりません。
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-12 py-8 px-4" style={{ background: '#222' }}>
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/about" style={{ color: '#aaa', fontSize: 14, marginRight: 24, textDecoration: 'none' }}>運営者情報</Link>
          <Link href="/privacy" style={{ color: '#aaa', fontSize: 14, marginRight: 24, textDecoration: 'none' }}>プライバシーポリシー</Link>
          <Link href="/contact" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none' }}>お問い合わせ</Link>
          <p style={{ color: '#777', fontSize: 12, marginTop: 12 }}>© 2026 年金・相続・介護の手続きガイド</p>
        </div>
      </footer>
    </div>
  )
}
