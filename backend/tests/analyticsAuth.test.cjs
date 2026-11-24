const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/portfolio-analytics-tests';
process.env.JWT_SECRET ||= 'test-only-visitor-analytics-secret';
process.env.CLIENT_URL ||= 'http://localhost:5173';
process.env.SERVER_URL ||= 'http://localhost:5000';

const analyticsRoutes = require('../dist/routes/analytics.routes.js').default;

test('visitor reads and destructive deletes require admin authentication', async (t) => {
  const app = express();
  app.use('/analytics', analyticsRoutes);
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const { port } = server.address();
  const readResponse = await fetch(`http://127.0.0.1:${port}/analytics`);
  const deleteAllResponse = await fetch(`http://127.0.0.1:${port}/analytics`, { method: 'DELETE' });
  const deleteOneResponse = await fetch(`http://127.0.0.1:${port}/analytics/not-an-id`, { method: 'DELETE' });

  assert.equal(readResponse.status, 401);
  assert.equal(deleteAllResponse.status, 401);
  assert.equal(deleteOneResponse.status, 401);
});
