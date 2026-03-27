import Navbar from "@/components/Navbar"
import Store from "@/components/Store"

export default function StorePage() {
  return (
    <main className="relative min-h-screen">

      {/* NAVBAR */}
      <Navbar />

      {/* GRID BACKGROUND (same as home) */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(99,179,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,179,237,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* PAGE CONTENT */}
      <div className="pt-[70px]">
        <Store />
      </div>

    </main>
  )
}