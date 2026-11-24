const test = require('node:test');
const assert = require('node:assert/strict');
const { identifyDevice, sanitizeReferrer } = require('../dist/utils/deviceIdentification.js');

test('identifies Android phone details from UA and supplied client hints', () => {
  const device = identifyDevice(
    'Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
    { platform: 'Android', platformVersion: '14', model: 'SM-S921B', mobile: true },
  );
  assert.equal(device.category, 'Mobile');
  assert.equal(device.brand, 'Samsung');
  assert.equal(device.modelIdentifier, 'SM-S921B');
  assert.equal(device.os, 'Android');
  assert.match(device.browser, /Chrome/i);
});

test('does not present generic one-character Android model hints as a device model', () => {
  const device = identifyDevice(
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Mobile Safari/537.36',
    { platform: 'Android', model: 'K', mobile: true },
  );
  assert.equal(device.category, 'Mobile');
  assert.equal(device.model, 'Unknown device');
  assert.equal(device.modelIdentifier, undefined);
});

test('identifies iPhone and iPad categories without guessing exact model identifiers', () => {
  const iphone = identifyDevice('Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1');
  const ipad = identifyDevice('Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1');
  assert.equal(iphone.category, 'Mobile');
  assert.equal(iphone.brand, 'Apple');
  assert.equal(iphone.modelIdentifier, undefined);
  assert.equal(ipad.category, 'Tablet');
});

test('identifies Windows desktop browser and reports unavailable model honestly', () => {
  const device = identifyDevice('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');
  assert.equal(device.category, 'Desktop');
  assert.equal(device.os, 'Windows');
  assert.equal(device.model, 'Unknown device');
});

test('supports macOS and Linux desktop user agents', () => {
  const mac = identifyDevice('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
  const linux = identifyDevice('Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0');
  assert.equal(mac.category, 'Desktop');
  assert.equal(mac.os, 'macOS');
  assert.equal(linux.category, 'Desktop');
  assert.equal(linux.os, 'Linux');
});

test('removes query strings and fragments from referrer URLs', () => {
  assert.equal(sanitizeReferrer('https://example.com/path?email=private#section'), 'https://example.com/path');
  assert.equal(sanitizeReferrer('javascript:alert(1)'), '');
});
