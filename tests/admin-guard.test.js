const test = require('node:test');
const assert = require('node:assert/strict');

const { isAdminUser, shouldUseMockUserFallback } = require('../src/lib/admin-guard.js');

test('isAdminUser accepts explicit admin flag', () => {
  assert.equal(isAdminUser({ is_admin: true }, 'user@example.com'), true);
});

test('isAdminUser accepts known admin emails', () => {
  assert.equal(isAdminUser({ email: 'admin@candidature-express.fr' }, 'admin@candidature-express.fr'), true);
});

test('mock fallback is disabled outside demo mode', () => {
  assert.equal(
    shouldUseMockUserFallback([], { allowDemoFallback: false, nodeEnv: 'production' }),
    false,
  );
});

test('mock fallback is allowed only in explicit demo mode', () => {
  assert.equal(
    shouldUseMockUserFallback([], { allowDemoFallback: true, nodeEnv: 'development' }),
    true,
  );
});
