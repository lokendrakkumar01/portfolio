import { v2 as cloudinary } from 'cloudinary';
import { config } from '../../config/env';
import { StorageProvider, UploadOptions, UploadResult } from './storage.interface';

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export class CloudinaryProvider implements StorageProvider {
  async upload(fileBuffer: Buffer, mimeType: string, options: UploadOptions = {}): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const resourceType = mimeType === 'application/pdf' ? 'raw' : 'image';
      const uploadOptions = {
        folder: options.folder || 'portfolio',
        public_id: options.publicId,
        resource_type: resourceType as 'image' | 'raw' | 'auto',
        ...options,
      };
      cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error || !result) return reject(error || new Error('Upload failed'));
        resolve({ url: result.secure_url, publicId: result.public_id, format: result.format, size: result.bytes });
      }).end(fileBuffer);
    });
  }

  async delete(publicId: string, resourceType: 'image' | 'raw' = 'image'): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  }
}
