// src/components/profile/ProfileForm.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle } from "lucide-react"

const BRAND_PRIMARY = "#22668A"

interface ProfileFormProps {
  usia: number
  jenis_kelamin: string
  onUpdate: (data: { usia: number; jenis_kelamin: string }) => Promise<void>
}

export default function ProfileForm({ usia, jenis_kelamin, onUpdate }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    usia: usia.toString(),
    jenis_kelamin: jenis_kelamin,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const usiaNum = Number(formData.usia)
    if (isNaN(usiaNum) || usiaNum < 0 || usiaNum > 120) {
      setError("Usia harus antara 0-120 tahun")
      return
    }

    const validGenders = ["laki-laki", "perempuan", "lainnya"]
    if (!validGenders.includes(formData.jenis_kelamin)) {
      setError("Jenis kelamin tidak valid")
      return
    }

    setIsLoading(true)

    try {
      await onUpdate({
        usia: usiaNum,
        jenis_kelamin: formData.jenis_kelamin,
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal update profil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Profil</CardTitle>
        <CardDescription>Update data profil Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Profil berhasil diupdate!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="usia">Usia</Label>
            <Input
              id="usia"
              type="number"
              min={0}
              max={120}
              value={formData.usia}
              onChange={(e) => setFormData({ ...formData, usia: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
            <Input
              id="jenis_kelamin"
              type="text"
              list="jenis-kelamin-options"
              value={formData.jenis_kelamin}
              onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
              disabled={isLoading}
            />
            <datalist id="jenis-kelamin-options">
              <option value="laki-laki" />
              <option value="perempuan" />
              <option value="lainnya" />
            </datalist>
          </div>

          <Button
            type="submit"
            className="w-full text-white"
            style={{ backgroundColor: BRAND_PRIMARY }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}