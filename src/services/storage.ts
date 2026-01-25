// src/services/storage.ts

import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";

/**
 * Convert Blob → Base64 (required by Capacitor Filesystem)
 */
const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]); // remove data:image/...;base64,
    };
    reader.readAsDataURL(blob);
  });

/**
 * SAVE image on device storage
 * RETURNS filename (not URL)
 */
export const saveImageLocally = async (
  blob: Blob,
  fileName: string
): Promise<string> => {
  const base64 = await blobToBase64(blob);

  await Filesystem.writeFile({
    path: fileName,
    data: base64,
    directory: Directory.Data, // ✅ IMPORTANT
  });

  return fileName;
};

/**
 * Convert stored file → usable <img src="">
 */
export const resolveLocalImage = async (
  fileName: string
): Promise<string> => {
  const file = await Filesystem.getUri({
    path: fileName,
    directory: Directory.Data, // ✅ SAME DIRECTORY
  });

  // REQUIRED for Android WebView
  return Capacitor.convertFileSrc(file.uri);
};
