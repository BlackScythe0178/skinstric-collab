const PHASE_ONE_URL =
  "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne";
const PHASE_TWO_URL =
  "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo";

export const STORAGE = {
  name: "skinstric:name",
  location: "skinstric:location",
  analysis: "skinstric:analysis",
  image: "skinstric:image",
  confirmed: "skinstric:confirmed",
};

export function save(key, value) {
  try {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  } catch {
    /* storage full or blocked — non-fatal */
  }
}

export function load(key, parse = false) {
  try {
    const v = localStorage.getItem(key);
    if (v == null) return null;
    return parse ? JSON.parse(v) : v;
  } catch {
    return null;
  }
}

/** Phase 1 — send name + location */
export async function submitPhaseOne(name, location) {
  const res = await fetch(PHASE_ONE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, location }),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

/** Downscale an image data URL so the payload stays small. Returns a JPEG data URL. */
export function shrinkImage(dataUrl, max = 1024, quality = 0.9) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("Could not read that image."));
    img.src = dataUrl;
  });
}

/** Phase 2/3 — send a base64 image, store the demographics, return them. */
export async function analyzeImage(dataUrl) {
  const small = await shrinkImage(dataUrl);
  const base64 = small.split(",")[1];
  const res = await fetch(PHASE_TWO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64 }),
  });
  if (!res.ok) throw new Error(`Analysis failed (${res.status})`);
  const json = await res.json();
  if (!json?.data) throw new Error("Unexpected response from the server.");
  save(STORAGE.analysis, json.data);
  save(STORAGE.image, small);
  return json.data;
}
