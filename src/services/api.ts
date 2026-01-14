// API Configuration - Change this to your backend URL
export const API_BASE_URL = "http://localhost:8000";

export interface CountResponse {
  count: number;
  confidence: number;
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
