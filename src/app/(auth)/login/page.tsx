// src/app/(auth)/login/page.tsx
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

const BRAND_PRIMARY = "#22668A"

async function loginAction(formData: FormData) {
  "use server"

  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const password = formData.get("password") as string

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect("/login?error=invalid_credentials")
  }

  // Role-based redirect
  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.user_metadata?.role ?? "user"
  return redirect(role === "admin" ? "/admin" : "/user")
}

// PERUBAHAN PENTING: Component sekarang async dan await searchParams
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>  // Tipe Promise
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect jika sudah login
  if (user) {
    const role = user.user_metadata?.role ?? "user"
    return redirect(role === "admin" ? "/admin" : "/user")
  }

  // AWAIT searchParams sebelum diakses
  const params = await searchParams
  const error = params?.error

  const errorMessages: Record<string, string> = {
    invalid_credentials: "Email atau password salah.",
    auth_required: "Anda harus login terlebih dahulu.",
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Masuk</CardTitle>
          <CardDescription>Symptom Checker AI</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Alert error - sekarang akan muncul */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {errorMessages[error] ?? decodeURIComponent(error)}
              </AlertDescription>
            </Alert>
          )}

          <form action={loginAction} className="space-y-4">
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
                placeholder="Password kamu"
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full text-white"
              style={{ backgroundColor: BRAND_PRIMARY }}
            >
              Masuk
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/register" className="font-medium hover:underline" style={{ color: BRAND_PRIMARY }}>
                Daftar
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}