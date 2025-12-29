"use client";

type Props = {
  side: "left" | "right";
};

export default function BackgroundDiamond({ side }: Props) {
  return (
    <div
      className={`p1-bgDiamond p1-bgDiamond-${side}`}
      aria-hidden="true"
    >
      <svg
        width="602"
        height="602"
        viewBox="0 0 602 602"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="600"
          height="600"
          fill="none"
          stroke="#1A1B1C"
          strokeWidth="1"
          strokeDasharray="1 10"
          opacity="0.35"
          transform="rotate(45 301 301)"
        />
      </svg>
    </div>
  );
}
