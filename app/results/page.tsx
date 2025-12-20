"use client";

import { useEffect, useState } from "react";

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

function formatDistribution(dist: Distribution): Item[] {
  return Object.entries(dist)
    .map(([label, value]) => ({
      label,
      percentage: value * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

export default function ResultsPage() {
  const [data, setData] = useState<PhaseTwoData | null>(null);

  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("phase2_results");
    if (!stored) return;

    try {
      const parsed: PhaseTwoResponse = JSON.parse(stored);
      if (parsed.success && parsed.data) {
        setData(parsed.data);
      }
    } catch {
      setData(null);
    }
  }, []);

  if (!data) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Results</h1>
        <p>No results available.</p>
      </main>
    );
  }

  const race = formatDistribution(data.race);
  const age = formatDistribution(data.age);
  const gender = formatDistribution(data.gender);

  const aiRace = race[0]?.label;
  const aiAge = age[0]?.label;
  const aiGender = gender[0]?.label;

  /*
    AI defaults are derived from the highest-probability values
    returned by the Phase Two API.

    User-selected overrides are intentionally NOT persisted.
    A page refresh resets the UI back to AI suggestions by design,
    reinforcing that AI output is suggestive rather than authoritative.
  */
  const finalRace = selectedRace ?? aiRace;
  const finalAge = selectedAge ?? aiAge;
  const finalGender = selectedGender ?? aiGender;

  return (
    <main style={{ display: "flex", padding: "2rem", gap: "2rem" }}>
      <aside style={{ minWidth: "220px", borderRight: "1px solid #333" }}>
        <h2>Your Profile</h2>
        <p>
          <strong>Race:</strong> {finalRace}
        </p>
        <p>
          <strong>Age:</strong> {finalAge}
        </p>
        <p>
          <strong>Gender:</strong> {finalGender}
        </p>
      </aside>

      <section style={{ maxWidth: "700px" }}>
        <h1>AI Demographic Suggestions</h1>
        <p>Click a value to set your actual attribute.</p>

        <section>
          <h2>Race</h2>
          <p>
            AI Suggestion: <strong>{aiRace}</strong>
          </p>
          <ul>
            {race.map((item) => (
              <li
                key={item.label}
                onClick={() => setSelectedRace(item.label)}
                style={{
                  cursor: "pointer",
                  fontWeight:
                    finalRace === item.label ? "bold" : "normal",
                }}
              >
                {item.label}: {item.percentage.toFixed(2)}%
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Age</h2>
          <p>
            AI Suggestion: <strong>{aiAge}</strong>
          </p>
          <ul>
            {age.map((item) => (
              <li
                key={item.label}
                onClick={() => setSelectedAge(item.label)}
                style={{
                  cursor: "pointer",
                  fontWeight:
                    finalAge === item.label ? "bold" : "normal",
                }}
              >
                {item.label}: {item.percentage.toFixed(2)}%
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Gender</h2>
          <p>
            AI Suggestion: <strong>{aiGender}</strong>
          </p>
          <ul>
            {gender.map((item) => (
              <li
                key={item.label}
                onClick={() => setSelectedGender(item.label)}
                style={{
                  cursor: "pointer",
                  fontWeight:
                    finalGender === item.label ? "bold" : "normal",
                }}
              >
                {item.label}: {item.percentage.toFixed(2)}%
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
