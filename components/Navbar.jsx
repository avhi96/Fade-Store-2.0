"use client"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import Link from "next/link"
import { ADMIN_IDS } from '@/lib/admins'

const navItems = [
  { id: "home", label: "Home", href: "/" },
  { id: "store", label: "Store", href: "/store" },
  { id: "updates", label: "Updates", href: "/updates" },
  { id: "partners", label: "Partners", href: "/partners" },
  { id: "contact", label: "Contact", href: "/contact" },
]

import { useState } from "react"
import { useCart } from '@/hooks/useCart'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const pathname = usePathname()
  const activeItem = navItems.find(item => pathname === item.href || pathname.startsWith(item.href + "/"))?.id || "home"

  const { data: session } = useSession()
  const { itemCount } = useCart()

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between h-[70px] px-6 md:px-10 bg-[#030610d9] backdrop-blur-xl border-b border-white/10">

        {/* LOGO */}
        <div
          suppressHydrationWarning
          className="font-[var(--font-display)] font-extrabold text-[1.2rem] md:text-[1.4rem] tracking-[0.15em] cursor-default 
          bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
        >
          FADE<span className="text-yellow-400">.</span>STORE
        </div>

        {/* DESKTOP NAV */}
        <ul className="hidden md:flex items-center gap-[6px]">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link href={item.href}>
                <button
                  className={clsx(
                    "relative px-4 py-2 text-[0.9rem] hover:cursor-pointer font-bold tracking-[0.08em] uppercase rounded-md transition",
                    "font-[var(--font-body)]",
                    activeItem === item.id
                      ? "text-blue-400 bg-blue-400/10"
                      : "text-gray-500 hover:text-blue-400 hover:bg-blue-400/10"
                  )}
                >
                  {item.label}

                  {activeItem === item.id && (
                    <span className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] bg-blue-400 rounded-full shadow-[0_0_8px_#63b3ed]" />
                  )}
                </button>
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT SIDE (DESKTOP) */}
        <div className="hidden md:flex items-center gap-3">
          {!session ? (
            <Link href="/login">
              <button className="px-5 py-2 rounded-lg bg-[#5865F2] text-white shadow-[0_0_20px_rgba(88,101,242,0.3)] hover:bg-[#4752c4] hover:-translate-y-[1px] transition flex items-center gap-2 font-[var(--font-body)] text-[0.85rem] font-bold tracking-[0.06em] uppercase cursor-pointer">
                Login
              </button>
            </Link>
          ) : (
            <>
              {session?.user && ADMIN_IDS.includes(session.user.discordId) && (
                <Link href="/admin">
                  <button className="px-5 py-2 rounded-lg text-orange-400 border border-orange-400/30 bg-orange-400/10 hover:bg-orange-400/20 transition font-[var(--font-body)] text-[0.85rem] font-bold tracking-[0.06em] uppercase cursor-pointer">
                     Admin
                  </button>
                </Link>
              )}
              <Link href="/profile">
                <button className="px-5 py-2 rounded-lg text-gray-400 border border-white/10 bg-white/5 hover:text-blue-400 hover:border-blue-400 hover:bg-blue-400/10 transition font-[var(--font-body)] text-[0.85rem] font-bold tracking-[0.06em] uppercase cursor-pointer relative">
                  ⬡ Profile
                </button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden text-white text-xl"
        >
          ☰
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed inset-0 z-[200] bg-[#030610f2] backdrop-blur-xl flex flex-col items-center justify-center gap-6">

          {/* CLOSE */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-red-400"
          >
            ✕
          </button>


          {navItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <button
                onClick={() => {
                  setOpen(false)
                }}
                className={clsx(
                  "text-lg uppercase tracking-[0.1em] font-[var(--font-display)] transition",
                  activeItem === item.id
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-blue-400"
                )}
              >
                {item.label}
              </button>
            </Link>
          ))}

          {/* ACTIONS */}
          <div className="mt-6 flex flex-col gap-4 w-50">

          {!session ? (
              <Link href="/login">
                <button className="w-full py-3 rounded-lg bg-[#5865F2] text-white uppercase font-bold">
                  Login with Discord
                </button>
              </Link>
            ) : (
              <>
                <Link href="/profile">
                  <button className="w-full py-3 font-bold rounded-lg border border-white/10 bg-white/5 text-gray-400 uppercase relative">
                    Profile
                  </button>
                </Link>
                {session?.user && ADMIN_IDS.includes(session.user.discordId) && (
                  <Link href="/admin">
                    <button className="w-full py-3 font-bold rounded-lg border border-orange-400/30 bg-orange-400/10 text-orange-400 uppercase">
                      Admin
                    </button>
                  </Link>
                )}
              </>
            )}

          </div>
        </div>
      )}
    </>
  )
}
