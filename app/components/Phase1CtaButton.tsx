"use client";

import { useMemo, useState } from "react";
import NavDiamondArrow from "@/components/NavDiamondArrow";

type Props = {
  label: string;
  ariaLabel: string;
  align: "left" | "right";
  onClick: () => void;
  path: string;
  onHoverPath?: (pathOrNull: string | null) => void;
};

export default function Phase1CtaButton({
  label,
  ariaLabel,
  align,
  onClick,
  path,
  onHoverPath,
}: Props) {
  const [isHover, setIsHover] = useState(false);

  const rootClass = useMemo(() => {
    const base = align === "left" ? "p1-cta p1-cta-left" : "p1-cta p1-cta-right";
    return isHover ? `${base} p1-cta-hover` : base;
  }, [align, isHover]);

  const direction = align === "left" ? "left" : "right";

  return (
    <button
      className={rootClass}
      type="button"
      aria-label={ariaLabel}
      onMouseEnter={() => {
        setIsHover(true);
        if (onHoverPath) onHoverPath(path);
      }}
      onMouseLeave={() => {
        setIsHover(false);
        if (onHoverPath) onHoverPath(null);
      }}
      onClick={onClick}
    >
      {align === "left" ? (
        <>
          <span className="p1-ctaIcon" aria-hidden="true">
            <NavDiamondArrow direction={direction} className="p1-navDiamondSvg" />
          </span>
          <span className="p1-ctaLabel">{label}</span>
        </>
      ) : (
        <>
          <span className="p1-ctaLabel">{label}</span>
          <span className="p1-ctaIcon" aria-hidden="true">
            <NavDiamondArrow direction={direction} className="p1-navDiamondSvg" />
          </span>
        </>
      )}
    </button>
  );
}
