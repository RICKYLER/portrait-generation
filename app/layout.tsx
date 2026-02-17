import type { Metadata } from 'next'
import { Playfair_Display, Lora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });

export const metadata: Metadata = {
  title: 'I Love You Guia - Typographic Portrait',
  description: 'A romantic typographic portrait made entirely from the words "I love you Guia"',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.className} ${lora.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
