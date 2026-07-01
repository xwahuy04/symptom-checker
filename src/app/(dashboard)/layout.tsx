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
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar - Hanya untuk User Menu, tanpa judul */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-end">
          <UserMenu email={userEmail} role={role} />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}