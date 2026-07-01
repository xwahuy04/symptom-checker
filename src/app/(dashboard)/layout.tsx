// src/app/(dashboard)/layout.tsx
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Sidebar from "@/components/layout/Sidebar"
import UserMenu from "@/components/layout/UserMenu"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const role = user.user_metadata?.role ?? "user"
  const userEmail = user.email || ""

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {role === "admin" ? "Dashboard Admin" : "Dashboard User"}
              </h2>
              <p className="text-sm text-gray-600">
                {role === "admin" ? "Pantau performa aplikasi" : "Input gejala dan lihat hasil analisis"}
              </p>
            </div>
            <UserMenu email={userEmail} role={role} />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}