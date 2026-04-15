import { db } from './firebase'
import { 
  doc, getDoc, setDoc, updateDoc, serverTimestamp 
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
      updatedAt: null
    }
  } catch (error) {
    console.error('Get settings error:', error)
    return null
  }
}

export async function updateStoreSettings(settings) {
  try {
    await setDoc(doc(db, SETTINGS_PATH), {
      ...settings,
      updatedAt: serverTimestamp()
    }, { merge: true })
    return true
  } catch (error) {
    console.error('Update settings error:', error)
    return false
  }
}

