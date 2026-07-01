"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"

const BRAND_PRIMARY = "#22668A"

interface SymptomFormProps {
  onSubmit: (symptomText: string) => Promise<void>
  isLoading: boolean
  error?: string | null
}

export default function SymptomForm({ onSubmit, isLoading, error }: SymptomFormProps) {
  const [symptomText, setSymptomText] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(symptomText)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="symptoms">Gejala yang dialami</Label>
        <Textarea
          id="symptoms"
          placeholder="Contoh: Saya mengalami demam tinggi sejak 3 hari yang lalu, disertai sakit kepala dan batuk kering..."
          value={symptomText}
          onChange={(e) => setSymptomText(e.target.value)}
          className="min-h-[150px] resize-none"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          {symptomText.length} / 1000 karakter
        </p>
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
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Menganalisis...
          </>
        ) : (
          "Analisis Gejala"
        )}
      </Button>
    </form>
  )
}