
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateImage(file: File): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return "Please choose a JPG, PNG or WebP image";
  if (file.size > MAX_IMAGE_BYTES) return "Image must be 5MB or smaller";
  return null;
}

/** Uploads through our server (which holds the ImgBB key) with real progress events. */
export async function uploadImage(file: File, onProgress: (pct: number) => void): Promise<string> {
  const problem = validateImage(file);
  if (problem) throw new Error(problem);
  // Reuse the cached token via a cheap authenticated call path
  const { authClient } = await import("./auth-client");
  const token = (await authClient.token()).data?.token;
  if (!token) throw new Error("Please sign in again to upload images");
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText) as { success: boolean; message: string; data?: { url: string } };
        if (xhr.status >= 200 && xhr.status < 300 && json.success && json.data?.url) resolve(json.data.url);
        else reject(new Error(json.message || "Image upload failed"));
      } catch { reject(new Error("Image upload failed")); }
    };
    xhr.onerror = () => reject(new Error("Network error while uploading"));
    const form = new FormData();
    form.append("image", file);
    xhr.send(form);
  });
}
