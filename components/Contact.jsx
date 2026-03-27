"use client"
import {
    MessageCircle,
    Mail,
    Bird,
    Activity,
    Clock
} from "lucide-react"

export default function Contact() {
    return (
        <section className="max-w-[1200px] mx-auto px-6 py-20">
            {/* 🔥 HERO TITLE */}
            <div className="text-center mb-20">

                <div
                    className="text-[0.7rem] tracking-[0.25em] uppercase text-blue-400 mb-4"
                    style={{ fontFamily: "Inter, sans-serif" }}
                >
                    Get In Touch
                </div>

                <h1
                    style={{
                        fontFamily: "Orbitron, monospace",
                        fontSize: "clamp(2.2rem,5vw,3.8rem)",
                        fontWeight: 900,
                        letterSpacing: "0.03em"
                    }}
                    className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
                >
                    Contact & Support
                </h1>

                {/* underline */}
                <div className="w-[80px] h-[2px] mx-auto mt-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded" />

            </div>

            <div className="grid md:grid-cols-2 gap-10">

                {/* 🔥 LEFT SIDE */}
                <div className="flex flex-col gap-5">

                    {[
                        {
                            icon: MessageCircle,
                            title: "Discord Server",
                            sub: "discord.gg/fade",
                        },
                        {
                            icon: Mail,
                            title: "Email Support",
                            sub: "support@fade.store",
                        },
                        {
                            icon: Bird,
                            title: "Twitter / X",
                            sub: "@FadeNetwork",
                        },
                        {
                            icon: Activity,
                            title: "Server Status",
                            sub: "All Systems Operational",
                            green: true,
                        },
                        {
                            icon: Clock,
                            title: "Avg Response Time",
                            sub: "< 5 minutes on Discord",
                        },
                    ].map((item, i) => {
                        const Icon = item.icon

                        return (
                            <div
                                key={i}
                                className="flex items-center gap-5 p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-blue-400/30 transition"
                            >
                                {/* ICON */}
                                <div className="w-[50px] h-[50px] rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                                    <Icon size={22} className="text-white" />
                                </div>

                                {/* TEXT */}
                                <div>
                                    <div
                                        className="text-white"
                                        style={{
                                            fontFamily: "Orbitron, monospace",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {item.title}
                                    </div>

                                    <div
                                        className={`text-sm ${item.green ? "text-green-400" : "text-gray-400"
                                            }`}
                                    >
                                        {item.sub}
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>

                {/* 🔥 RIGHT SIDE FORM */}
                <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">

                    <h3
                        className="mb-6 text-blue-400 tracking-[0.1em]"
                        style={{
                            fontFamily: "Orbitron, monospace",
                            fontWeight: 700,
                        }}
                    >
                        SEND A MESSAGE
                    </h3>

                    <form className="flex flex-col gap-4">

                        {/* ROW */}
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="YourName123"
                                className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-blue-400 outline-none"
                            />
                            <input
                                placeholder="user#0000"
                                className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-blue-400 outline-none"
                            />
                        </div>

                        {/* EMAIL */}
                        <input
                            placeholder="you@email.com"
                            className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-blue-400 outline-none"
                        />

                        {/* SELECT */}
                        <select className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 focus:border-blue-400 outline-none">
                            <option>Select a topic...</option>
                            <option>Support</option>
                            <option>Purchase Issue</option>
                            <option>Partnership</option>
                        </select>

                        {/* MESSAGE */}
                        <textarea
                            rows="5"
                            placeholder="Describe your issue or question in detail..."
                            className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-blue-400 outline-none"
                        />

                        {/* BUTTON */}
                        <button className="mt-4 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-bold tracking-[0.08em] uppercase shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-[1px] hover:shadow-[0_4px_30px_rgba(59,130,246,0.6)] transition">
                            Send Message →
                        </button>

                    </form>
                </div>

            </div>

        </section>
    )
}