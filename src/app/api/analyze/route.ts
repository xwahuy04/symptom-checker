// src/app/api/analyze/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { AnalyzeRequest, AnalyzeResponse, ApiError } from "@/types/api"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    // 1. Verifikasi autentikasi
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json<ApiError>(
        {
          error: "Anda harus login terlebih dahulu",
          code: "AUTH_REQUIRED",
        },
        { status: 401 }
      )
    }

    // 2. Parse request body
    const body: AnalyzeRequest = await request.json()
    const { symptom_text } = body

    // 3. Validasi input (SRS §2.5.2: min 10, max 1000 karakter)
    if (!symptom_text || typeof symptom_text !== "string") {
      return NextResponse.json<ApiError>(
        {
          error: "Gejala tidak boleh kosong",
          code: "INVALID_INPUT",
        },
        { status: 400 }
      )
    }

    const trimmedText = symptom_text.trim()

    if (trimmedText.length < 10) {
      return NextResponse.json<ApiError>(
        {
          error: "Gejala harus minimal 10 karakter. Silakan deskripsikan gejala Anda lebih detail.",
          code: "INVALID_INPUT",
          details: { minLength: 10, currentLength: trimmedText.length },
        },
        { status: 400 }
      )
    }

    if (trimmedText.length > 1000) {
      return NextResponse.json<ApiError>(
        {
          error: "Gejala maksimal 1000 karakter. Silakan persingkat deskripsi Anda.",
          code: "INVALID_INPUT",
          details: { maxLength: 1000, currentLength: trimmedText.length },
        },
        { status: 400 }
      )
    }

    // 4. Ambil profil user (usia, jenis_kelamin)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("usia, jenis_kelamin")
      .eq("user_id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json<ApiError>(
        {
          error: "Profil tidak ditemukan. Silakan lengkapi profil Anda terlebih dahulu.",
          code: "PROFILE_NOT_FOUND",
        },
        { status: 400 }
      )
    }

    // 5. Panggil AI service (akan diimplementasikan di FR-04)
    // Untuk sekarang, return dummy response untuk testing FR-03
    const dummyResponse: AnalyzeResponse = {
      conditions: [
        { name: "Flu biasa", confidence: 70 },
        { name: "Infeksi saluran pernapasan", confidence: 20 },
      ],
      urgency: "RINGAN",
      recommendation: "Istirahat yang cukup, minum air putih, dan konsumsi obat pereda gejala.",
      disclaimer:
        "Hasil ini hanyalah alat bantu awal, bukan diagnosis resmi dokter. Segera konsultasikan ke dokter jika gejala memburuk.",
    }

    // 6. Return response
    return NextResponse.json(dummyResponse, { status: 200 })
  } catch (error) {
    console.error("Analyze API error:", error)
    return NextResponse.json<ApiError>(
      {
        error: "Terjadi kesalahan pada server. Silakan coba lagi.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    )
  }
}