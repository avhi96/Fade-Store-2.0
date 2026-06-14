import { db } from './firebase'
import {
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore'

export async function getStoreUpdates() {

  try {

    const q = query(
      collection(db, 'updates'),
      orderBy('createdAt', 'desc')
    )

    const snap = await getDocs(q)

    return snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }))

  } catch (error) {

    console.error('Failed to load updates:', error)

    return []
  }
}
export async function addUpdate(update) {
  try {

    const response =
      await fetch(
        '/api/admin/updates/save',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            update,
          }),
        }
      )

    const data =
      await response.json()

    return !!data?.success

  } catch (error) {

    console.error(
      'Failed to add update:',
      error
    )

    return false
  }
}

export async function updateUpdate(id, update) {
  try {

    const response =
      await fetch(
        '/api/admin/updates/save',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            editId: id,
            update,
          }),
        }
      )

    const data =
      await response.json()

    return !!data?.success

  } catch (error) {

    console.error(
      'Failed to update update:',
      error
    )

    return false
  }
}

export async function deleteUpdate(id) {
  try {

    const response =
      await fetch(
        '/api/admin/updates/delete',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            id,
          }),
        }
      )

    const data =
      await response.json()

    return !!data?.success

  } catch (error) {

    console.error(
      'Failed to delete update:',
      error
    )

    return false
  }
}
