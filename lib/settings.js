import { db } from './firebase'
import {
  doc,
  getDoc,
} from 'firebase/firestore'

const SETTINGS_PATH = 'settings/store'

export async function getStoreSettings() {
  try {
    const docSnap = await getDoc(doc(db, SETTINGS_PATH))
    if (docSnap.exists()) {
      return docSnap.data()
    }
    // Default settings
    return {
      taxRate: 0,
      globalDiscount: 0,
      announcement: '',
      maintenanceMode: false,
      maintenanceMessage: 'Store under maintenance',
      welcomeMessage: 'Welcome to Fade Store!',
      currency: '₹',

      partners: [],

      promoCodes: [],
      redeemCodes: [],

      updatedAt: null
    }
  } catch (error) {
    console.error('Get settings error:', error)
    return null
  }
}

export async function updateStoreSettings(settings) {

  try {

    const response = await fetch(
      '/api/admin/settings',
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify(settings),
      }
    )

    const data =
      await response.json()

    return !!data?.success

  } catch (error) {

    console.error(
      'Update settings error:',
      error
    )

    return false
  }
}
