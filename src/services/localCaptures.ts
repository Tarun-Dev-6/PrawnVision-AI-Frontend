// src/services/localCaptures.ts

export interface LocalCapture {
  id: number;
  imagePath: string;   // filename stored in Filesystem
  count: number;
  capturedAt: string;
  confidence?: number; // optional (future-proof)
}

const KEY = "local_captures";

// =============================
// READ
// =============================
export const getLocalCaptures = (): LocalCapture[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// =============================
// ADD
// =============================
export const addLocalCapture = (capture: LocalCapture) => {
  const data = getLocalCaptures();
  data.unshift(capture);
  localStorage.setItem(KEY, JSON.stringify(data));
};

// =============================
// DELETE
// =============================
export const deleteLocalCapture = (id: number) => {
  const data = getLocalCaptures().filter((c) => c.id !== id);
  localStorage.setItem(KEY, JSON.stringify(data));
};

// =============================
// CLEAR (optional helper)
// =============================
export const clearLocalCaptures = () => {
  localStorage.removeItem(KEY);
};
