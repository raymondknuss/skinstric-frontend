"use client";

import Link from "next/link";

export default function Phase1Header() {
  return (
    <header className="p1-header">
      <div className="p1-headerLeft">
        <Link className="p1-brand" href="/intro" aria-label="Skinstric Home">
          SKINSTRIC
        </Link>
        <span className="p1-bracket" aria-hidden="true">
          [
        </span>
        <span className="p1-section" aria-label="Section">
          INTRO
        </span>
        <span className="p1-bracket" aria-hidden="true">
          ]
        </span>
      </div>

      <button className="p1-enterCode" type="button" aria-label="Enter code">
        ENTER CODE
      </button>
    </header>
  );
}
