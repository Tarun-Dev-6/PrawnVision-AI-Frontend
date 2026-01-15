// API Configuration - Change this to your backend URL
export const API_BASE_URL = "http://localhost:8000";

export interface CountResponse {
  count: number;
  confidence: number;
}

export interface CaptureRecord {
  id: number;
  image_url: string;
  count: number;
  confidence: number;
  captured_at: string;
}

/**
 * Send image to FastAPI backend for shrimp counting
 */
export async function countShrimp(imageFile: File | Blob): Promise<CountResponse> {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch(`${API_BASE_URL}/count`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Save a capture to the database
 */
export async function saveCapture(
  imageBlob: Blob,
  count: number,
  confidence: number
): Promise<CaptureRecord> {
  const formData = new FormData();
  formData.append("file", imageBlob, "capture.jpg");
  formData.append("count", count.toString());
  formData.append("confidence", confidence.toString());

  const response = await fetch(`${API_BASE_URL}/captures`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all captures from the database
 */
export async function getCaptures(): Promise<CaptureRecord[]> {
  const response = await fetch(`${API_BASE_URL}/captures`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get the most recent capture
 */
export async function getLatestCapture(): Promise<CaptureRecord | null> {
  const response = await fetch(`${API_BASE_URL}/captures/latest`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a capture by ID
 */
export async function deleteCapture(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/captures/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

/**
 * Convert base64 data URL to Blob for upload
 */
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
