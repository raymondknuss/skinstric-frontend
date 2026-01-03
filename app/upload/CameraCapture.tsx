"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Phase1Header from "../components/Phase1Header"
import "./cameraCapture.css"

type CameraState = "idle" | "live" | "captured" | "analyzing" | "error"

type CameraCaptureProps = {
  onBack: () => void
  onReady?: () => void
  onCaptureConfirmed: (dataUrl: string, base64: string) => Promise<void>
}

function TakePictureSvg() {
  return (
    <svg
      className="cc-takeSvg"
      width="62"
      height="62"
      viewBox="0 0 62 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="31" cy="31" r="30" stroke="#FCFCFC" strokeWidth="2" />
      <circle cx="31" cy="31" r="27.5" fill="#FCFCFC" />
      <path
        d="M27.2 24.3C26.7 24.5 25.4 25.6 25 26.1C24.9 26.2 24.7 26.3 23.8 26.3C21.3 26.3 20 27 19.2 28.7L18.9 29.4V34.6C18.9 39.2 19 39.8 19.2 40.2C19.7 41.5 20.7 42.3 22 42.6C22.9 42.9 39 42.9 39.9 42.6C40.8 42.3 41.6 41.8 42.1 41.1C42.9 40 42.9 40 42.9 34.5V29.4L42.5 28.7C42.1 27.8 41.1 26.9 40.2 26.6C39.8 26.5 39.1 26.4 38.2 26.3L36.8 26.3L35.9 25.5C35.4 25.1 34.9 24.6 34.7 24.5C34.2 24.3 27.9 24.1 27.2 24.3ZM33.8 33.2C33.8 35.2 32.2 36.8 30.2 36.8C28.2 36.8 26.6 35.2 26.6 33.2C26.6 31.2 28.2 29.6 30.2 29.6C32.2 29.6 33.8 31.2 33.8 33.2Z"
        fill="#A0A4AB"
      />
    </svg>
  )
}

