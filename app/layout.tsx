import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'CORDA - Revolutionäre Bestattungssoftware',
  description: 'Die modernste Bestattungssoftware für effiziente Sterbefallverwaltung mit KI-Unterstützung',
  keywords: ['Bestattungssoftware', 'Sterbefallverwaltung', 'KI-Assistent', 'Bestatter', 'Trauerfeier'],
  authors: [{ name: 'CORDA Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'CORDA - Revolutionäre Bestattungssoftware',
    description: 'Die modernste Bestattungssoftware für effiziente Sterbefallverwaltung mit KI-Unterstützung',
    type: 'website',
    locale: 'de_DE',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className="dark">
      <body className={`${inter.variable} ${playfair.variable} antialiased m-0 p-0`}>
        <div className="min-h-screen bg-gradient-to-br from-corda-black via-corda-anthracite to-corda-dark m-0 p-0">
          {children}
        </div>
      </body>
    </html>
  )
} 