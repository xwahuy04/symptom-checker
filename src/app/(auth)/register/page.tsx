// src/app/(auth)/register/page.tsx
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

// Brand color sesuai preferensi
const BRAND_PRIMARY = "#22668A"

async function registerAction(formData: FormData) {
  "use server"

  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const password = formData.get("password") as string
  const usia = Number(formData.get("usia"))
  const jenis_kelamin = (formData.get("jenis_kelamin") as string)?.trim()
  const consent_pdp = formData.get("consent_pdp")
  const consent_disclaimer = formData.get("consent_disclaimer")

  // 1. Validasi consent (SRS §5.2 — UU PDP No.27/2022)
  if (!consent_pdp || !consent_disclaimer) {
    return redirect("/register?error=consent_required")
  }

  // 2. Validasi usia (DDD §9.1 — CHECK usia BETWEEN 0 AND 120)
  if (isNaN(usia) || usia < 0 || usia > 120) {
    return redirect("/register?error=invalid_usia")
  }

  // 3. Validasi jenis kelamin (DDD §2.1 — Gender type)
  const validGenders = ["laki-laki", "perempuan", "lainnya"]
  if (!validGenders.includes(jenis_kelamin)) {
    return redirect("/register?error=invalid_jenis_kelamin")
  }

  const supabase = await createClient()

  // 4. Cek apakah email sudah terdaftar (SRS FR-01 Kriteria #1)
  // Ref: https://supabase.com/docs/guides/auth/passwords#sign-up-a-user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { usia, jenis_kelamin },
    },
  })

  if (error) {
    // Supabase mengembalikan "User already registered" jika email sudah ada
    // Ref: https://supabase.com/docs/guides/auth/auth-errors
    if (error.message.toLowerCase().includes("registered")) {
      return redirect("/register?error=email_exists")
    }
    return redirect(`/register?error=${encodeURIComponent(error.message)}`)
  }

  // 5. Cek apakah email confirmation dibutuhkan
  // Ref: https://supabase.com/docs/guides/auth/signups/email-password#email-confirmation
  if (data.user && !data.session) {
    // Email confirmation aktif — user harus cek email dulu
    return redirect("/register?success=check_email")
  }

  // 6. Simpan profil ke tabel profiles (DDD §9.1)
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: data.user.id,
      usia,
      jenis_kelamin,
    })

    if (profileError) {
      return redirect(`/register?error=${encodeURIComponent(profileError.message)}`)
    }
  }

  // 7. Redirect ke dashboard sesuai role (SRS FR-01 Kriteria #2)
  // Role default = 'user' (SRS FR-01 Kriteria #3)
  return redirect("/user")
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }> 
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Kalau sudah login, langsung redirect ke dashboard sesuai role
  if (user) {
    const role = user.user_metadata?.role ?? "user"
    return redirect(role === "admin" ? "/admin" : "/user")
  }

  const params = await searchParams
  const { error, success } = params

  const errorMessages: Record<string, string> = {
    consent_required: "Anda harus menyetujui kedua pernyataan untuk melanjutkan.",
    email_exists: "Email sudah terdaftar. Silakan login atau gunakan email lain.",
    invalid_usia: "Usia harus antara 0-120 tahun.",
    invalid_jenis_kelamin: "Jenis kelamin tidak valid.",
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
          <CardDescription>Symptom Checker AI</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {errorMessages[error] ?? decodeURIComponent(error)}
              </AlertDescription>
            </Alert>
          )}

          {success === "check_email" && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                Cek email kamu untuk verifikasi link aktivasi akun.
              </AlertDescription>
            </Alert>
          )}

          <form action={registerAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="nama@email.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usia">Usia</Label>
              <Input
                id="usia"
                name="usia"
                type="number"
                required
                min={0}
                max={120}
                placeholder="Contoh: 25"
              />
            </div>

            {/* Input field untuk jenis kelamin — sesuai preferensi user */}
            <div className="space-y-2">
              <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
              <Input
                id="jenis_kelamin"
                name="jenis_kelamin"
                type="text"
                required
                list="jenis-kelamin-options"
                placeholder="laki-laki, perempuan, atau lainnya"
              />
              <datalist id="jenis-kelamin-options">
                <option value="laki-laki" />
                <option value="perempuan" />
                <option value="lainnya" />
              </datalist>
            </div>

            {/* Consent (SRS §5.2 — UU PDP) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2">
                <Checkbox id="consent_pdp" name="consent_pdp" value="true" required />
                <Label htmlFor="consent_pdp" className="text-sm font-normal leading-relaxed cursor-pointer">
                  Saya menyetujui pengumpulan data kesehatan sesuai{" "}
                  <strong>UU PDP No. 27/2022</strong>
                </Label>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox id="consent_disclaimer" name="consent_disclaimer" value="true" required />
                <Label htmlFor="consent_disclaimer" className="text-sm font-normal leading-relaxed cursor-pointer">
                  Saya memahami aplikasi ini <strong>BUKAN pengganti diagnosis dokter</strong>
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full text-white"
              style={{ backgroundColor: BRAND_PRIMARY }}
            >
              Buat Akun
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-medium hover:underline" style={{ color: BRAND_PRIMARY }}>
                Masuk
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}