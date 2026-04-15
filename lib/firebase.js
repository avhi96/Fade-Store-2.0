import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBkUW1RZ5xoZrt2fHG_TDEeIr40HijyzKo",
  authDomain: "fade-0l3.firebaseapp.com",
  projectId: "fade-0l3",
  storageBucket: "fade-0l3.firebasestorage.app",
  messagingSenderId: "157176870909",
  appId: "1:157176870909:web:19cfea635b66566250cb94",
  measurementId: "G-Y5F0QQHRMK"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

// New: Image upload for products
export const uploadImage = async (file) => {
  if (!file) throw new Error('No file provided')
  
  const storageRef = ref(storage, `products/${Date.now()}-${file.name}`)
  const uploadTask = uploadBytesResumable(storageRef, file)
  
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progress if needed
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload progress:', progress)
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadURL)
      }
    )
  })
}

export const uploadViaApi = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  
  const { url } = await res.json()
  return url
}

