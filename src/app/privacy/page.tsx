import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー｜年金・相続・介護の手続きガイド',
  description: '年金・相続・介護の手続きガイドのプライバシーポリシーです。',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      <header style={{ background: '#1a3a6b' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" style={{ color: '#a8c4e8', fontSize: 14, textDecoration: 'none' }}>ホーム</Link>
          <span style={{ color: '#a8c4e8' }}>›</span>
          <span style={{ color: 'white', fontSize: 14 }}>プライバシーポリシー</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', marginBottom: 24 }}>プライバシーポリシー</h1>

        <div style={{ background: 'white', borderRadius: 16, padding: '24px 28px', border: '1px solid #ddd', lineHeight: 1.9 }}>

          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a3a6b', marginBottom: 10 }}>広告の配信について</h2>
            <p style={{ color: '#333', fontSize: 16 }}>
              当サイトはGoogle AdSenseを使用しています。Googleはユーザーのウェブサイト閲覧情報に基づいて適切な広告を表示するためにCookieを使用することがあります。
              Cookieを無効にする方法やGoogleアドセンスに関する詳細は
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#1a3a6b' }}>Googleのポリシーと規約</a>
              をご覧ください。
            </p>
          </section>

          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a3a6b', marginBottom: 10 }}>アクセス解析ツールについて</h2>
            <p style={{ color: '#333', fontSize: 16 }}>
              当サイトではGoogleアナリティクスを使用しています。Googleアナリティクスはデータ収集のためにCookieを使用します。このデータは匿名で収集されており、個人を特定するものではありません。
            </p>
          </section>

          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a3a6b', marginBottom: 10 }}>免責事項</h2>
            <p style={{ color: '#333', fontSize: 16 }}>
              当サイトに掲載している情報は、できる限り正確な情報を提供するよう努めておりますが、正確性・安全性を保証するものではありません。
              掲載情報の利用によって生じた損害等の一切の責任を負いかねますので、ご了承ください。
              年金・相続・介護に関する手続きは、各機関の公式情報を必ずご確認ください。
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a3a6b', marginBottom: 10 }}>お問い合わせ</h2>
            <p style={{ color: '#333', fontSize: 16 }}>
              当サイトへのお問い合わせは<Link href="/about" style={{ color: '#1a3a6b' }}>運営者情報ページ</Link>よりご連絡ください。
            </p>
          </section>

          <p style={{ color: '#999', fontSize: 13, marginTop: 28 }}>2026年3月 制定</p>
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
