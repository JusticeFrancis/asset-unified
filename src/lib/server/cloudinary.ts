import { v2 as cloudinary } from "cloudinary";
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
export function uploadBuffer(buffer: Buffer, folder = "asset-union") {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) throw new Error("Cloudinary is not configured");
  return new Promise<{ publicId: string; url: string; width?: number; height?: number; resourceType: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: "auto" }, (error, result) => error || !result ? reject(error) : resolve({ publicId: result.public_id, url: result.secure_url, width: result.width, height: result.height, resourceType: result.resource_type }));
    stream.end(buffer);
  });
}
export async function deleteCloudinaryAsset(publicId: string, resourceType: "image" | "video" | "raw" = "image") { return cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true }); }
