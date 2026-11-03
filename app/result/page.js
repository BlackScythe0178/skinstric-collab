"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header, NavButton, Diamonds, AnalyzingOverlay, CameraGlyph, GalleryGlyph } from "@/components/ui";
import { analyzeImage } from "@/lib/api";

export default function Result() {
  const router = useRouter();
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [askCamera, setAskCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      setPreview(dataUrl);
      setError("");
      setLoading(true);
      try {
        await analyzeImage(dataUrl);
        router.push("/select");
      } catch (err) {
        setLoading(false);
        setError(err.message || "Something went wrong. Please try again.");
      }
    };
    reader.onerror = () => setError("Could not read that file.");
    reader.readAsDataURL(file);
  }

  return (
    <main className="page">
      <Header />
      <p className="page-label">TO START ANALYSIS</p>

      <div className="preview">
        <p>Preview</p>
        <div className="preview__box" style={preview ? { backgroundImage: `url(${preview})` } : undefined} />
      </div>

      <section className="choose">
        <div className="choice choice--camera">
          <Diamonds base={270} />
          <button
            type="button"
            className="choice__btn"
            aria-label="Allow A.I. to scan your face"
            onClick={() => setAskCamera(true)}
          >
            <CameraGlyph />
          </button>
          <p className="choice__label">
            ALLOW A.I.
            <br />
            TO SCAN YOUR FACE
          </p>

          {askCamera && (
            <div className="modal" role="dialog" aria-label="Camera permission">
              <p>ALLOW A.I. TO ACCESS YOUR CAMERA</p>
              <div className="modal__actions">
                <button type="button" onClick={() => setAskCamera(false)}>
                  DENY
                </button>
                <button type="button" onClick={() => router.push("/camera")}>
                  ALLOW
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="choice choice--gallery">
          <Diamonds base={270} />
          <button
            type="button"
            className="choice__btn"
            aria-label="Allow A.I. to access gallery"
            onClick={() => fileRef.current?.click()}
          >
            <GalleryGlyph />
          </button>
          <p className="choice__label">
            ALLOW A.I.
            <br />
            ACCESS GALLERY
          </p>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
        </div>
      </section>

      {error && <div className="error-banner" role="alert">{error}</div>}

      <NavButton href="/testing" label="BACK" dir="left" />
      {loading && <AnalyzingOverlay />}
    </main>
  );
}
