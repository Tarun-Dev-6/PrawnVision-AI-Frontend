// src/services/api.ts

// ===============================
// CONFIG
// ===============================

// 🔴 Change this ONLY when ngrok restarts
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://superelementary-inorganic-ninfa.ngrok-free.dev";

// ===============================
// TYPES
// ===============================

export interface CaptureRecord {
  id: number;
  image_url: string;
  count: number;
  confidence: number;
  captured_at: string;
}

export interface CountResponse {
  count: number;
  confidence: number;
}

// ===============================
// INTERNAL FETCH HELPER
// ===============================

async function safeFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "ngrok-skip-browser-warning": "true",
    },
  });

  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 100)}`);
  }

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error("Non-JSON response:", text);
    throw new Error("Expected JSON but received HTML (ngrok interstitial)");
  }

  return res.json();
}


// ===============================
// API CALLS
// ===============================

// ---------- COUNT ----------
export async function countShrimp(image: Blob): Promise<CountResponse> {
  const formData = new FormData();
  formData.append("file", image);

  return safeFetch(`${API_BASE_URL}/count`, {
    method: "POST",
    body: formData,
  });
}

// ---------- SAVE ----------
export async function saveCapture(
  image: Blob,
  count: number,
  confidence: number
): Promise<CaptureRecord> {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("count", String(count));
  formData.append("confidence", String(confidence));

  return safeFetch(`${API_BASE_URL}/captures`, {
    method: "POST",
    body: formData,
  });
}

// ---------- HISTORY ----------
export async function getCaptures(): Promise<CaptureRecord[]> {
  return safeFetch(`${API_BASE_URL}/captures`);
}

// ---------- DELETE ----------
export async function deleteCapture(id: number): Promise<void> {
  await safeFetch(`${API_BASE_URL}/captures/${id}`, {
    method: "DELETE",
  });
}

// ===============================
// UTIL: base64 → Blob
// ===============================

export function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}
