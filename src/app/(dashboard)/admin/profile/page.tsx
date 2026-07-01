// src/app/(dashboard)/admin/profile/page.tsx
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProfileForm from "@/components/profile/ProfileForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Shield } from "lucide-react"

const BRAND_PRIMARY = "#22668A"

export default async function AdminProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Cek role admin
  const role = user.user_metadata?.role ?? "user"
  if (role !== "admin") {
    redirect("/user")
  }

  // Ambil profil dari database
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("usia, jenis_kelamin")
    .eq("user_id", user.id)
    .single()

  // Jika profil belum ada, redirect ke dashboard admin dengan pesan error
  if (profileError || !profile) {
    redirect("/admin")
  }

  // Server Action untuk update profil
  async function updateProfile(data: { usia: number; jenis_kelamin: string }) {
    "use server"
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Unauthorized")
    }

    // Verifikasi role admin
    const role = user.user_metadata?.role ?? "user"
    if (role !== "admin") {
      throw new Error("Unauthorized - Admin only")
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        usia: data.usia,
        jenis_kelamin: data.jenis_kelamin,
      })
      .eq("user_id", user.id)

    if (error) {
      throw new Error(error.message)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profil Admin</h1>
        <p className="text-gray-600 mt-1">Kelola informasi pribadi Anda</p>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" style={{ color: BRAND_PRIMARY }} />
            Informasi Akun Admin
          </CardTitle>
          <CardDescription>
            Email: {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            usia={profile.usia}
            jenis_kelamin={profile.jenis_kelamin}
            onUpdate={updateProfile}
          />
        </CardContent>
      </Card>

      {/* Additional Admin Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" style={{ color: BRAND_PRIMARY }} />
            Informasi Tambahan
          </CardTitle>
          <CardDescription>
            Data akun administrator Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm font-medium text-gray-700">Role</span>
            <span className="text-sm text-gray-900 font-semibold">Administrator</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm font-medium text-gray-700">User ID</span>
            <span className="text-sm text-gray-900 font-mono">{user.id}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-gray-700">Tanggal Bergabung</span>
            <span className="text-sm text-gray-900">
              {new Date(user.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}