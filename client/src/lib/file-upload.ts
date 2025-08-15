"use client";

export interface FileUploadResult {
  filename: string;
  mimetype: string;
  url: string;
}

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class FileUploadError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "FileUploadError";
  }
}

export const ALLOWED_FILE_TYPES = {
  image: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
  video: ["video/mp4", "video/webm", "video/ogg"],
  audio: ["audio/mp3", "audio/wav", "audio/ogg", "audio/m4a"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/csv",
  ],
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`,
    };
  }

  // Check file type
  const allAllowedTypes = Object.values(ALLOWED_FILE_TYPES).flat();
  if (!allAllowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "File type not supported. Please upload images, videos, audio files, or documents.",
    };
  }

  return { valid: true };
}

export function getFileType(mimeType: string): "image" | "video" | "audio" | "document" {
  if (ALLOWED_FILE_TYPES.image.includes(mimeType)) return "image";
  if (ALLOWED_FILE_TYPES.video.includes(mimeType)) return "video";
  if (ALLOWED_FILE_TYPES.audio.includes(mimeType)) return "audio";
  return "document";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export async function uploadFile(file: File, onProgress?: (progress: FileUploadProgress) => void): Promise<FileUploadResult> {
  // Validate file first
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new FileUploadError(validation.error!);
  }

  const formData = new FormData();
  formData.append("media", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress: FileUploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          };
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText);
          resolve({
            filename: result.filename,
            mimetype: result.mimetype,
            url: result.filename, // The backend returns filename, which is used as the URL path
          });
        } catch (error) {
          reject(new FileUploadError("Invalid response from server"));
        }
      } else {
        reject(new FileUploadError(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new FileUploadError("Network error during upload"));
    });

    xhr.addEventListener("timeout", () => {
      reject(new FileUploadError("Upload timeout"));
    });

    xhr.open("POST", process.env.NEXT_PUBLIC_UPLOAD_URL || "http://localhost:4000/upload");
    xhr.timeout = 60000; // 60 second timeout
    xhr.send(formData);
  });
}
