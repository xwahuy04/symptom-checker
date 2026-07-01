// src/app/(dashboard)/user/page.tsx
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, History, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

const BRAND_PRIMARY = "#22668A"

export default async function UserDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Ambil statistik user
  const { count: totalAnalyses } = await supabase
    .from("analysis_results")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  // Ambil riwayat terbaru (5 terakhir)
  const { data: recentAnalyses } = await supabase
    .from("analysis_results")
    .select("id, symptom_text, urgency, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Hitung urgensi distribution
  const { data: urgencyStats } = await supabase
    .from("analysis_results")
    .select("urgency")
    .eq("user_id", user.id)

  const urgencyCount = {
    RINGAN: urgencyStats?.filter(a => a.urgency === "RINGAN").length || 0,
    SEDANG: urgencyStats?.filter(a => a.urgency === "SEDANG").length || 0,
    DARURAT: urgencyStats?.filter(a => a.urgency === "DARURAT").length || 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang kembali, {user.email}</p>
        </div>
        <Button asChild className="text-white" style={{ backgroundColor: BRAND_PRIMARY }}>
          <Link href="/user/gejala" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Input Gejala Baru
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analisis</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnalyses || 0}</div>
            <p className="text-xs text-muted-foreground">Pemeriksaan gejala</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kasus Ringan</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgencyCount.RINGAN}</div>
            <p className="text-xs text-muted-foreground">Gejala ringan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kasus Sedang</CardTitle>
            <div className="h-4 w-4 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgencyCount.SEDANG}</div>
            <p className="text-xs text-muted-foreground">Perlu perhatian</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kasus Darurat</CardTitle>
            <div className="h-4 w-4 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgencyCount.DARURAT}</div>
            <p className="text-xs text-muted-foreground">Segera ditangani</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Analyses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Riwayat Terbaru
              </CardTitle>
              <CardDescription>5 pemeriksaan gejala terakhir Anda</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/user/history">Lihat Semua</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentAnalyses && recentAnalyses.length > 0 ? (
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {analysis.symptom_text}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(analysis.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        analysis.urgency === "DARURAT"
                          ? "bg-red-100 text-red-800"
                          : analysis.urgency === "SEDANG"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {analysis.urgency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Belum ada riwayat pemeriksaan</p>
              <Button asChild className="text-white" style={{ backgroundColor: BRAND_PRIMARY }}>
                <Link href="/user/gejala">Mulai Input Gejala</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" style={{ color: BRAND_PRIMARY }} />
              Input Gejala Baru
            </CardTitle>
            <CardDescription>
              Deskripsikan gejala yang Anda alami untuk mendapatkan analisis AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full text-white" style={{ backgroundColor: BRAND_PRIMARY }}>
              <Link href="/user/gejala">Mulai Analisis</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" style={{ color: BRAND_PRIMARY }} />
              Lihat Riwayat
            </CardTitle>
            <CardDescription>
              Periksa kembali hasil analisis gejala sebelumnya
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/user/history">Buka Riwayat</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}