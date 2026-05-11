
"use client"

import { useState, useEffect, useCallback } from 'react'

export function useCart() {
  const [cart, setCart] = useState([])
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage safely
  const loadCart = useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem('cartItems')
      if (!stored) {
        setCart([])
        return
      }

      const parsed = JSON.parse(stored)
      setCart(Array.isArray(parsed) ? parsed : [])
    } catch (e) {
      console.warn('Failed to load cart:', e)
      localStorage.removeItem('cartItems')
      setCart([])
    }
  }, [])

  // Save to localStorage
  const saveCart = useCallback((newCart) => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem('cartItems', JSON.stringify(newCart))
    } catch (e) {
      console.warn('Failed to save cart:', e)
    }
  }, [])

  // Load on mount (hydration guard)
  useEffect(() => {
    loadCart()
    setLoaded(true)
  }, [loadCart])

  // Save only after we loaded once (prevents empty initial state overwriting localStorage)
  useEffect(() => {
    if (!loaded) return
    saveCart(cart)
  }, [cart, loaded, saveCart])

  // Sync from other tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'cartItems' && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) setCart(parsed)
          else setCart([])
        } catch {
          setCart([])
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      const newCart = existing
        ? prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...product, qty: 1 }]
      return newCart
    })
  }, [])

  const removeItem = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQty = useCallback((id, delta) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
    )
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
    saveCart([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cartItems')
    }
  }, [saveCart])

  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = cart.reduce((sum, i) => sum + Number(i.price || 0) * i.qty, 0)

  return {
    cart,
    addToCart,
    removeItem,
    updateQty,
    clearCart,
    itemCount,
    subtotal,
    loadCart,
    saveCart
  }
}
