import { NextResponse } from 'next/server'

import {
  adminDb
} from '@/lib/firebase-admin'

export async function POST(req) {

  try {

    const {
      code,
      userId,
      total,
    } = await req.json()

    const normalizedCode =
      String(code || '').trim().toUpperCase()

    const normalizedUserId =
      String(userId || '').trim()

    const safeTotal =
      Number(total || 0)

    if (!normalizedCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Enter a promo code',
        },
        { status: 400 }
      )
    }

    if (!normalizedUserId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Login required',
        },
        { status: 401 }
      )
    }

    if (!Number.isFinite(safeTotal) || safeTotal <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid order total',
        },
        { status: 400 }
      )
    }

    const settingsSnap =
      await adminDb
        .collection('settings')
        .doc('store')
        .get()

if (!settingsSnap.exists) {
  return NextResponse.json(
    {
      success: false,
      error: "Settings not found",
    },
    { status: 404 }
  )
}

    const settings = settingsSnap.data()

    console.log("========== PROMO DEBUG ==========")
    console.log("Settings exists:", settingsSnap.exists)
    console.log("Settings:", settings)
    console.log("Promo Codes:", settings?.promoCodes)
    console.log("Searching for:", normalizedCode)
    console.log(
      "Available codes:",
      (settings?.promoCodes || []).map(p => p.code)
    )
    console.log("=================================")

    const promos =
      Array.isArray(settings?.promoCodes)
        ? settings.promoCodes
        : []

    const promo = promos.find(
      (p) =>
        p?.active !== false &&
        String(p.code || '').trim().toUpperCase() === normalizedCode
    )

    if (!promo) {
      return NextResponse.json({
        success: false,
        error: 'Invalid promo code',
      }, { status: 400 })
    }

    const maxUses = Number(promo.maxUses || 0)

    const usedBy =
      Array.isArray(promo.usedBy)
        ? promo.usedBy.map((id) => String(id))
        : []

    if (
      maxUses > 0 &&
      usedBy.length >= maxUses
    ) {
      return NextResponse.json({
        success: false,
        error: 'Promo fully used',
      }, { status: 400 })
    }

    if (usedBy.includes(normalizedUserId)) {
      return NextResponse.json({
        success: false,
        error: 'Promo already used',
      }, { status: 400 })
    }

    let discountAmount = 0

    if (promo.discountType === 'percentage') {
      discountAmount =
        safeTotal * (Number(promo.discountValue || 0) / 100)
    } else {
      discountAmount = Number(promo.discountValue || 0)
    }

    const safeDiscountAmount =
      Math.min(
        safeTotal,
        Math.max(
          0,
          Number.isFinite(discountAmount)
            ? discountAmount
            : 0
        )
      )

    return NextResponse.json({
      success: true,
      discountAmount:
        safeDiscountAmount,
    })

  } catch (err) {
    console.error("PROMO VALIDATE ERROR:", err)

    return NextResponse.json(
      {
        success: false,
        error: err?.message,
        stack: process.env.NODE_ENV === "development"
          ? err?.stack
          : undefined,
      },
      { status: 500 }
    )
  }
}
