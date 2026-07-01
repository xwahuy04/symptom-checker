"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "../ui/alert"

const BRAND_PRIMARY = "#22668A"

interface SymptomFormProps {
  onSubmit: (symptomText: string) => Promise<void>
  isLoading: boolean
  error?: string | null
}

export default function SymptomForm({ onSubmit, isLoading, error }: SymptomFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const symptomText = formData.get("symptoms") as string
    await onSubmit(symptomText)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="symptoms">Gejala yang dialami</Label>
        <Textarea
          id="symptoms"
          name="symptoms"
          placeholder="Contoh: Saya mengalami demam tinggi sejak 3 hari yang lalu, disertai sakit kepala dan batuk kering..."
          className="min-h-[150px] resize-none"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Minimal 10 karakter, maksimal 1000 karakter
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
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