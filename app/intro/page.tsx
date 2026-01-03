"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./intro.module.css";
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
      className={styles.p1Cta}
      type="button"
      aria-label={label}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onClick={onClick}
    >
      {align === "left" ? (
        <>
          <NavDiamondArrow direction="left" className={styles.p1DiamondIcon} />
          <span className={styles.p1CtaLabel}>{label}</span>
        </>
      ) : (
        <>
          <span className={styles.p1CtaLabel}>{label}</span>
          <NavDiamondArrow direction="right" className={styles.p1DiamondIcon} />
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
      ? `${styles.p1Slide1} ${styles.p1StateLeft}`
      : state === "right"
      ? `${styles.p1Slide1} ${styles.p1StateRight}`
      : `${styles.p1Slide1} ${styles.p1StateNone}`;

  return (
    <main className={rootClass}>
      <Phase1Header />

      <div className={styles.p1Bg} aria-hidden="true" />

      <section className={styles.p1Canvas}>
        <div className={styles.p1LeftCta}>
          <DiamondButton
            label="DISCOVER A.I."
            align="left"
            onHoverStart={() => setState("left")}
            onHoverEnd={() => setState("none")}
          />
        </div>

        <div className={styles.p1RightCta}>
          <DiamondButton
            label="TAKE TEST"
            align="right"
            onHoverStart={() => setState("right")}
            onHoverEnd={() => setState("none")}
            onClick={() => router.push("/testing")}
          />
        </div>

        <div className={styles.p1HeroWrap}>
          <h1 className={styles.p1Hero}>
            <span className={styles.p1HeroLine}>Sophisticated</span>
            <span className={styles.p1HeroLine}>skincare</span>
          </h1>
        </div>

        <footer className={styles.p1Footer}>
          <p className={styles.p1FooterText}>
            <span>SKINSTRIC DEVELOPED AN A.I. THAT CREATES</span>
            <span>A HIGHLY-PERSONALISED ROUTINE TAILORED TO</span>
            <span>WHAT YOUR SKIN NEEDS.</span>
          </p>
        </footer>
      </section>
    </main>
  );
}
