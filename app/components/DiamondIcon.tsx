"use client";

type Props = {
  direction: "left" | "right";
};

export default function DiamondIcon({ direction }: Props) {
  const arrowPoints =
    direction === "left"
      ? "28.29 16.56 18.86 22 28.29 27.45"
      : "15.71 16.56 25.14 22 15.71 27.45";

  return (
    <svg
      className="p1-diamondIcon"
      width="44"
      height="44"
      viewBox="0 0 44 44"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        points="22 0 44 22 22 44 0 22"
        fill="none"
        stroke="#1A1B1C"
        strokeWidth="1"
      />

      <polygon
        points="22 0 44 22 22 44 0 22"
        fill="none"
        stroke="#1A1B1C"
        strokeWidth="1"
        opacity="0.35"
      />

      <polygon
        points="22 4.715 39.285 22 22 39.285 4.715 22"
        fill="none"
        stroke="#1A1B1C"
        strokeWidth="1"
        strokeDasharray="1 4"
      />

      <polygon points={arrowPoints} fill="#1A1B1C" />
    </svg>
  );
}
