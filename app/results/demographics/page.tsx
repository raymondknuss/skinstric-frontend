"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Phase1Header from "@/components/Phase1Header";
import NavDiamondArrow from "@/components/NavDiamondArrow";
import styles from "./Demographics.module.css";

type Section = "race" | "age" | "sex";
type Distribution = Record<string, number>;

type PhaseTwoData = {
  race: Distribution;
  age: Distribution;
  gender: Distribution;
};

type PhaseTwoResponse = {
  success: boolean;
  message: string;
  data: PhaseTwoData;
};

type Item = {
  label: string;
  percentage: number;
};

type SelectedBySection = {
  race: string | null;
  age: string | null;
  sex: string | null;
};

function formatDistribution(dist: Distribution): Item[] {
  return Object.entries(dist)
    .map(([label, value]) => ({
      label,
      percentage: Math.round(value * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

function titleCase(v: string) {
  return v
    .split(" ")
    .filter(Boolean)
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export default function Demographics() {
  const router = useRouter();

  const [data, setData] = useState<PhaseTwoData | null>(null);
  const [section, setSection] = useState<Section>("race");

  const [selectedBySection, setSelectedBySection] =
    useState<SelectedBySection>({
      race: null,
      age: null,
      sex: null,
    });

  const [hoverLeft, setHoverLeft] = useState<Section | null>(null);
  const [hoverRight, setHoverRight] = useState<string | null>(null);

  const [isBackHover, setIsBackHover] = useState(false);
  const [isHomeHover, setIsHomeHover] = useState(false);

  const ringPrimed = useRef(false);
  const [ringPct, setRingPct] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("phase2_results");
    if (!stored) return;

    try {
      const parsed: PhaseTwoResponse = JSON.parse(stored);
      if (parsed.success && parsed.data) setData(parsed.data);
    } catch {}
  }, []);

  const race = useMemo(
    () => (data ? formatDistribution(data.race) : []),
    [data]
  );

  const age = useMemo(
    () => (data ? formatDistribution(data.age) : []),
    [data]
  );

  const sex = useMemo(
    () => (data ? formatDistribution(data.gender) : []),
    [data]
  );

  const list = useMemo(() => {
    if (!data) return [];
    if (section === "race") return race;
    if (section === "age") return age;
    return sex;
  }, [data, section, race, age, sex]);

  const selectedForSection = selectedBySection[section];

  const active = useMemo(() => {
    if (!list.length) return null;
    if (!selectedForSection) return list[0];
    return list.find((i) => i.label === selectedForSection) ?? list[0];
  }, [list, selectedForSection]);

  const desiredPct = active?.percentage ?? 0;

  useEffect(() => {
    if (!active) return;

    if (!ringPrimed.current) {
      ringPrimed.current = true;
      setRingPct(desiredPct);
      return;
    }

    setRingPct(desiredPct);
  }, [active, desiredPct]);

  useEffect(() => {
    if (!data) return;
    setSelectedBySection({ race: null, age: null, sex: null });
  }, [data]);

  const defaultLabels = useMemo(
    () => ({
      race: race[0]?.label ?? "",
      age: age[0]?.label ?? "",
      sex: sex[0]?.label ?? "",
    }),
    [race, age, sex]
  );

  const leftLabelFor = (s: Section) => {
    const saved = selectedBySection[s];
    if (saved) return saved;
    return defaultLabels[s];
  };

  const ringSize = 320;
  const stroke = 8;
  const r = (ringSize - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - ringPct / 100);

  const backBtnClass = isBackHover ? "p1-navBtn p1-navBtn-hover" : "p1-navBtn";
  const homeBtnClass = isHomeHover ? "p1-navBtn p1-navBtn-hover" : "p1-navBtn";

  return (
    <>
      <Phase1Header />

      <main className={styles.viewport}>
        <section className={styles.pageHeader}>
          <div className={styles.kicker}>A.I. ANALYSIS</div>
          <h1 className={styles.title}>DEMOGRAPHICS</h1>
          <div className={styles.sub}>PREDICTED RACE & AGE</div>
        </section>

        {!data ? (
          <div className={styles.loadingPad} />
        ) : (
          <section className={styles.layout}>
            <aside className={styles.left}>
              {(["race", "age", "sex"] as Section[]).map((s) => {
                const isActive = section === s;
                const isHover = hoverLeft === s;

                return (
                  <div
                    key={s}
                    onMouseEnter={() => setHoverLeft(s)}
                    onMouseLeave={() => setHoverLeft(null)}
                    onClick={() => setSection(s)}
                    className={[
                      styles.leftBox,
                      isActive ? styles.leftActive : "",
                      !isActive && isHover ? styles.leftHover : "",
                    ].join(" ")}
                  >
                    <div className={styles.leftTop}>
                      {titleCase(leftLabelFor(s))}
                    </div>
                    <div className={styles.leftBottom}>{s.toUpperCase()}</div>
                  </div>
                );
              })}
            </aside>

            <section className={styles.center}>
              <div className={styles.centerLabel}>
                {titleCase(active?.label ?? "")}
              </div>

              <div className={styles.ringWrap} aria-label="A.I. confidence ring">
                <svg width={ringSize} height={ringSize} className={styles.ringSvg}>
                  <g
                    transform={`translate(${ringSize / 2}, ${
                      ringSize / 2
                    }) rotate(-90)`}
                  >
                    <circle
                      r={r}
                      cx={0}
                      cy={0}
                      fill="none"
                      stroke="#d6d6d6"
                      strokeWidth={stroke}
                    />
                    <circle
                      r={r}
                      cx={0}
                      cy={0}
                      fill="none"
                      stroke="#111"
                      strokeWidth={stroke}
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      className={styles.ring}
                    />
                  </g>
                </svg>

                <div className={styles.ringText}>{ringPct}%</div>
              </div>
            </section>

            <aside className={styles.right}>
              <div className={styles.rightHeader}>
                <span>{section.toUpperCase()}</span>
                <span>A.I. CONFIDENCE</span>
              </div>

              {list.map((item) => {
                const isActive = item.label === active?.label;
                const isHover = hoverRight === item.label;

                return (
                  <div
                    key={item.label}
                    onMouseEnter={() => setHoverRight(item.label)}
                    onMouseLeave={() => setHoverRight(null)}
                    onClick={() =>
                      setSelectedBySection((prev) => ({
                        ...prev,
                        [section]: item.label,
                      }))
                    }
                    className={[
                      styles.rightRow,
                      isActive ? styles.rightActive : "",
                      !isActive && isHover ? styles.rightHover : "",
                    ].join(" ")}
                  >
                    <span>◇ {titleCase(item.label)}</span>
                    <span>{item.percentage}%</span>
                  </div>
                );
              })}
            </aside>
          </section>
        )}

        <footer className={styles.footer}>
          <button
            type="button"
            className={backBtnClass}
            onMouseEnter={() => setIsBackHover(true)}
            onMouseLeave={() => setIsBackHover(false)}
            onClick={() => router.push("/results")}
            aria-label="BACK"
          >
            <span className="p1-navIcon" aria-hidden="true">
              <NavDiamondArrow direction="left" className="p1-navDiamondSvg" />
            </span>
            <span className="p1-navLabel">BACK</span>
          </button>

          <div className={styles.footerText}>
            If A.I. estimate is wrong, select the correct one.
          </div>

          <button
            type="button"
            className={homeBtnClass}
            onMouseEnter={() => setIsHomeHover(true)}
            onMouseLeave={() => setIsHomeHover(false)}
            onClick={() => router.push("/")}
            aria-label="HOME"
          >
            <span className="p1-navLabel">HOME</span>
            <span className="p1-navIcon" aria-hidden="true">
              <NavDiamondArrow direction="right" className="p1-navDiamondSvg" />
            </span>
          </button>
        </footer>
      </main>
    </>
  );
}
