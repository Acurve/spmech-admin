import axios from "axios";
import { api } from "@/lib/api";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PresignedUrlResponse {
    presignedUrl: string;
    publicUrl: string;
    key: string;
}

interface FileDescriptor {
    fileName: string;
    contentType: string;
    folder: string;
}

interface UploadRequest {
    file: File;
    folder: string;
}

// ─── WebP Conversion ────────────────────────────────────────────────────────

/**
 * Convert an image File to WebP format using canvas.
 * If the file is already WebP, it is returned as-is.
 */
export async function convertToWebp(file: File, quality = 0.85): Promise<File> {
    if (file.type === "image/webp") return file;

    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
            }

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error("Canvas toBlob returned null"));
                        return;
                    }

                    // Replace the original extension with .webp
                    const baseName = file.name.replace(/\.[^.]+$/, "");
                    const webpFile = new File([blob], `${baseName}.webp`, {
                        type: "image/webp",
                    });

                    resolve(webpFile);
                },
                "image/webp",
                quality,
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error(`Failed to load image: ${file.name}`));
        };

        img.src = url;
    });
}

// ─── Presigned URL Helpers ──────────────────────────────────────────────────

/**
 * Request presigned S3 upload URLs from the backend (batch).
 */
async function getPresignedUrls(files: FileDescriptor[]): Promise<PresignedUrlResponse[]> {
    const { data } = await api.post("/upload/presigned-urls", { files });
    return data.data; // unwrap the standard { success, data, message } envelope
}

/**
 * Upload a single file directly to S3 via its presigned PUT URL.
 * Uses a standalone axios call (no baseURL / no cookies).
 */
async function uploadFileToS3(file: File | Blob, presignedUrl: string, contentType: string): Promise<void> {
    await axios.put(presignedUrl, file, {
        headers: {
            "Content-Type": contentType,
        },
    });
}

// ─── Public Orchestrator ────────────────────────────────────────────────────

/**
 * Full upload pipeline:
 *   1. Convert each file to WebP (skip if already webp)
 *   2. Request presigned URLs from backend (batch)
 *   3. PUT each file to S3
 *   4. Return the public S3 URLs
 *
 * @param files - Array of { file, folder } to upload
 * @returns Array of public S3 URL strings (same order as input)
 */
export async function uploadFiles(files: UploadRequest[]): Promise<string[]> {
    if (files.length === 0) return [];

    // 1. Convert to WebP
    const convertedFiles = await Promise.all(
        files.map(({ file }) => convertToWebp(file)),
    );

    // 2. Get presigned URLs
    const descriptors: FileDescriptor[] = convertedFiles.map((file, i) => ({
        fileName: file.name,
        contentType: file.type, // always "image/webp" after conversion
        folder: files[i].folder,
    }));

    const presignedResults = await getPresignedUrls(descriptors);

    // 3. Upload to S3 in parallel
    await Promise.all(
        presignedResults.map((result, i) =>
            uploadFileToS3(convertedFiles[i], result.presignedUrl, convertedFiles[i].type),
        ),
    );

    // 4. Return public URLs
    return presignedResults.map((r) => r.publicUrl);
}
