import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "./ThemeProvider"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Noted Po | Note Smarter, not Harder',
  description: 'Note Smarter, not Harder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body className={inter.className} suppressHydrationWarning={true}>
          <ThemeProvider attribute='class'>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
