import dynamic from 'next/dynamic'
import { NavbarSkeleton } from "@/components/Skeleton"

const NavbarDynamic = dynamic(() => import('@/components/Navbar'), {
  loading: NavbarSkeleton
})
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Features from '@/components/Features'
import TopBuyers from '@/components/TopBuyers'
import BackgroundCanvas from '@/components/BackgroundCanvas'

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <BackgroundCanvas />

      <div className="fixed inset-0 bg-[linear-gradient(rgba(99,179,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,179,237,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"/>

<NavbarDynamic />
      <Hero />
      <Marquee />
      <Features />
      <TopBuyers />
    </main>
  )
}