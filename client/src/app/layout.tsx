import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NewsApp - Your Trusted News Source',
  description: 'Stay informed with the latest news and updates from around the world.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
