"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import Phase1Header from "../components/Phase1Header"
import Phase1BackButton from "../components/Phase1BackButton"
import RotatingDottedSquares from "../components/RotatingDottedSquares"
import ProcessingDots from "../components/ProcessingDots"

import "./upload.css"

import { submitPhaseTwoImage } from "../services/phaseTwo"

type UploadState = "idle" | "preparing" | "success"

type CSSVars = React.CSSProperties & {
  ["--upload-scale"]?: string
}

export default function UploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [state, setState] = useState<UploadState>("idle")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [scale, setScale] = useState<number>(1)

  useEffect(() => {
    function computeScale() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const sx = vw / 1920
      const sy = vh / 960
      const s = Math.min(sx, sy)
      setScale(Math.max(0.45, Math.min(1, s)))
    }

    computeScale()
    window.addEventListener("resize", computeScale)
    return () => window.removeEventListener("resize", computeScale)
  }, [])

  function handleGalleryClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const result = reader.result as string
      const parts = result.split(",")
      const base64 = parts.length > 1 ? parts[1] : ""

      setPreviewUrl(result)
      setState("preparing")

      try {
        await submitPhaseTwoImage(base64)
        setState("success")
      } catch {
        setState("idle")
        setPreviewUrl(null)
      }
    }

    reader.readAsDataURL(file)
  }

  function handleSuccessConfirm() {
    router.push("/results")
  }

  const rootStyle: CSSVars = {
    ["--upload-scale"]: String(scale),
  }

  return (
    <div className="upload-root" style={rootStyle}>
      <Phase1Header />

      <div className="upload-stage">
        <div
          className="upload-zone upload-zone-camera"
          onClick={() => router.push("/upload/CameraCapture")}
        >
          <div className="upload-squares">
            <RotatingDottedSquares />
          </div>
          <div className="upload-icon camera" />
          <div className="upload-label">
            ALLOW A.I.
            <br />
            TO SCAN YOUR FACE
          </div>
          <div className="upload-connector upload-connector-camera" />
          <div className="upload-connector-dot upload-connector-dot-camera" />
        </div>

        <div
          className="upload-zone upload-zone-gallery"
          onClick={handleGalleryClick}
        >
          <div className="upload-squares">
            <RotatingDottedSquares />
          </div>
          <div className="upload-icon gallery" />
          <div className="upload-label">
            ALLOW A.I.
            <br />
            ACCESS GALLERY
          </div>
          <div className="upload-connector upload-connector-gallery" />
          <div className="upload-connector-dot upload-connector-dot-gallery" />
        </div>

        <div className="upload-preview">
          <div className="preview-title">Preview</div>
          <div className="preview-box">
            {previewUrl ? <img src={previewUrl} alt="Preview" /> : null}
          </div>
        </div>

        <div className="upload-back">
          <Phase1BackButton
            label="BACK"
            path="/testing"
            onClick={() => router.push("/testing")}
          />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="upload-hidden-input"
        onChange={handleFileChange}
      />

      {state === "preparing" ? (
        <div className="upload-overlay">
          <div className="upload-processing">
            <div className="processing-text">
              PREPARING YOUR ANALYSIS...
            </div>
            <ProcessingDots />
          </div>
        </div>
      ) : null}

      {state === "success" ? (
        <div className="upload-overlay">
          <div className="upload-success">
            <div>Image analyzed successfully!</div>
            <button className="upload-ok" onClick={handleSuccessConfirm}>
              OK
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
