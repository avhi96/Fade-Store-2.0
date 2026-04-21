import dynamic from 'next/dynamic'
import { NavbarSkeleton } from "@/components/Skeleton"
import Contact from "@/components/Contact"

const NavbarDynamic = dynamic(() => import("@/components/Navbar"), {
  loading: NavbarSkeleton
})


export default function ContactPage() {
  return (
    <main className="relative min-h-screen">

      <NavbarDynamic />


      {/* GRID BG */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="pt-[70px]">
        <Contact />
      </div>

    </main>
  )
}