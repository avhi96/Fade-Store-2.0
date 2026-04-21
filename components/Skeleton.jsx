"use client"

export default function Skeleton({ children }) {
  return <>{children}</>
}

export const CardSkeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6 ${className}`}>
    <div className="h-32 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl mb-4" />
    <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-700/30 rounded w-1/2 mb-4" />
    <div className="space-y-2">
      <div className="h-4 bg-gray-700/30 rounded w-full" />
      <div className="h-4 bg-gray-700/30 rounded w-4/5" />
    </div>
    <div className="h-10 bg-gray-700/50 rounded-lg mt-6 w-32" />
  </div>
)

export const ProductDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
    <div className="flex gap-4 items-center">
      <div className="w-10 h-10 bg-gray-700 rounded-lg" />
      <div className="h-6 w-24 bg-gray-700 rounded" />
    </div>
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="h-64 bg-gray-700 rounded-2xl" />
      <div className="space-y-6">
        <div className="h-10 w-4/5 bg-gray-700 rounded-lg" />
        <div className="h-12 w-48 bg-gray-700 rounded-xl" />
        <div className="flex gap-4">
          <div className="h-12 flex-1 bg-gray-700 rounded-xl" />
          <div className="h-12 flex-1 bg-gray-700 rounded-xl" />
        </div>
      </div>
    </div>
    <div>
      <div className="h-8 w-32 bg-gray-700 rounded mb-6" />
      <div className="grid md:grid-cols-3 gap-4">
        <div className="h-20 p-4 bg-gray-700 rounded-xl" />
        <div className="h-20 p-4 bg-gray-700 rounded-xl" />
        <div className="h-20 p-4 bg-gray-700 rounded-xl" />
      </div>
    </div>
  </div>
)

export const AdminProductsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
  </div>
)

export const NavbarSkeleton = () => (
  <div className="fixed top-0 left-0 right-0 h-[70px] bg-[#030610d9] backdrop-blur-xl border-b border-white/10 z-[100]" />
)

