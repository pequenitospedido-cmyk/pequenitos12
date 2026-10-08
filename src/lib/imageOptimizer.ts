/**
 * Client-side image optimizer for product photography and brand logos.
 * Compresses and scales images before uploading to Supabase Storage or saving in DEMO mode.
 */
export async function optimizeImageFile(
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number; preserveFormat?: boolean } = {}
): Promise<{ blob: Blob; dataUrl: string; mimeType: string; sizeBytes: number }> {
  const {
    maxWidth = 1400,
    maxHeight = 1400,
    quality = 0.84,
    preserveFormat = false,
  } = options;

  // For SVG files, preserve as-is without rasterizing
  if (file.type === 'image/svg+xml') {
    const dataUrl = await readFileAsDataUrl(file);
    return {
      blob: file,
      dataUrl,
      mimeType: file.type,
      sizeBytes: file.size,
    };
  }

  const rawDataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(rawDataUrl);

  let width = img.width;
  let height = img.height;

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      blob: file,
      dataUrl: rawDataUrl,
      mimeType: file.type,
      sizeBytes: file.size,
    };
  }

  ctx.drawImage(img, 0, 0, width, height);

  // Preserve PNG transparency for logos; use WebP for product photos
  const outputMime =
    preserveFormat || file.type === 'image/png' || file.type === 'image/webp'
      ? file.type === 'image/png'
        ? 'image/png'
        : 'image/webp'
      : 'image/webp';

  const optimizedDataUrl = canvas.toDataURL(outputMime, quality);
  const blob = await (await fetch(optimizedDataUrl)).blob();

  return {
    blob,
    dataUrl: optimizedDataUrl,
    mimeType: outputMime,
    sizeBytes: blob.size,
  };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
