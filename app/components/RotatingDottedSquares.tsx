"use client";

export default function RotatingDottedSquares() {
  return (
    <div className="p1-rotator" aria-hidden="true">
      <div className="p1-square p1-square-a" />
      <div className="p1-square p1-square-b" />
      <div className="p1-square p1-square-c" />
      <div className="p1-square p1-square-d" />
    </div>
  );
}
