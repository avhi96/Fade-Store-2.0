import { db } from './firebase'
import { 
  doc, updateDoc, arrayUnion, serverTimestamp, getDoc 
} from 'firebase/firestore'

export async function addUserPurchase(userId, product) {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      purchases: arrayUnion(product),
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Add purchase error:', error)
    throw error
  }
}

export async function getUser(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

export function getSpendRank(totalSpent) {
  if (totalSpent >= 5000) return { name: 'Diamond', color: 'from-purple-500 to-pink-500', progress: 100 }
  if (totalSpent >= 3500) return { name: 'Platinum', color: 'from-indigo-500 to-blue-500', next: 5000, progress: ((totalSpent - 2500) / 1500 * 100) }
  if (totalSpent >= 2500) return { name: 'Gold', color: 'from-amber-500 to-orange-500', next: 3500, progress: ((totalSpent - 1500) / 1000 * 100) }
  if (totalSpent >= 1500) return { name: 'Silver', color: 'from-gray-400 to-gray-200', next: 2500, progress: ((totalSpent - 500) / 1000 * 100) }
  if (totalSpent >= 500) return { name: 'Bronze', color: 'from-yellow-600 to-orange-500', next: 1500, progress: ((totalSpent - 0) / 500 * 100) }
  return { name: 'Member', color: 'from-gray-600 to-gray-400', next: 500, progress: 0 }
}
