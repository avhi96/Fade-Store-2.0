import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import AdminSettings from "@/components/AdminSettings"

export default function SettingsPage() {
  return (
    <AdminAuthWrapper>
      <AdminSettings />
    </AdminAuthWrapper>
  )
}
