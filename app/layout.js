import './globals.css'
import { Orbitron, Rajdhani, Inter } from 'next/font/google'
import BackgroundCanvas from '@/components/BackgroundCanvas'

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-display' })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['300','400','600','700'], variable: '--font-body' })
const inter = Inter({ subsets: ['latin'], variable: '--font-ui' })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${rajdhani.variable} ${inter.variable}`}>
        <BackgroundCanvas />
        {children}
      </body>
    </html>
  )
}