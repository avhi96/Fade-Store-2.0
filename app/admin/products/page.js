import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import AdminProductsWrapper from "@/components/AdminProductsWrapper"

export default function ProductsPage() {
  return (
    <AdminAuthWrapper>
      <AdminProductsWrapper />
    </AdminAuthWrapper>
  )
}

