"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Phase1Header from "@/components/Phase1Header";
import RotatingDottedSquares from "@/components/RotatingDottedSquares";
import ProcessingDots from "@/components/ProcessingDots";
import Phase1BackButton from "@/components/Phase1BackButton";
import Phase1CtaButton from "@/components/Phase1CtaButton";
import "./testing.css";

type SlideState = "name" | "location" | "processing" | "ready";

function isTextOnly(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /^[A-Za-z\s'’-]+$/.test(trimmed);
}

export default function TestingPage() {
  const router = useRouter();

  const [slide, setSlide] = useState<SlideState>("name");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const cityInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (slide === "name") {
      setError(null);
      window.setTimeout(() => nameInputRef.current?.focus(), 0);
    }

    if (slide === "location") {
      setError(null);
      window.setTimeout(() => cityInputRef.current?.focus(), 0);
    }
  }, [slide]);

  useEffect(() => {
    if (slide !== "processing") return;
    const t = window.setTimeout(() => setSlide("ready"), 2200);
    return () => window.clearTimeout(t);
  }, [slide]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent): void {
      if (e.key !== "Enter") return;

      if (slide === "name") {
        e.preventDefault();
        if (!isTextOnly(name)) {
          setName("");
          setError("Please enter a valid name without numbers or special characters");
          return;
        }
        setSlide("location");
        return;
      }

      if (slide === "location") {
        e.preventDefault();
        if (!isTextOnly(city)) {
          setCity("");
          setError("Please enter a valid city without numbers or special characters");
          return;
        }
        setSlide("processing");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [slide, name, city]);

  function goHome(): void {
    router.push("/intro");
  }

  function handleProceed(): void {
    router.push("/upload");
  }

  const centerContent = useMemo<ReactNode>(() => {
    if (slide === "processing") {
      return (
        <div className="p1-processing">
          <div className="p1-processing-title">Processing submission</div>
          <ProcessingDots />
        </div>
      );
    }

    if (slide === "ready") {
      return (
        <div className="p1-ready">
          <div className="p1-ready-title">Thank you!</div>
          <div className="p1-ready-subtitle">Proceed to the next step</div>
        </div>
      );
    }

    const isName = slide === "name";
    const value = isName ? name : city;
    const setValue = isName ? setName : setCity;
    const inputRef = isName ? nameInputRef : cityInputRef;
    const placeholder = isName ? "Introduce yourself" : "your city name";

    return (
      <div className="p1-form">
        <div className="p1-form-label">CLICK TO TYPE</div>

        {error ? <div className="p1-form-error">{error}</div> : null}

        <div className="p1-form-inputWrap">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setError(null);
              setValue(e.target.value);
            }}
            className="p1-form-input"
            placeholder={placeholder}
            aria-label={placeholder}
            spellCheck={false}
            autoComplete="off"
            inputMode="text"
          />
          <div className="p1-form-underline" />
        </div>
      </div>
    );
  }, [slide, name, city, error]);

  const showProceed = slide === "ready";

  return (
    <main className="p1-page">
      <Phase1Header />

      <section className="p1-testing">
        <RotatingDottedSquares />

        <div className="p1-testing-center">{centerContent}</div>

        <div className="p1-testing-bottomLeft">
          <Phase1BackButton
            label="BACK"
            onClick={goHome}
            path="/intro"
            onHoverPath={setHoveredPath}
          />
        </div>

        <div className={showProceed ? "p1-testing-bottomRight p1-proceed-in" : "p1-testing-bottomRight"}>
          {showProceed ? (
            <Phase1CtaButton
              label="PROCEED"
              ariaLabel="Proceed"
              align="right"
              onClick={handleProceed}
              path="/upload"
              onHoverPath={setHoveredPath}
            />
          ) : null}
        </div>

        <div className="p1-testing-pathPreview" aria-live="polite">
          {hoveredPath ?? ""}
        </div>
      </section>
    </main>
  );
}
