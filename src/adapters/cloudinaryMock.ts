// Mock Cloudinary uploader for local development.
type UploadResult = {
  url: string;
  thumbnailUrl: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
};

export function mockUploadToCloudinary(file: File, onProgress?: (progress: number) => void): Promise<UploadResult> {
  return new Promise((resolve) => {
    const fakeBase = "https://res.cloudinary.com/demo/image/upload";
    const timestamp = Date.now();
    const safeName = encodeURIComponent(file.name.replace(/\s+/g, "-"));
    const publicId = `${timestamp}-${safeName}`;

    // simulate progress
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 95) {
        p = 95;
        clearInterval(t);
      }
      if (onProgress) onProgress(Math.round(p));
    }, 200);

    // resolve after short delay
    setTimeout(() => {
      if (onProgress) onProgress(100);
      const url = `${fakeBase}/v${timestamp}/${publicId}`;
      // simulate thumbnail via transformation params
      const thumbnailUrl = `${fakeBase}/c_fill,w_400,h_400/v${timestamp}/${publicId}`;
      resolve({
        url,
        thumbnailUrl,
        width: 1280,
        height: 720,
        bytes: file.size,
        format: file.type.split("/")[1] || "jpg",
      });
    }, 1200 + Math.random() * 1200);
  });
}
