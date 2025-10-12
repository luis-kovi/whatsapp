import './globals.css'
import type { Metadata } from 'next'
import SocketProvider from '@/components/SocketProvider'

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
      <body>
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  )
}
