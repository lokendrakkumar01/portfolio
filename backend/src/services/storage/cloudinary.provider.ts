import { v2 as cloudinary } from 'cloudinary';
import { config } from '../../config/env';
import { StorageProvider, UploadOptions, UploadResult } from './storage.interface';

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: config.CLOUDINARY_API_KEY?.trim(),
  api_secret: config.CLOUDINARY_API_SECRET?.trim(),
  secure: true,
});

export class CloudinaryProvider implements StorageProvider {
  async upload(fileBuffer: Buffer, mimeType: string, options: UploadOptions = {}): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const resourceType = mimeType === 'application/pdf' ? 'raw' : 'image';
      const uploadOptions: Record<string, any> = {
        folder: options.folder || 'portfolio',
        resource_type: resourceType,
      };

      if (options.publicId) {
        uploadOptions.public_id = options.publicId;
      }

      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error || !result) {
          const errMsg = error?.message || 'Cloudinary upload failed';
          return reject(new Error(errMsg));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          size: result.bytes,
        });
      });

      (uploadStream as any).end(fileBuffer);
    });
  }

  async delete(publicId: string, resourceType: 'image' | 'raw' = 'image'): Promise<void> {
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch {
      // Ignore deletion errors for legacy or non-existent items
    }
  }
}
