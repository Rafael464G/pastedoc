import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PasteDoc — Turn messy text into clean documents',
  description: 'Paste meeting notes, contracts, or job listings. Get a professionally formatted PDF or DOCX instantly. Powered by AI.',
  icons: [{ url: '/favicon.ico' }],
  openGraph: {
    title: 'PasteDoc',
    description: 'Turn messy text into clean documents in seconds.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  )
}
