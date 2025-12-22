"use client"

import { useEffect, useRef, useState } from "react"

type VideoDevice = {
  deviceId: string
  label: string
}

type CameraCaptureProps = {
  onCapture: (dataUrl: string, base64: string) => void
  onClear: () => void
}

export default function CameraCapture({ onCapture, onClear }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [devices, setDevices] = useState<VideoDevice[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)

  const [cameraReady, setCameraReady] = useState(false)
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [videoKey, setVideoKey] = useState(0)

  useEffect(() => {
    void initialize()
    return stopCamera
  }, [])

  async function initialize() {
    try {
      const list = await navigator.mediaDevices.enumerateDevices()
      const cams = list
        .filter(d => d.kind === "videoinput")
        .map(d => ({ deviceId: d.deviceId, label: d.label || "Camera" }))

      setDevices(cams)
      const id = cams[0]?.deviceId ?? null
      setSelectedDeviceId(id)
      await startCamera(id)
    } catch {
      setError("Failed to access camera.")
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraReady(false)
  }

  async function startCamera(deviceId: string | null) {
    stopCamera()
    setVideoKey(k => k + 1)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
        audio: false,
      })

      streamRef.current = stream
      const video = videoRef.current
      if (!video) return

      video.srcObject = stream
      video.playsInline = true
      await video.play()

      if (video.videoWidth > 0) {
        setCameraReady(true)
      }
    } catch {
      setError("Failed to start camera.")
    }
  }

  function handleTakePhoto() {
    if (!cameraReady) return

    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92)
    const base64 = dataUrl.split(",")[1]

    setImageDataUrl(dataUrl)
    stopCamera()
    onCapture(dataUrl, base64)
  }

  async function handleRetake() {
    setImageDataUrl(null)
    onClear()
    await startCamera(selectedDeviceId)
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}

      {!imageDataUrl && (
        <video
          key={videoKey}
          ref={videoRef}
          className="w-full max-w-md bg-black rounded"
        />
      )}

      <canvas ref={canvasRef} className="hidden" />

      {imageDataUrl && (
        <img src={imageDataUrl} className="w-full max-w-md rounded" />
      )}

      <div className="flex gap-4">
        {!imageDataUrl && (
          <button onClick={handleTakePhoto} disabled={!cameraReady}>
            Take Photo
          </button>
        )}

        {imageDataUrl && (
          <button onClick={handleRetake}>
            Retake
          </button>
        )}
      </div>
    </div>
  )
}
