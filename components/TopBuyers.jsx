// "use client"
// import { useEffect, useState } from 'react'
// import { Crown, Medal } from "lucide-react"
// import Link from "next/link"
// import { getTopBuyers } from '@/lib/top-buyers'

// export default function TopBuyers() {
//   const [topBuyers, setTopBuyers] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     getTopBuyers({
//       limit: 3,
//       period: 'all',
//     })
//       .then((buyers) => {
//         setTopBuyers(buyers)
//       })
//       .catch((error) => {
//         console.error('Top buyers load failed:', error)
//         setTopBuyers([])
//       })
//       .finally(() => setLoading(false))
//   }, [])

//   return (
//     <section className="max-w-[900px] mx-auto px-6 pb-20">

//       {/* HEADER */}
//       <div className="text-center mb-12">
//         <div
//           className="text-[0.7rem] tracking-[0.2em] uppercase text-cyan-400 mb-3"
//           style={{ fontFamily: "Inter, sans-serif" }}
//         >
//           Leaderboard
//         </div>

//         <h2
//           style={{
//             fontFamily: "Orbitron, monospace",
//             fontSize: "1.8rem",
//             fontWeight: 700,
//             letterSpacing: "0.04em"
//           }}
//         >
//           Top Supporters
//         </h2>
//       </div>

//       {/* LIST */}
//       <div className="flex flex-col gap-4">
//         {loading ? (
//           <div className="py-8 text-center text-gray-400">Loading top supporters...</div>
//         ) : topBuyers.length === 0 ? (
//           <div className="py-8 text-center text-gray-400">No top supporters this month yet.</div>
//         ) : (
//           topBuyers.map((buyer, i) => (
//             <div
//               key={buyer.userId}
//               className="flex items-center gap-5 px-6 py-4 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition hover:border-cyan-400/30"
//             >

//               {/* RANK ICON */}
//               <div className="min-w-[30px] flex justify-center">
//                 {i === 0 && <Crown className="text-yellow-400 drop-shadow-[0_0_10px_rgba(246,201,14,0.6)]" size={22} />}
//                 {i === 1 && <Medal className="text-gray-300" size={20} />}
//                 {i === 2 && <Medal className="text-orange-400" size={20} />}
//               </div>

//               {/* AVATAR */}
//               <div className="w-[44px] h-[44px] rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
//                 {buyer.userName?.charAt(0)?.toUpperCase() || "U"}
//               </div>

//               {/* USER INFO */}
//               <div>
//                 <div
//                   className="text-white"
//                   style={{
//                     fontFamily: "Orbitron, monospace",
//                     fontSize: "0.9rem",
//                     fontWeight: 700
//                   }}
//                 >
//                   {buyer.userName}
//                 </div>

//                 <div className="text-xs text-gray-400">
//                   {buyer.orders} orders
//                 </div>
//               </div>

//               {/* AMOUNT */}
//               <div className="ml-auto text-right">
//                 <div
//                   className="text-yellow-400"
//                   style={{
//                     fontFamily: "Orbitron, monospace",
//                     fontSize: "1rem",
//                     fontWeight: 700
//                   }}
//                 >
//                   ₹{Number(buyer.total).toFixed(2)}
//                 </div>

//                 <div className="text-xs text-gray-500">
//                   total spent
//                 </div>
//               </div>

//             </div>
//           ))
//         )}
//       </div>

//       {/* BUTTON (IMPORTANT FIX) */}
//       <div className="text-center mt-8">
//         <Link href="/partners">
//           <button className="px-6 py-3 rounded-lg border border-white/10 bg-white/5 text-gray-400 uppercase tracking-[0.06em] font-bold hover:border-blue-400 hover:text-blue-400 hover:bg-blue-400/10 transition cursor-pointer">
//             View All & Partners →
//           </button>
//         </Link>
//       </div>

//     </section>
//   )
// }
"use client";

import Link from "next/link";
import {
  Mail,
  MessageCircle,
  Globe,
  Clock3,
} from "lucide-react";

