import { config } from '../../config/env';
import { StorageProvider } from './storage.interface';
import { CloudinaryProvider } from './cloudinary.provider';
import { LocalProvider } from './local.provider';

let _provider: StorageProvider | null = null;

export const getStorageProvider = (): StorageProvider => {
  if (!_provider) {
    if (config.STORAGE_PROVIDER === 'cloudinary') {
      _provider = new CloudinaryProvider();
    } else {
      _provider = new LocalProvider();
    }
  }
  return _provider;
};
