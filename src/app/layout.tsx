import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "年金・相続・介護の手続きガイド｜わかりやすく解説",
  description: "年金の受け取り方・相続手続き・介護申請など、60代70代の方が直面する手続きをわかりやすく解説します。",
  verification: {
    google: 'NIsSPvdErjBz8aXwL-nIlK7xY2mzJ5ZyoTE0gPzp-nE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2317215173633118"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
