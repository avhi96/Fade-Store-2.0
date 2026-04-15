"use client"

import Skeleton from '@/components/Skeleton'
import { ProductDetailSkeleton } from '@/components/Skeleton'

export default function Loading() {
  return (
    <Skeleton>
      <ProductDetailSkeleton />
    </Skeleton>
  )
}
