export async function submitPhaseTwoImage(base64Image: string) {
  const response = await fetch(
    "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
        Image: base64Image,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Phase Two API error: ${response.status} ${response.statusText} ${text}`
    );
  }

  const data = await response.json();

  localStorage.setItem("phase2_results", JSON.stringify(data));

  return data;
}
