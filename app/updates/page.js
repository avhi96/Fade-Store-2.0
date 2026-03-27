import Navbar from "@/components/Navbar"
import Updates from "@/components/Updates"

export default function UpdatesPage() {
  return (
    <main className="relative min-h-screen">

      <Navbar />

      {/* GRID BG */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="pt-[70px]">
        <Updates />
      </div>

    </main>
  )
}