function BackIconSvg() {
  return (
    <svg
      className="cc-backSvg"
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M43.293 22L22 43.293L0.707031 22L22 0.707031L43.293 22Z" />
      <path d="M15.7148 22L25.1434 27.4436V16.5564L15.7148 22Z" />
    </svg>
  )
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export default function CameraCapture({
  onBack,
  onReady,
  onCaptureConfirmed,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [status, setStatus] = useState<CameraState>("idle")
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null)

  const instructions = useMemo(() => {
    return {
      title: "TO GET BETTER RESULTS MAKE SURE TO HAVE",
      bullets: ["NEUTRAL EXPRESSION", "FRONTAL POSE", "ADEQUATE LIGHTING"],
      back: "BACK",
      take: "TAKE PICTURE",
      greatShot: "GREAT SHOT!",
      preview: "PREVIEW",
      retake: "RETAKE",
      useThisPhoto: "USE THIS PHOTO",
      uploading: "UPLOADING...",
      analyzing: "ANALYZING IMAGE...",
    }
  }, [])

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })

      streamRef.current = stream

      const v = videoRef.current
      if (v) {
        v.srcObject = stream
        await v.play()
      }

      setStatus("live")

      const videoEl = videoRef.current
      if (onReady && videoEl) {
        let rafId = 0
        const start = performance.now()

        const checkReady = () => {
          const hasDims = videoEl.videoWidth > 0 && videoEl.videoHeight > 0
          const hasData = videoEl.readyState >= 2
          if (hasDims && hasData) {
            onReady()
            return
          }

          if (performance.now() - start > 5000) {
            onReady()
            return
          }

          rafId = window.requestAnimationFrame(checkReady)
        }

        rafId = window.requestAnimationFrame(checkReady)

        return () => {
          if (rafId) window.cancelAnimationFrame(rafId)
        }
      }
    } catch {
      setStatus("error")
    }
  }

  useEffect(() => {
    let cleanupRaf: (() => void) | undefined

    const run = async () => {
      const maybeCleanup = await startCamera()
      if (typeof maybeCleanup === "function") cleanupRaf = maybeCleanup
    }

    void run()

    return () => {
      if (cleanupRaf) cleanupRaf()
      const s = streamRef.current
      if (s) s.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [])

  function captureFrame() {
    const v = videoRef.current
    const c = canvasRef.current
    if (!v || !c) return

    const vw = v.videoWidth
    const vh = v.videoHeight
    if (!vw || !vh) return

    c.width = vw
    c.height = vh

    const ctx = c.getContext("2d")
    if (!ctx) return

    ctx.drawImage(v, 0, 0, vw, vh)

    const url = c.toDataURL("image/jpeg", 0.92)
    setCapturedDataUrl(url)
    setStatus("captured")
  }

  function retake() {
    if (status === "analyzing") return
    setCapturedDataUrl(null)
    setStatus("live")
  }

  async function usePhoto() {
    if (!capturedDataUrl) return
    if (status === "analyzing") return

    setStatus("analyzing")
    await sleep(120)

    const base64 = capturedDataUrl.split(",")[1] ?? ""
    try {
      await onCaptureConfirmed(capturedDataUrl, base64)
    } catch {
      setStatus("captured")
    }
  }

  const disableActions = status === "analyzing"
  const isDarkMode = status === "live" || status === "captured" || status === "analyzing"
  const rootClass = `cc-root ${isDarkMode ? "cc-rootDark" : "cc-rootLight"}`

  return (
    <div className={rootClass}>
      <div className="cc-headerBand">
        <Phase1Header />
      </div>

      <div className="cc-stage">
        <div className="cc-videoWrap" aria-label="Camera capture">
          <video ref={videoRef} className="cc-video" playsInline muted autoPlay />
          <canvas ref={canvasRef} className="cc-canvas" />

          <button
            className="cc-back"
            type="button"
            onClick={onBack}
            disabled={disableActions}
          >
            <BackIconSvg />
            <span className="cc-backText">{instructions.back}</span>
          </button>

          {status === "live" ? (
            <>
              <div className="cc-instructions">
                <div className="cc-instructionsTitle">{instructions.title}</div>
                <div className="cc-instructionsRow">
                  <span className="cc-diamond" />
                  <span className="cc-bullet">{instructions.bullets[0]}</span>
                  <span className="cc-diamond" />
                  <span className="cc-bullet">{instructions.bullets[1]}</span>
                  <span className="cc-diamond" />
                  <span className="cc-bullet">{instructions.bullets[2]}</span>
                </div>
              </div>

              <button
                className="cc-take"
                type="button"
                onClick={captureFrame}
                aria-label={instructions.take}
              >
                <span className="cc-takeLabel">{instructions.take}</span>
                <TakePictureSvg />
              </button>
            </>
          ) : null}

          {status === "captured" || status === "analyzing" ? (
            <>
              {capturedDataUrl ? (
                <img
                  className="cc-capturedImg"
                  src={capturedDataUrl}
                  alt="Captured"
                />
              ) : null}

              <div className="cc-capturedOverlay">
                <div className="cc-greatShot">{instructions.greatShot}</div>
                <div className="cc-previewLabel">{instructions.preview}</div>

                <div className="cc-actions">
                  <button
                    className="cc-btn cc-btnRetake"
                    type="button"
                    onClick={retake}
                    disabled={status === "analyzing"}
                  >
                    {instructions.retake}
                  </button>
                  <button
                    className="cc-btn cc-btnUse"
                    type="button"
                    onClick={usePhoto}
                    disabled={status === "analyzing"}
                  >
                    {status === "analyzing"
                      ? instructions.uploading
                      : instructions.useThisPhoto}
                  </button>
                </div>
              </div>

              {status === "analyzing" ? (
                <div className="cc-analyzingOverlay" role="status" aria-live="polite">
                  <div className="cc-analyzingCard">
                    <div className="cc-analyzingTitle">
                      {instructions.analyzing}
                    </div>
                    <div className="cc-dots">
                      <span className="cc-dot" />
                      <span className="cc-dot" />
                      <span className="cc-dot" />
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
