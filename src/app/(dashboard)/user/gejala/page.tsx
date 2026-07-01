"use client"

import { useState } from "react"
import SymptomForm from "@/components/analysis/SymptomForm"
import AnalysisCard from "@/components/analysis/AnalysisCard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"
import { AnalyzeResponse } from "@/types/api"

export default function GejalaPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)

  const handleSubmit = async (symptomText: string) => {
    setError(null)
    setResult(null)

    setIsLoading(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptom_text: symptomText }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle error dari server (SRS FR-03: tampilkan pesan error)
        throw new Error(data.error || "Terjadi kesalahan")
      }

      // Success
      setResult(data as AnalyzeResponse)
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
        <p className="text-gray-600 mt-1">
          Deskripsikan gejala yang Anda alami untuk mendapatkan analisis awal berbasis AI
        </p>
      </div>

      {/* Info Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-sm">
          <strong>Tips:</strong> Deskripsikan gejala Anda secara detail termasuk durasi, intensitas, dan gejala penyerta.
          Minimal 10 karakter, maksimal 1000 karakter.
        </AlertDescription>
      </Alert>

      {/* Form */}
      <SymptomForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

      {/* Hasil */}
      {result && (
        <AnalysisCard
          conditions={result.conditions}
          urgency={result.urgency}
          recommendation={result.recommendation}
          disclaimer={result.disclaimer}
          analysisId=""
          showFeedback={false}
          showShare={false}
        />
      )}
    </div>
  )
}