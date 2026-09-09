import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { StorageProvider, UploadOptions, UploadResult } from './storage.interface';
import { config } from '../../config/env';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class LocalProvider implements StorageProvider {
  async upload(fileBuffer: Buffer, mimeType: string, options: UploadOptions = {}): Promise<UploadResult> {
    const ext = mimeType === 'application/pdf' ? 'pdf' : mimeType.split('/')[1] || 'bin';
    const folder = options.folder || 'general';
    const publicId = options.publicId || `${folder}/${uuidv4()}`;
    const filename = `${publicId.replace(/\//g, '_')}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, fileBuffer);
    const url = `${config.SERVER_URL}/uploads/${filename}`;
    return { url, publicId, format: ext };
  }

  async delete(publicId: string): Promise<void> {
    const safeId = publicId.replace(/\//g, '_');
    // Basic search in uploads root
    if (fs.existsSync(UPLOAD_DIR)) {
      const files = fs.readdirSync(UPLOAD_DIR);
      const file = files.find(f => f.startsWith(safeId));
      if (file) {
        fs.unlinkSync(path.join(UPLOAD_DIR, file));
      }
    }
  }
}
