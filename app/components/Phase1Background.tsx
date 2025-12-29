"use client";

import BackgroundDiamond from "./BackgroundDiamond";

export default function Phase1Background() {
  return (
    <div className="p1-background" aria-hidden="true">
      <BackgroundDiamond side="left" />
      <BackgroundDiamond side="right" />
    </div>
  );
}
