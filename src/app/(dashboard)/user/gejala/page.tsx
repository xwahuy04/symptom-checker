"use client"

import { useState } from "react"
import SymptomForm from "@/components/analysis/SymptomForm"
import AnalysisCard from "@/components/analysis/AnalysisCard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { AnalyzeResponse } from "@/types/api"

export default function GejalaPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)

  const handleSubmit = async (symptomText: string) => {
    setError(null)
    setResult(null)

    // Validasi
    if (symptomText.trim().length < 10) {
      setError("Gejala harus minimal 10 karakter")
      return
    }
    if (symptomText.trim().length > 1000) {
      setError("Gejala maksimal 1000 karakter")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptom_text: symptomText.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Terjadi kesalahan")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Input Gejala</h1>
        <p className="text-gray-600 mt-1">Deskripsikan gejala yang Anda alami untuk mendapatkan analisis awal berbasis AI</p>
      </div>

      {/* Form */}
      <SymptomForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

      {/* Hasil */}
      {result && (
        <AnalysisCard
          conditions={result.conditions}
          urgency={result.urgency}
          recommendation={result.recommendation}
          disclaimer={result.disclaimer}
          analysisId="" // Akan di-set setelah save ke database
          showFeedback={false}
          showShare={false}
        />
      )}
    </div>
  )
}