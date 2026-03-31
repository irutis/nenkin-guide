'use client'

import affiliatesData from '@/data/affiliates.json'

type Affiliate = {
  id: string
  name: string
  description: string
  color: string
  a8_ins_id: string
  banner_html: string
  fallback_url: string
}

const affiliates = affiliatesData as Affiliate[]

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; btn: string }> = {
  blue:   { bg: '#eff4fb', border: '#1a3a6b', text: '#1a3a6b', btn: '#1a3a6b' },
  green:  { bg: '#f0f7f2', border: '#1a5c2e', text: '#1a5c2e', btn: '#1a5c2e' },
  orange: { bg: '#fdf5eb', border: '#b85c00', text: '#7a4200', btn: '#b85c00' },
  gray:   { bg: '#f5f5f5', border: '#555',    text: '#333',    btn: '#555'    },
}

export default function AffiliateBanners() {
  const active = affiliates.filter(a => a.banner_html || a.fallback_url)
  if (active.length === 0) return null

  return (
    <div style={{ marginTop: 40 }}>
      <p style={{ fontSize: 13, color: '#999', marginBottom: 12 }}>
        ※ 以下はスポンサーリンクです
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {active.map(a => {
          const c = COLOR_MAP[a.color] ?? COLOR_MAP.gray
          return (
            <div
              key={a.id}
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: 14,
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div>
                <p style={{ fontWeight: 700, fontSize: 16, color: c.text, marginBottom: 4 }}>{a.name}</p>
                <p style={{ fontSize: 14, color: '#555' }}>{a.description}</p>
              </div>
              {a.banner_html ? (
                <div
                  dangerouslySetInnerHTML={{ __html: a.banner_html }}
                  style={{ lineHeight: 0 }}
                />
              ) : a.fallback_url ? (
                <a
                  href={a.fallback_url}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: c.btn,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 15,
                    padding: '12px 24px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    alignSelf: 'flex-start',
                  }}
                >
                  無料で相談する →
                </a>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
