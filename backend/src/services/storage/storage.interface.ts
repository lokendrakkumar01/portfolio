export interface UploadOptions {
  folder?: string;
  publicId?: string;
  resourceType?: 'image' | 'raw' | 'auto';
  format?: string;
}

export interface UploadResult {
  url: string;
  publicId: string;
  format?: string;
  size?: number;
}

export interface StorageProvider {
  upload(fileBuffer: Buffer, mimeType: string, options?: UploadOptions): Promise<UploadResult>;
  delete(publicId: string, resourceType?: 'image' | 'raw'): Promise<void>;
}
