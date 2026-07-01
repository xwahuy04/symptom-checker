// src/components/analysis/AnalysisCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { AnalysisCondition } from "@/types/database"

type UrgencyLevel = "RINGAN" | "SEDANG" | "DARURAT"

interface AnalysisCardProps {
  conditions: AnalysisCondition[]
  urgency: UrgencyLevel
  recommendation: string
  disclaimer: string
}

export default function AnalysisCard({
  conditions,
  urgency,
  recommendation,
  disclaimer,
}: AnalysisCardProps) {
  const getUrgencyColor = (level: UrgencyLevel) => {
    switch (level) {
      case "RINGAN":
        return "bg-green-100 text-green-800"
      case "SEDANG":
        return "bg-yellow-100 text-yellow-800"
      case "DARURAT":
        return "bg-red-100 text-red-800"
    }
  }

  const getUrgencyLabel = (level: UrgencyLevel) => {
    switch (level) {
      case "RINGAN":
        return "Ringan"
      case "SEDANG":
        return "Sedang"
      case "DARURAT":
        return "Darurat — Segera Bertindak!"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hasil Analisis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Urgency Badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Tingkat Urgensi:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getUrgencyColor(urgency)}`}>
            {getUrgencyLabel(urgency)}
          </span>
        </div>

        {/* Conditions */}
        <div>
          <h3 className="font-semibold mb-2">Kemungkinan Kondisi:</h3>
          <ul className="space-y-2">
            {conditions.map((condition, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">{condition.name}</span>
                <span className="text-sm text-gray-600">{condition.confidence}%</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendation */}
        <div>
          <h3 className="font-semibold mb-2">Rekomendasi:</h3>
          <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{recommendation}</p>
        </div>

        {/* Disclaimer */}
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 text-sm">
            {disclaimer}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}