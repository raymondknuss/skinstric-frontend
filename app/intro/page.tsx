"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./intro.css";
import Phase1Header from "@/components/Phase1Header";
import NavDiamondArrow from "@/components/NavDiamondArrow";

type Align = "left" | "right";

type DiamondButtonProps = {
  label: string;
  align: Align;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick?: () => void;
};

function DiamondButton({ label, align, onHoverStart, onHoverEnd, onClick }: DiamondButtonProps) {
  return (
    <button
      className="p1-cta"
      type="button"
      aria-label={label}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
    >
      {align === "left" ? (
        <>
          <NavDiamondArrow direction="left" className="p1-diamondIcon" />
          <span className="p1-ctaLabel">{label}</span>
        </>
      ) : (
        <>
          <span className="p1-ctaLabel">{label}</span>
          <NavDiamondArrow direction="right" className="p1-diamondIcon" />
        </>
      )}
    </button>
  );
}

export default function Page() {
  const router = useRouter();
  const [state, setState] = useState<"none" | "left" | "right">("none");

  const rootClass =
    state === "left"
      ? "p1-slide1 p1-state-left"
      : state === "right"
      ? "p1-slide1 p1-state-right"
      : "p1-slide1 p1-state-none";

  return (
    <main className={rootClass}>
      <Phase1Header />

      <div className="p1-bg" aria-hidden="true" />

      <section className="p1-canvas">
        <div className="p1-leftCta">
          <DiamondButton
            label="DISCOVER A.I."
            align="left"
            onHoverStart={() => setState("left")}
            onHoverEnd={() => setState("none")}
          />
        </div>

        <div className="p1-rightCta">
          <DiamondButton
            label="TAKE TEST"
            align="right"
            onHoverStart={() => setState("right")}
            onHoverEnd={() => setState("none")}
            onClick={() => router.push("/testing")}
          />
        </div>

        <div className="p1-heroWrap">
          <h1 className="p1-hero">
            <span className="p1-heroLine">Sophisticated</span>
            <span className="p1-heroLine">skincare</span>
          </h1>
        </div>

        <footer className="p1-footer">
          <p className="p1-footerText">
            <span>SKINSTRIC DEVELOPED AN A.I. THAT CREATES</span>
            <span>A HIGHLY-PERSONALISED ROUTINE TAILORED TO</span>
            <span>WHAT YOUR SKIN NEEDS.</span>
          </p>
        </footer>
      </section>
    </main>
  );
}
