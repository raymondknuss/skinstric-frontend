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
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [devices, setDevices] = useState<VideoDevice[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)

  const [cameraReady, setCameraReady] = useState(false)
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [videoKey, setVideoKey] = useState(0)

  useEffect(() => {
    void initialize()
    return () => {
      stopCamera()
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [])

  async function initialize() {
    try {
      setError(null)

      const list = await navigator.mediaDevices.enumerateDevices()
      const cams = list
        .filter(d => d.kind === "videoinput")
        .map(d => ({ deviceId: d.deviceId, label: d.label || "Camera" }))

      setDevices(cams)
      const id = cams[0]?.deviceId ?? null
      setSelectedDeviceId(id)
      await startCamera(id)
    } catch {
      scheduleCameraError()
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
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current)
          errorTimeoutRef.current = null
        }
        setCameraReady(true)
        setError(null)
      }
    } catch {
      scheduleCameraError()
    }
  }

  function scheduleCameraError() {
    if (errorTimeoutRef.current) return

    errorTimeoutRef.current = setTimeout(() => {
      if (!cameraReady) {
        setError("Unable to start the camera.")
      }
    }, 800)
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
    setError(null)
    onClear()
    await startCamera(selectedDeviceId)
  }

  return (
    <div className="space-y-4">
      {error && !cameraReady && (
        <p className="text-red-600">{error}</p>
      )}

      {!imageDataUrl && (
        <>
          <video
            key={videoKey}
            ref={videoRef}
            className="w-full max-w-md bg-black rounded"
          />
          {!cameraReady && !error && (
            <p className="text-sm text-gray-500">Initializing camera…</p>
          )}
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {imageDataUrl && (
        <img
          src={imageDataUrl}
          className="w-full max-w-md rounded"
        />
      )}

      <div className="flex gap-4">
        {!imageDataUrl && (
          <button
            onClick={handleTakePhoto}
            disabled={!cameraReady}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Take Photo
          </button>
        )}

        {imageDataUrl && (
          <button
            onClick={handleRetake}
            className="px-4 py-2 border rounded"
          >
            Retake
          </button>
        )}
      </div>
    </div>
  )
}
