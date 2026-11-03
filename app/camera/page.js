"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header, NavButton, Diamonds, Dots, AnalyzingOverlay, CameraGlyph, SmallCamera } from "@/components/ui";
import { analyzeImage } from "@/lib/api";

function Tips() {
  return (
    <div className="cam__tips">
      <p>TO GET BETTER RESULTS MAKE SURE TO HAVE</p>
      <ul>
        <li>NEUTRAL EXPRESSION</li>
        <li>FRONTAL POSE</li>
        <li>ADEQUATE LIGHTING</li>
      </ul>
    </div>
  );
}

export default function Camera() {
  const router = useRouter();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState("setup"); // setup | live | captured | error
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function start() {
    setStatus("setup");
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Your browser doesn't support camera access.");
      setStatus("error");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      // Short pause so the "setting up" screen is visible, matching the original flow.
      await new Promise((r) => setTimeout(r, 1200));
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setStatus("live");
    } catch (err) {
      setError(
        err?.name === "NotAllowedError"
          ? "Camera access was denied. Allow it in your browser settings, or upload a photo instead."
          : "We couldn't start your camera. Try uploading a photo instead."
      );
      setStatus("error");
    }
  }

  function stop() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function capture() {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext("2d");
    // Mirror so the photo matches what the user saw.
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0);
    setPhoto(canvas.toDataURL("image/jpeg", 0.92));
    setStatus("captured");
    v.pause();
  }

  function retake() {
    setPhoto(null);
    setStatus("live");
    videoRef.current?.play().catch(() => {});
  }

  async function usePhoto() {
    setLoading(true);
    try {
      await analyzeImage(photo);
      stop();
      router.push("/select");
    } catch (err) {
      setLoading(false);
      setError(err.message || "Something went wrong. Please try again.");
    }
  }

  const dark = status === "live" || status === "captured";

  return (
    <main className={`page${dark ? " cam" : ""}`}>
      <Header section="ANALYSIS" dark={dark} />

      <video ref={videoRef} className="cam__video" playsInline muted style={{ visibility: status === "live" ? "visible" : "hidden" }} />
      {photo && status === "captured" && <img src={photo} alt="Captured selfie" className="cam__still" />}
      {dark && <div className="cam__shade" />}

      {status === "setup" && (
        <div className="cam__setup">
          <Diamonds base={270} />
          <div className="cam__setup-inner">
            <CameraGlyph />
            <p>
              SETTING UP CAMERA <Dots />
            </p>
          </div>
          <Tips />
        </div>
      )}

      {status === "error" && (
        <div className="cam__setup">
          <Diamonds base={270} still />
          <div className="cam__setup-inner" style={{ maxWidth: 320, textAlign: "center" }}>
            <p>{error}</p>
            <button type="button" onClick={start} style={{ fontSize: 12, fontWeight: 600, textDecoration: "underline" }}>
              TRY AGAIN
            </button>
          </div>
        </div>
      )}

      {status === "live" && (
        <>
          <button type="button" className="cam__shoot" onClick={capture}>
            <span>TAKE PICTURE</span>
            <span className="cam__shoot-btn">
              <SmallCamera size={26} />
            </span>
          </button>
          <Tips />
        </>
      )}

      {status === "captured" && (
        <>
          <p className="cam__great">GREAT SHOT!</p>
          <div className="cam__review">
            <p>Preview</p>
            <div>
              <button type="button" onClick={retake}>
                Retake
              </button>
              <button type="button" onClick={usePhoto}>
                Use This Photo
              </button>
            </div>
          </div>
        </>
      )}

      {error && status === "captured" && <div className="error-banner" role="alert">{error}</div>}

      <NavButton
        label="BACK"
        dir="left"
        dark={dark}
        onClick={() => {
          stop();
          router.push("/result");
        }}
      />
      {loading && <AnalyzingOverlay />}
    </main>
  );
}
