"use client";

type Props = {
  direction: "left" | "right";
  className?: string;
};

export default function NavDiamondArrow({ direction, className }: Props) {
  const rotate = direction === "right" ? "rotate(180deg)" : "none";

  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ transform: rotate, transformOrigin: "50% 50%" }}
    >
      <path d="M43.293 22L22 43.293L0.707031 22L22 0.707031L43.293 22Z" stroke="#1A1B1C" />
      <path d="M15.7139 22L25.1424 27.4436V16.5564L15.7139 22Z" fill="#1A1B1C" />
    </svg>
  );
}
