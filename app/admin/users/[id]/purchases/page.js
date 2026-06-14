import { ShoppingBag, ArrowLeft } from 'lucide-react'
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import Link from 'next/link'
import { getUser } from "@/lib/users"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function UserPurchases({ params }) {
  const { id: userId } = await params
  const user = await getUser(userId)
  
  if (!user) {
    return <div className='p-8 text-center text-red-400'>User not found</div>
  }

  return (
    <AdminAuthWrapper>
      <div className='max-w-4xl mx-auto p-8'>
        <div className='mb-8'>
          <Link href='/admin/users' className='inline-flex items-center gap-2 text-gray-400 hover:text-white transition p-3 rounded-lg hover:bg-white/5 mb-8'>
            <ArrowLeft size={20} />
            <span>Back to Users</span>
          </Link>
        </div>
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-bold text-white mb-2' style={{ fontFamily: 'Orbitron, monospace' }}>
            {user.name || 'User'} Purchases
          </h1>
          <p className='text-gray-400'>Discord ID: <code className='bg-black px-2 py-1 rounded text-sm font-mono'>{userId}</code></p>
          <p className='text-gray-400 mt-2'>Total: {user.purchases?.length || 0} orders</p>
        </div>

        {user.purchases && user.purchases.length > 0 ? (
          <div className='space-y-4'>
            {user.purchases.map((purchase, i) => (
              <div key={i} className='bg-white/5 border border-white/10 rounded-xl p-6'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4'>
                  <h3 className='font-bold text-xl text-white'>{purchase.name}</h3>
                  <div className='flex gap-4 text-sm'>
                    <span className='text-green-400 font-mono'>₹{purchase.price?.toFixed(2)}</span>
                    <span className='text-gray-400'>
                      {purchase.timestamp ? 
                        (() => {
                          let date;
                          if (typeof purchase.timestamp === 'string') {
                            date = new Date(purchase.timestamp);
                          } else if (purchase.timestamp?.toDate) {
                            date = purchase.timestamp.toDate();
                          } else {
                            return 'Recent';
                          }
                          return date.toLocaleString();
                        })()
                        : 'Recent'}
                    </span>
                  </div>
                </div>
                {purchase.perks && (
                  <div className='space-y-1'>
                    <h4 className='text-gray-300 font-medium mb-2'>Perks:</h4>
                    <ul className='space-y-1'>
                      {Array.isArray(purchase.perks) ? purchase.perks.map((perk, j) => (
                        <li key={j} className='flex items-center gap-2 text-sm text-gray-300'>
                          • {perk}
                        </li>
                      )) : (
                        <li className='text-sm text-gray-400'>No perks listed</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-20 bg-white/5 rounded-xl border border-dashed border-gray-500'>
            <ShoppingBag className='w-16 h-16 mx-auto mb-4 text-gray-500' />
            <h3 className='text-xl text-gray-300 mb-2'>No purchases</h3>
            <p className='text-gray-500'>This user has not made any purchases yet</p>
          </div>
        )}
      </div>
    </AdminAuthWrapper>
  )
}
