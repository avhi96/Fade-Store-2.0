import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import AdminUsersWrapper from "@/components/AdminUsersWrapper"

export default function UsersPage() {
  return (
    <AdminAuthWrapper>
      <AdminUsersWrapper />
    </AdminAuthWrapper>
  )
}
