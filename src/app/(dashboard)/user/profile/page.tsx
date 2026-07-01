// src/app/(dashboard)/user/profile/page.tsx
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProfileForm from "@/components/profile/ProfileForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"

const BRAND_PRIMARY = "#22668A"

export default async function UserProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Ambil profil dari database
  const { data: profile } = await supabase
    .from("profiles")
    .select("usia, jenis_kelamin")
    .eq("user_id", user.id)
    .single()

  if (!profile) {
    redirect("/user")
  }

  // Server Action untuk update profil
  async function updateProfile(data: { usia: number; jenis_kelamin: string }) {
    "use server"
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Unauthorized")
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
        <h1 className="text-3xl font-bold text-gray-900">Profil Saya</h1>
        <p className="text-gray-600 mt-1">Kelola informasi pribadi Anda</p>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" style={{ color: BRAND_PRIMARY }} />
            Informasi Akun
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
    </div>
  )
}