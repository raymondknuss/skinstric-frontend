"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Phase1Header from "../components/Phase1Header";
import Phase1BackButton from "../components/Phase1BackButton";
import NavDiamondArrow from "@/components/NavDiamondArrow";

type HoverTarget = "demographics" | "cosmetic" | "skin" | "weather" | null;

export default function ResultsPage() {
  const router = useRouter();

  const [hovered, setHovered] = useState<HoverTarget>(null);
  const [isSummaryHover, setIsSummaryHover] = useState(false);

  const enterDemographics = () => {
    router.push("/results/demographics");
  };

  const bgSize = useMemo(() => {
    if (hovered === "demographics") return 460;
    if (hovered === "cosmetic" || hovered === "skin") return 560;
    if (hovered === "weather") return 680;
    return 0;
  }, [hovered]);

  const stageSize = 520;
  const diamondSize = 190;
  const gap = 14;

  const center = stageSize / 2;
  const offset = diamondSize / 2 + gap;

  const diamondBase: React.CSSProperties = {
    width: `${diamondSize}px`,
    height: `${diamondSize}px`,
    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    fontWeight: 700,
    fontSize: "13px",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    userSelect: "none",
  };

  return (
    <>
      <Phase1Header />

      <main
        style={{
          height: "100vh",
          overflow: "hidden",
          position: "relative",
          padding: "0 3rem",
        }}
      >
        <div style={{ paddingTop: "4.5rem" }}>
          <h1 style={{ margin: 0 }}>A.I. Analysis</h1>
          <p style={{ marginTop: "22px", marginBottom: 0 }}>
            A.I. has estimated the following.
          </p>
          <p style={{ marginTop: "18px", marginBottom: 0 }}>
            Fix estimated information if needed.
          </p>
        </div>

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: `${stageSize}px`,
              height: `${stageSize}px`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: `${bgSize}px`,
                height: `${bgSize}px`,
                border: "2px dotted #cfcfcf",
                transform: "translate(-50%, -50%) rotate(45deg)",
                opacity: hovered ? 1 : 0,
                transition: "opacity 140ms ease",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                left: `${center}px`,
                top: `${center - offset}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                style={{
                  ...diamondBase,
                  background:
                    hovered === "demographics" ? "#d6d6d6" : "#e1e1e1",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHovered("demographics")}
                onMouseLeave={() => setHovered(null)}
                onClick={enterDemographics}
              >
                DEMOGRAPHICS
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                left: `${center - offset}px`,
                top: `${center}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                style={{
                  ...diamondBase,
                  background:
                    hovered === "cosmetic" ? "#d6d6d6" : "#f2f2f2",
                  cursor: "not-allowed",
                }}
                onMouseEnter={() => setHovered("cosmetic")}
                onMouseLeave={() => setHovered(null)}
              >
                COSMETIC
                <br />
                CONCERNS
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                left: `${center + offset}px`,
                top: `${center}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                style={{
                  ...diamondBase,
                  background: hovered === "skin" ? "#d6d6d6" : "#f2f2f2",
                  cursor: "not-allowed",
                }}
                onMouseEnter={() => setHovered("skin")}
                onMouseLeave={() => setHovered(null)}
              >
                SKIN TYPE DETAILS
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                left: `${center}px`,
                top: `${center + offset}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                style={{
                  ...diamondBase,
                  background: hovered === "weather" ? "#d6d6d6" : "#f2f2f2",
                  cursor: "not-allowed",
                }}
                onMouseEnter={() => setHovered("weather")}
                onMouseLeave={() => setHovered(null)}
              >
                WEATHER
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: "fixed", bottom: "2.2rem", left: "2.2rem" }}>
          <Phase1BackButton
            label="BACK"
            path="/upload"
            onClick={() => router.push("/upload")}
          />
        </div>

        <div style={{ position: "fixed", bottom: "2.2rem", right: "2.2rem" }}>
          <button
            type="button"
            className={isSummaryHover ? "p1-navBtn p1-navBtn-hover" : "p1-navBtn"}
            onMouseEnter={() => setIsSummaryHover(true)}
            onMouseLeave={() => setIsSummaryHover(false)}
            onClick={enterDemographics}
            aria-label="GET SUMMARY"
          >
            <span className="p1-navLabel">GET SUMMARY</span>
            <span className="p1-navIcon" aria-hidden="true">
              <NavDiamondArrow direction="right" className="p1-navDiamondSvg" />
            </span>
          </button>
        </div>
      </main>
    </>
  );
}
