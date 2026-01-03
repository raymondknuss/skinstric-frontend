"use client";

import { useState } from "react";
import NavDiamondArrow from "@/components/NavDiamondArrow";

type Props = {
  label: string;
  onClick: () => void;
  path: string;
  onHoverPath?: (pathOrNull: string | null) => void;
};

export default function Phase1BackButton({ label, onClick, path, onHoverPath }: Props) {
  const [isHover, setIsHover] = useState(false);

  return (
    <button
      type="button"
      className={isHover ? "p1-navBtn p1-navBtn-hover" : "p1-navBtn"}
      onMouseEnter={() => {
        setIsHover(true);
        if (onHoverPath) onHoverPath(path);
      }}
      onMouseLeave={() => {
        setIsHover(false);
        if (onHoverPath) onHoverPath(null);
      }}
      onClick={onClick}
      aria-label={label}
    >
      <span className="p1-navIcon" aria-hidden="true">
        <NavDiamondArrow direction="left" className="p1-navDiamondSvg" />
      </span>
      <span className="p1-navLabel">{label}</span>
    </button>
  );
}
