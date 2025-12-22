"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CameraCapture from "./CameraCapture"
import { submitPhaseTwoImage } from "../services/phaseTwo"

type Mode = "file" | "camera"

export default function UploadPage() {
  const router = useRouter()

  const [mode, setMode] = useState<Mode>("file")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [base64Image, setBase64Image] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function resetAll() {
    setPreviewUrl(null)
    setBase64Image(null)
    setError(null)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    resetAll()
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreviewUrl(result)
      setBase64Image(result.split(",")[1])
    }
    reader.readAsDataURL(file)
  }

  async function handleProceed() {
    if (!base64Image) return
    setLoading(true)

    try {
      const res = await submitPhaseTwoImage(base64Image)
      localStorage.setItem("phase2_results", JSON.stringify(res))
      router.push("/results")
    } catch {
      setError("Analysis failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Upload Your Image</h1>

      <div className="flex gap-4">
        <button
          onClick={() => {
            setMode("file")
            resetAll()
          }}
        >
          Upload File
        </button>

        <button
          onClick={() => {
            setMode("camera")
            resetAll()
          }}
        >
          Take Selfie
        </button>
      </div>

      {mode === "file" && (
        <>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewUrl && <img src={previewUrl} className="rounded" />}
        </>
      )}

      {mode === "camera" && (
        <CameraCapture
          onCapture={(url, base64) => {
            setPreviewUrl(url)
            setBase64Image(base64)
          }}
          onClear={resetAll}
        />
      )}

      {error && <p className="text-red-600">{error}</p>}

      <button
        onClick={handleProceed}
        disabled={!base64Image || loading}
        className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Proceed"}
      </button>
    </div>
  )
}
