import { db } from './firebase'
import { 
  collection, getDocs, query, orderBy, doc, getDoc 
} from 'firebase/firestore'

export async function getAllOrders() {
  try {
    const usersSnap = await getDocs(query(
      collection(db, 'users'),
      orderBy('updatedAt', 'desc')
    ))

    const orders = []
    usersSnap.forEach(userDoc => {
      const userData = userDoc.data()
      userData.purchases?.forEach(purchase => {
        orders.push({
          orderId: `${userDoc.id}-${purchase.id || Date.now()}`,
          userId: userDoc.id,
          userName: userData.name || userData.username || 'Unknown',
          userPoints: userData.points || 0,
          product: purchase,
          timestamp: purchase.timestamp || userData.updatedAt,
        })
      })
    })

    return orders.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0))
  } catch (error) {
    console.error('Get orders error:', error)
    return []
  }
}

export async function getOrderById(orderId) {
  try {
    // Parse orderId to find userId and purchase index
    const [userId, purchaseId] = orderId.split('-')
    const userDoc = await getDoc(doc(db, 'users', userId))
    
    if (!userDoc.exists()) return null
    
    const userData = userDoc.data()
    const purchaseIndex = userData.purchases?.findIndex(p => p.id === purchaseId || String(Date.now()) === purchaseId)
    
    if (purchaseIndex === -1) return null
    
    const order = userData.purchases[purchaseIndex]
    
    return {
      orderId,
      userId,
      userName: userData.name || 'Unknown',
      userPoints: userData.points || 0,
      product: order,
      timestamp: order.timestamp || userData.updatedAt
    }
  } catch (error) {
    console.error('Get order error:', error)
    return null
  }
}
