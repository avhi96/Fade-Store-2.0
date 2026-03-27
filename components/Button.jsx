"use client"

export default function Button({ children, variant = 'primary', size = 'md', ...props }) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-[var(--font-body)] font-bold uppercase tracking-[0.1em] transition-all duration-300 border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-400/30"

  const sizeClasses = {
    sm: "px-4 py-2 text-xs min-h-[40px]",
    md: "px-6 py-3 text-sm min-h-[44px]",
    lg: "px-8 py-4 text-base min-h-[52px]"
  }

  const variants = {
    primary: "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-white shadow-lg shadow-cyan-400/30 hover:shadow-xl hover:shadow-cyan-400/50 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]",
    ghost: "bg-white/5 backdrop-blur-sm text-gray-300 border-white/20 hover:border-cyan-400/60 hover:text-cyan-400 hover:bg-white/10 hover:shadow-md shadow-cyan-400/20 active:bg-white/20",
    gold: "bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/50 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]"
  }

  return (
    <button 
      className={`${baseClasses} ${sizeClasses[size]} ${variants[variant]} ${props.className || ''}`} 
      {...props}
    >
      {children}
    </button>
  )
}
