"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import Phase1Header from "../components/Phase1Header"
import Phase1BackButton from "../components/Phase1BackButton"
import RotatingDottedSquares from "../components/RotatingDottedSquares"
import ProcessingDots from "../components/ProcessingDots"
import CameraCapture from "./CameraCapture"

import "./upload.css"
import { submitPhaseTwoImage } from "../services/phaseTwo"

type UploadState = "idle" | "preparing" | "success"
type UploadMode = "select" | "camera"
type OverlayState = "none" | "permission" | "booting"

type CSSVars = React.CSSProperties & {
  ["--upload-scale"]?: string
}

function PermissionOverlay({
  state,
  onAllow,
  onDeny,
}: {
  state: OverlayState
  onAllow: () => void
  onDeny: () => void
}) {
  if (state === "none") return null

  if (state === "booting") {
    return (
      <div className="upload-cameraOverlay" role="status" aria-live="polite">
        <div className="upload-cameraBootCard">
          <div className="upload-cameraBootCenter">
            <div className="upload-cameraBootIcon">
              <svg
                width="740"
                height="740"
                viewBox="0 0 740 740"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="369.893" cy="369.892" r="64.6429" stroke="#1A1B1C" />
                <circle cx="369.893" cy="369.892" r="57" fill="#1A1B1C" />
                <path
                  d="M406.403 333.47C397.067 324.111 384.156 318.32 369.892 318.32C366.591 318.32 363.363 318.631 360.234 319.223C365.57 328.051 385.069 359.001 388.825 364.505C389.554 365.575 390.851 363.451 398.702 348.314L406.403 333.47Z"
                  fill="#FCFCFC"
                />
                <path
                  d="M321.931 350.897C328.071 335.408 341.496 323.601 357.979 319.703C359.93 322.63 363.657 328.413 367.731 334.853L378.08 351.217H348.529C334.268 351.217 325.933 351.124 321.931 350.897Z"
                  fill="#FCFCFC"
                />
                <path
                  d="M329.51 401.972C322.505 393.167 318.32 382.018 318.32 369.892C318.32 364.081 319.281 358.495 321.053 353.284H337.666C357.097 353.284 357.539 353.314 356.845 354.613C355.469 357.189 335.048 392.538 329.51 401.972Z"
                  fill="#FCFCFC"
                />
                <path
                  d="M379.91 420.491C376.67 421.129 373.32 421.463 369.892 421.463C354.459 421.463 340.609 414.684 331.158 403.941C333.2 399.404 338.519 389.934 347.73 374.376C348.597 372.911 349.475 371.883 349.681 372.089C349.887 372.295 357.154 383.885 365.831 397.842L379.91 420.491Z"
                  fill="#FCFCFC"
                />
                <path
                  d="M418.542 387.046C412.778 403.392 399.01 415.961 381.944 420.047C377.244 412.798 361.635 387.726 361.635 387.338C361.635 387.177 375.124 387.046 391.61 387.046H418.542Z"
                  fill="#FCFCFC"
                />
                <path
                  d="M407.781 334.906C416.274 344.099 421.463 356.389 421.463 369.892C421.463 375.394 420.601 380.695 419.006 385.668H401.852C390.707 385.668 381.588 385.5 381.588 385.294C381.588 384.868 403.909 341.968 407.781 334.906Z"
                  fill="#FCFCFC"
                />
                <path
                  opacity="0.3"
                  d="M291.725 78.1674L661.617 291.725L448.059 661.617L78.1674 448.06L291.725 78.1674Z"
                  stroke="#A0A4AB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="0.1 8"
                />
                <path
                  opacity="0.6"
                  d="M369.893 120.892L618.893 369.892L369.893 618.892L120.893 369.892L369.893 120.892Z"
                  stroke="#A0A4AB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="0.1 8"
                />
                <path
                  d="M422.326 174.204L565.579 422.326L317.458 565.579L174.204 317.458L422.326 174.204Z"
                  stroke="#A0A4AB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="0.1 8"
                />
              </svg>
            </div>

            <div className="upload-cameraBootText">
              SETTING UP CAMERA ...
            </div>

            <div className="upload-cameraBootInstructions">
              <img
                src="/icons/camera-instructions.svg"
                alt="Camera positioning instructions"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="upload-cameraOverlay" role="dialog" aria-modal="true">
      <div className="upload-permissionCard" aria-label="Camera permission">
        <div className="upload-permissionTitle">
          ALLOW A.I. TO ACCESS YOUR CAMERA
        </div>
        <div className="upload-permissionDivider" aria-hidden="true" />
        <div className="upload-permissionActions">
          <button
            className="upload-permissionBtn upload-permissionDeny"
            type="button"
            onClick={onDeny}
          >
            DENY
          </button>
          <button
            className="upload-permissionBtn upload-permissionAllow"
            type="button"
            onClick={onAllow}
          >
            ALLOW
          </button>
        </div>
      </div>
    </div>
  )
}

export default function UploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [mode, setMode] = useState<UploadMode>("select")
  const [overlay, setOverlay] = useState<OverlayState>("none")
  const [state, setState] = useState<UploadState>("idle")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [scale, setScale] = useState<number | null>(null)

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

  function openPermission() {
    setOverlay("permission")
  }

  function denyPermission() {
    setOverlay("none")
  }

  function allowPermission() {
    setOverlay("booting")
    setMode("camera")
  }

  if (mode === "camera") {
    return (
      <>
        <CameraCapture
          onBack={() => {
            setOverlay("none")
            setMode("select")
          }}
          onReady={() => {
            setOverlay("none")
          }}
          onCaptureConfirmed={async (_dataUrl, base64) => {
            await submitPhaseTwoImage(base64)
            router.push("/results")
          }}
        />

        <PermissionOverlay
          state={overlay}
          onAllow={() => {}}
          onDeny={() => {}}
        />
      </>
    )
  }

  if (scale === null) {
    return null
  }

  const rootStyle: CSSVars = {
    ["--upload-scale"]: String(scale),
  }

  return (
    <div className="upload-root" style={rootStyle}>
      <Phase1Header />

      <div className="upload-stage">
        <div className="upload-zone upload-zone-camera">
          <div className="upload-squares">
            <RotatingDottedSquares />
          </div>

          <div
            className="upload-icon camera"
            onClick={openPermission}
            role="button"
            aria-label="Allow A.I. to scan your face"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                openPermission()
              }
            }}
          />

          <div className="upload-label">
            ALLOW A.I.
            <br />
            TO SCAN YOUR FACE
          </div>

          <div className="upload-connector upload-connector-camera" />
          <div className="upload-connector-dot upload-connector-dot-camera" />
        </div>

        <div className="upload-zone upload-zone-gallery">
          <div className="upload-squares">
            <RotatingDottedSquares />
          </div>

          <div
            className="upload-icon gallery"
            onClick={handleGalleryClick}
            role="button"
            aria-label="Allow A.I. access gallery"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleGalleryClick()
              }
            }}
          />

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

      <PermissionOverlay
        state={overlay}
        onAllow={allowPermission}
        onDeny={denyPermission}
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
            <button
              className="upload-ok"
              onClick={() => router.push("/results")}
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
