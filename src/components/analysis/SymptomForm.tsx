"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

const BRAND_PRIMARY = "#22668A"
const MIN_LENGTH = 10
const MAX_LENGTH = 1000

interface SymptomFormProps {
  onSubmit: (symptomText: string) => Promise<void>
  isLoading: boolean
  error?: string | null
}

export default function SymptomForm({ onSubmit, isLoading, error }: SymptomFormProps) {
  const [symptomText, setSymptomText] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation (SRS FR-03)
    const trimmed = symptomText.trim()

    if (trimmed.length === 0) {
      // Tidak perlu error karena textarea required
      return
    }

    if (trimmed.length < MIN_LENGTH) {
      // Error akan dihandle oleh server, tapi bisa juga dihandle di sini
      return
    }

    if (trimmed.length > MAX_LENGTH) {
      return
    }

    await onSubmit(trimmed)
  }

  const characterCount = symptomText.length
  const isOverLimit = characterCount > MAX_LENGTH
  const isUnderLimit = characterCount > 0 && characterCount < MIN_LENGTH

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="symptoms">
          Gejala yang dialami
          <span className="text-sm text-muted-foreground ml-2">
            (minimal {MIN_LENGTH} karakter)
          </span>
        </Label>
        <Textarea
          id="symptoms"
          name="symptoms"
          placeholder="Contoh: Saya mengalami demam tinggi sejak 3 hari yang lalu, disertai sakit kepala dan batuk kering..."
          value={symptomText}
          onChange={(e) => setSymptomText(e.target.value)}
          className={`min-h-[150px] resize-none ${
            isOverLimit ? "border-red-500 focus-visible:ring-red-500" : ""
          }`}
          disabled={isLoading}
          required
          minLength={MIN_LENGTH}
          maxLength={MAX_LENGTH}
        />
        <div className="flex items-center justify-between">
          <p
            className={`text-xs ${
              isOverLimit
                ? "text-red-600 font-medium"
                : isUnderLimit
                ? "text-yellow-600"
                : "text-muted-foreground"
            }`}
          >
            {characterCount} / {MAX_LENGTH} karakter
            {isUnderLimit && ` (kurang ${MIN_LENGTH - characterCount} karakter lagi)`}
            {isOverLimit && " (melebihi batas maksimal)"}
          </p>
          {isUnderLimit && (
            <p className="text-xs text-yellow-600">️ Terlalu singkat</p>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full text-white"
        style={{ backgroundColor: BRAND_PRIMARY }}
        disabled={isLoading || characterCount < MIN_LENGTH || isOverLimit}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Menganalisis gejala...
          </>
        ) : (
          "Analisis Gejala"
        )}
      </Button>
    </form>
  )
}