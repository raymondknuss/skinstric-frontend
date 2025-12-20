"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitPhaseTwoImage } from "../services/phaseTwo";

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] ?? null;

    if (!selectedFile) {
      setFile(null);
      setPreviewUrl(null);
      setBase64Image(null);
      setError(null);
      return;
    }

    const validTypes = ["image/jpeg", "image/png"];

    if (!validTypes.includes(selectedFile.type)) {
      setFile(null);
      setPreviewUrl(null);
      setBase64Image(null);
      setError("Please upload a JPG or PNG image.");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setError(null);

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;

      if (typeof result === "string") {
        const strippedBase64 = result.split(",")[1] ?? null;
        setBase64Image(strippedBase64);
      } else {
        setBase64Image(null);
      }
    };

    reader.readAsDataURL(selectedFile);
  }

  function handleBack() {
    router.push("/details");
  }

  async function handleProceed() {
    if (!file || !!error || !base64Image) return;

    setLoading(true);
    setError(null);

    try {
      const response = await submitPhaseTwoImage(base64Image);

      localStorage.setItem("phase2_results", JSON.stringify(response));

      router.push("/results");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Phase Two API request failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Upload Your Image</h1>

      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
      />

      {error && <p className="text-red-600">{error}</p>}

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Image preview"
          className="w-full rounded-md"
        />
      )}

      {base64Image && (
        <p className="text-sm text-green-700">
          Image ready for analysis
        </p>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 border rounded-md"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleProceed}
          disabled={!file || !!error || !base64Image || loading}
          className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
        >
          {loading ? "Processing..." : "Proceed"}
        </button>
      </div>
    </div>
  );
}
