import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'noushal',
  description: 'Full Stack Developer',
  icons: {
    icon: '/favicon.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <script dangerouslySetInnerHTML={{ __html: `
          document.addEventListener('contextmenu', e => e.preventDefault());
          document.addEventListener('keydown', e => {
            if (
              e.key === 'F12' ||
              (e.ctrlKey && e.shiftKey && ['I','J','C','K'].includes(e.key.toUpperCase())) ||
              (e.ctrlKey && e.key.toUpperCase() === 'U')
            ) e.preventDefault();
          });
        `}} />
      </body>
    </html>
  )
}
