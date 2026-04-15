import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import AdminOrdersWrapper from "@/components/AdminOrdersWrapper"

export default function OrdersPage() {
  return (
    <AdminAuthWrapper>
      <AdminOrdersWrapper />
    </AdminAuthWrapper>
  )
}
