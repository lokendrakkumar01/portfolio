import UAParser from 'ua-parser-js';
import type { VisitorDeviceCategory } from '../models/VisitorSession';

export interface ClientDeviceHints {
  platform?: string;
  platformVersion?: string;
  model?: string;
  mobile?: boolean;
  brands?: Array<{ brand: string; version: string }>;
}

const clean = (value?: string) => (value || '').trim().slice(0, 120);

const knownBrandFromModel = (model: string) => {
  if (/^(SM-|GT-|SCH-|SAMSUNG)/i.test(model)) return 'Samsung';
  if (/^Pixel/i.test(model)) return 'Google';
  if (/^(iPhone|iPad|iPod)/i.test(model)) return 'Apple';
  if (/^(Redmi|POCO|Mi\s)/i.test(model)) return 'Xiaomi';
  if (/^ONEPLUS/i.test(model)) return 'OnePlus';
  return '';
};

export function identifyDevice(userAgent: string, hints: ClientDeviceHints = {}) {
  const result = new UAParser(userAgent).getResult();
  const hintModel = clean(hints.model);
  const parsedModel = clean(result.device.model);
  const model = hintModel || parsedModel || 'Unknown device';
  const brand = clean(result.device.vendor) || knownBrandFromModel(hintModel || parsedModel) || 'Unknown';
  const parsedType = result.device.type?.toLowerCase();
  const platformHint = clean(hints.platform);
  const category: VisitorDeviceCategory = parsedType === 'tablet' || /ipad|tablet/i.test(userAgent)
    ? 'Tablet'
    : parsedType === 'mobile' || hints.mobile === true || /iphone|ipod|android.+mobile|windows phone/i.test(userAgent)
      ? 'Mobile'
      : 'Desktop';
  const parsedOs = clean(result.os.name);
  const os = /^mac os(?: x)?$/i.test(parsedOs) ? 'macOS' : parsedOs || platformHint || 'Unknown';
  const osVersion = clean(result.os.version) || clean(hints.platformVersion);
  const hintedBrowser = hints.brands?.find((item) => !/not.?a.?brand|chromium/i.test(item.brand));
  const browser = clean(result.browser.name) || clean(hintedBrowser?.brand) || 'Unknown';

  return {
    brand,
    model,
    // Only keep an identifier when the browser explicitly supplied one.
    modelIdentifier: hintModel || undefined,
    category,
    os,
    osVersion,
    browser,
    browserVersion: clean(result.browser.version) || clean(hintedBrowser?.version),
    platform: platformHint || os,
  };
}

export const sanitizeReferrer = (value: string) => {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    return `${url.origin}${url.pathname}`.slice(0, 512);
  } catch {
    return '';
  }
};
