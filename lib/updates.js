import { db } from './firebase'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'

export async function getStoreUpdates() {
  const q = query(
    collection(db, 'updates'),
    orderBy('createdAt', 'desc')
  )
  
  return new Promise((resolve) => {
    onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))
      resolve(data)
    })
  })
}

export async function addUpdate(update) {
  try {
    await addDoc(collection(db, 'updates'), {
      ...update,
      createdAt: serverTimestamp()
    })
    return true
  } catch {
    return false
  }
}

export async function updateUpdate(id, update) {
  try {
    await updateDoc(doc(db, 'updates', id), update)
    return true
  } catch {
    return false
  }
}

export async function deleteUpdate(id) {
  try {
    await deleteDoc(doc(db, 'updates', id))
    return true
  } catch {
    return false
  }
}
