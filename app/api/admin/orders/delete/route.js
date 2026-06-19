import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(request) {
  try {
    const adminCheck = await requireAdmin();

    if (!adminCheck.ok) {
      return NextResponse.json(
        { success: false, error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing orderId",
        },
        { status: 400 }
      );
    }

    await adminDb.collection("orders").doc(orderId).delete();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete order:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}