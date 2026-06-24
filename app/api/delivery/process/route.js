import { NextResponse } from "next/server"

import { adminDb } from "@/lib/firebase-admin"

import { executeConsoleCommand }
  from "@/lib/pterodactyl"

export async function POST() {

  try {

    const snapshot =
      await adminDb
        .collection("deliveries")
        .where("status", "==", "pending")
        .limit(10)
        .get()

    if (snapshot.empty) {

      return NextResponse.json({
        success: true,
        processed: 0,
      })

    }

    let processed = 0

    for (const delivery of snapshot.docs) {

      const data = delivery.data()

      try {

        for (const item of data.items) {

          if (!item.productId) continue

          const product =
            await adminDb
              .collection("products")
              .doc(item.productId)
              .get()

          if (!product.exists) {
            continue
          }

          const productData =
            product.data()

          const commands =
            Array.isArray(productData?.commands)
              ? productData.commands
              : []

          for (const command of commands) {

            const finalCommand =
              command
                .replaceAll(
                  "{player}",
                  data.mcName
                )

            await executeConsoleCommand(
              finalCommand
            )

          }

        }

        await delivery.ref.update({

          status: "completed",

          deliveredAt:
            new Date(),

        })

        processed++

      } catch (error) {

        console.error(error)

        await delivery.ref.update({

          status: "failed",

          lastError:
            error.message,

          attempts:
            (data.attempts || 0) + 1,

        })

      }

    }

    return NextResponse.json({

      success: true,

      processed,

    })

  } catch (error) {

    return NextResponse.json({

      success: false,

      error: error.message,

    })

  }

}