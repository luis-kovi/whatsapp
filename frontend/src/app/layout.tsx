import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WhatsApp Manager',
  description: 'Sistema de gestão de atendimentos WhatsApp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
