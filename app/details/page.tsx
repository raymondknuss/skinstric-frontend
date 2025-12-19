"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function isLettersAndSpacesOnly(value: string) {
  return /^[A-Za-z\s]+$/.test(value);
}

function validateName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "Name is required.";
  if (!isLettersAndSpacesOnly(trimmed)) return "Name must contain letters and spaces only.";
  return "";
}

function validateLocation(location: string) {
  const trimmed = location.trim();
  if (!trimmed) return "Location is required.";
  if (!isLettersAndSpacesOnly(trimmed)) return "Location must contain letters and spaces only.";
  return "";
}

export default function DetailsPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [apiError, setApiError] = useState("");

  const [touched, setTouched] = useState({
    name: false,
    location: false,
  });

  const nameError = useMemo(() => validateName(name), [name]);
  const locationError = useMemo(() => validateLocation(location), [location]);

  const canProceed = !nameError && !locationError;

  async function handleProceed() {
    setTouched({ name: true, location: true });
    setApiError("");

    if (!canProceed) return;

    try {
      const response = await fetch(
        "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            location: location.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Phase One API request failed");
      }

      const data = await response.json();

      localStorage.setItem(
        "phase1_user_details",
        JSON.stringify({
          name: name.trim(),
          location: location.trim(),
          apiResponse: data,
        })
      );

      router.push("/upload");
    } catch (error) {
      setApiError("Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      <h1>User Details</h1>

      <div>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
        />
        {touched.name && nameError ? <p>{nameError}</p> : null}
      </div>

      <div>
        <label>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, location: true }))}
        />
        {touched.location && locationError ? <p>{locationError}</p> : null}
      </div>

      {apiError ? <p>{apiError}</p> : null}

      <div>
        <button onClick={() => router.push("/")}>Back</button>
        <button onClick={handleProceed} disabled={!canProceed}>
          Proceed
        </button>
      </div>
    </div>
  );
}
