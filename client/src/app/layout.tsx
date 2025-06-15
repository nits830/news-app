import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import HeaderBar from '@/components/HeaderBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'News App',
  description: 'Your daily news source',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <HeaderBar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
