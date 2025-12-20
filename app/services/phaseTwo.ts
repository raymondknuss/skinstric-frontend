export async function submitPhaseTwoImage(base64Image: string) {
  /*
    Both `image` and `Image` keys are included intentionally.

    The Phase Two API has historically accepted either casing,
    and this defensive payload ensures compatibility without
    requiring client-side retries or conditional branching.
  */
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

  return response.json();
}
