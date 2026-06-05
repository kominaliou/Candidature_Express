const test = require('node:test');
const assert = require('node:assert/strict');

const { getRuntimeEnvStatus, getMissingEnvKeys } = require('../src/lib/runtime-config.js');

test('runtime config marks unset keys as missing', () => {
  const result = getRuntimeEnvStatus({
    NEXT_PUBLIC_SUPABASE_URL: '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
    OPENAI_API_KEY: '',
    STRIPE_SECRET_KEY: '',
    NODE_ENV: 'production',
  });

  assert.equal(result.demoMode, false);
  assert.equal(result.ready, false);
  assert.ok(getMissingEnvKeys(result.missing).length >= 3);
});

test('runtime config allows demo mode only in non-production', () => {
  const result = getRuntimeEnvStatus({
    NEXT_PUBLIC_SUPABASE_URL: '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
    OPENAI_API_KEY: '',
    STRIPE_SECRET_KEY: '',
    NODE_ENV: 'development',
  });

  assert.equal(result.demoMode, true);
  assert.equal(result.ready, false);
});
