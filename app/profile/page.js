import Navbar from "@/components/Navbar"
import Profile from "@/components/Profile"

export default function ProfilePage() {
  return (
    <main className="relative min-h-screen">

      <Navbar />

      {/* GRID BG */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="pt-[70px]">
        <Profile />
      </div>

    </main>
  )
}