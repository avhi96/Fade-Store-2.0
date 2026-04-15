import './globals.css'
import { Orbitron, Rajdhani, Inter } from 'next/font/google'
import BackgroundCanvas from '@/components/BackgroundCanvas'
import Providers from './providers'
import UserSync from '@/components/UserSync'
import LayoutWrapper from '@/components/LayoutWrapper'

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-display' })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['300','400','600','700'], variable: '--font-body' })
const inter = Inter({ subsets: ['latin'], variable: '--font-ui' })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <title>Fade Store</title>
        <link rel="icon" href="/FadeIcon.png" sizes="any" />
        <meta name="keywords" content="Fade Web Store, Minecraft Ranks, Minecraft Keys, Premium Minecraft Products, Fade Store India" />
        <meta name="description" content="Fade Web Store - Premium Minecraft Ranks, Keys, and more!" />
      </head>
      <body suppressHydrationWarning className={`${orbitron.variable} ${rajdhani.variable} ${inter.variable}`}>
        <BackgroundCanvas />
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <UserSync />
        </Providers>
      </body>
    </html>
  )
}