export default function TopBuyers() {
  return (
    <footer className="relative mt-24 bg-transparent overflow-hidden">

      <div className="absolute inset-0 " />

      <div className="relative max-w-7xl mx-auto px-6 py-14">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>

            <h2
              className="text-4xl font-black tracking-wide"
              style={{ fontFamily: "Orbitron, monospace" }}
            >
              <span className="text-cyan-400">FADE</span>
              <span className="text-white">ZEN</span>
            </h2>

            <p className="mt-6 text-gray-300 leading-7">
              Premium Minecraft Server Store
            </p>

            <p className="mt-4 text-gray-500 leading-6 text-sm max-w-xs">
              Buy ranks, keys, bundles and in-game items securely.
              Every purchase is delivered automatically after successful payment.
            </p>
          </div>

          {/* Store */}

          <div className="mb-5">
            <h3
              className="text-white font-bold uppercase tracking-widest mb-2"
              style={{ fontFamily: "Orbitron, monospace" }}
            >
              Store
            </h3>

            <div className="mt-2 h-px w-10 bg-cyan-400/70" />


            <div className="flex flex-col gap-3 mt-2">

              <Link href="/store" className="text-gray-500 hover:text-cyan-300 transition duration-200">
                Ranks
              </Link>

              <Link href="/store?category=keys" className="text-gray-500 hover:text-cyan-300 transition duration-200">
                Crate Keys
              </Link>

              <Link href="/store?category=bundles" className="text-gray-500 hover:text-cyan-300 transition duration-200">
                Bundles
              </Link>

              <Link href="/profile" className="text-gray-500 hover:text-cyan-300 transition duration-200">
                Fade Points
              </Link>

            </div>

          </div>

          {/* Support */}

          <div>

            <h3
              className="text-white font-bold uppercase tracking-widest mb-2"
              style={{ fontFamily: "Orbitron, monospace" }}
            >
              Support
            </h3>

             <div className="mt-2 h-px w-10 bg-cyan-400/70" />

            <div className="flex flex-col gap-3">

              <Link href="/contact" className="text-gray-500 mt-2 hover:text-cyan-300 transition duration-200">
                Contact Us
              </Link>

              <a
                href="https://discord.gg/aBaPbNdScN"
                target="_blank"
                className="text-gray-500 hover:text-cyan-300 transition duration-200"
              >
                Discord Server
              </a>

              <a
                href="mailto:fadedzen@mail.io"
                className="text-gray-500 hover:text-cyan-300 transition duration-200"
              >
                Email Support
              </a>

            </div>

          </div>

          {/* Legal */}

          <div>

            <h3
              className="text-white font-bold uppercase tracking-widest mb-2"
              style={{ fontFamily: "Orbitron, monospace" }}
            >
              Legal
            </h3>
           <div className="mt-2 h-px w-10 bg-cyan-400/70" />

            <div className="space-y-4 flex flex-col">

              <Link href="/legal/privacy" className="text-gray-500 mt-3 hover:text-cyan-300 transition duration-200">
                Privacy Policy
              </Link>

              <Link href="/legal/terms" className="text-gray-500 hover:text-cyan-300 transition duration-200">
                Terms & Conditions
              </Link>

              <Link href="/legal/refund" className="text-gray-500 hover:text-cyan-300 transition duration-200">
                Refund Policy
              </Link>

            </div>

          </div>


        </div>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-x-10 gap-y-4 text-sm">

              <a
                href="mailto:support@fadezen.fun"
                className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition"
              >
                <Mail size={18} className="text-cyan-400" />
                fadedzen@mail.io
              </a>

              <a
                href="https://discord.gg/aBaPbNdScN"
                target="_blank"
                className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition"
              >
                <MessageCircle size={18} className="text-cyan-400" />
                discord.gg/FadeZen
              </a>

              <a
                href="https://www.fadezen.fun"
                className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition"
              >
                <Globe size={18} className="text-cyan-400" />
                www.fadezen.fun
              </a>

            </div>
      </div>
      

    </footer>
  );
}