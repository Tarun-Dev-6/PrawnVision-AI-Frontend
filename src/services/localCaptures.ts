// src/services/localCaptures.ts

export interface LocalCapture {
  id: number;
  imagePath: string;   // filename stored in Filesystem
  count: number;
  capturedAt: string;
  confidence?: number; // optional (future-proof)
}

// =============================
// 🔹 GLOBAL (OLD – BACKWARD COMPATIBLE)
// =============================
const GLOBAL_KEY = "local_captures";

// READ (old)
export const getLocalCaptures = (): LocalCapture[] => {
  try {
    const raw = localStorage.getItem(GLOBAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// ADD (old)
export const addLocalCapture = (capture: LocalCapture) => {
  const data = getLocalCaptures();
  data.unshift(capture);
  localStorage.setItem(GLOBAL_KEY, JSON.stringify(data));
};

// DELETE (old)
export const deleteLocalCapture = (id: number) => {
  const data = getLocalCaptures().filter((c) => c.id !== id);
  localStorage.setItem(GLOBAL_KEY, JSON.stringify(data));
};

// CLEAR (old)
export const clearLocalCaptures = () => {
  localStorage.removeItem(GLOBAL_KEY);
};

// =============================
// 🔹 USER-SPECIFIC (NEW – RECOMMENDED)
// =============================
const userKey = (userId: string) => `local_captures_${userId}`;

// READ (user-based)
export const getUserLocalCaptures = (
  userId: string
): LocalCapture[] => {
  try {
    const raw = localStorage.getItem(userKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// ADD (user-based)
export const addUserLocalCapture = (
  userId: string,
  capture: LocalCapture
) => {
  const data = getUserLocalCaptures(userId);
  data.unshift(capture);
  localStorage.setItem(userKey(userId), JSON.stringify(data));
};

// DELETE (user-based)
export const deleteUserLocalCapture = (
  userId: string,
  id: number
) => {
  const data = getUserLocalCaptures(userId).filter(
    (c) => c.id !== id
  );
  localStorage.setItem(userKey(userId), JSON.stringify(data));
};

// CLEAR (user-based)
export const clearUserLocalCaptures = (userId: string) => {
  localStorage.removeItem(userKey(userId));
};
