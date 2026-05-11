import { db } from './firebase'
import { 
  doc, setDoc, getDoc, updateDoc, deleteDoc, 
  collection, query, where, getDocs, onSnapshot, serverTimestamp,
  arrayUnion 
} from 'firebase/firestore'

export async function createUser(userData) {
  try {
    const userRef = doc(db, 'users', userData.id)

    // IMPORTANT:
    // This runs on every app mount via <UserSync/>.
    // It must NOT reset purchases/points after the first creation.
    const existingSnap = await getDoc(userRef)

    if (existingSnap.exists()) {
      await setDoc(
        userRef,
        {
          ...userData,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
      return
    }

    // First-time creation
    await setDoc(
      userRef,
      {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        points: 0,
        purchases: [],
        isBanned: false,
        // Admin model (explicit field)
        role: userData?.role || 'user',
        isAdmin: userData?.isAdmin === true,
      },
      { merge: true }
    )

    console.log('User created:', userData.id)
  } catch (error) {
    console.error('Create user error:', error)
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

export async function updateUserPoints(userId, points) {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      points,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Update points error:', error)
  }
}

export async function addUserPurchase(userId, product) {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      purchases: arrayUnion(product),
      updatedAt: serverTimestamp()
    }, { merge: true })
  } catch (error) {
    console.error('Add purchase error:', error)
  }
}

