const test = require('node:test');
const assert = require('node:assert/strict');

const {
  normalizeSubscriptionStatus,
  getPlanLimits,
  isPremiumOrPack,
  isFreePlanLimitReached,
} = require('../src/lib/billing.ts');

test('normalizeSubscriptionStatus keeps known plans', () => {
  assert.equal(normalizeSubscriptionStatus('premium'), 'premium');
  assert.equal(normalizeSubscriptionStatus('PACK_CANDIDATURE'), 'pack_candidature');
});

test('normalizeSubscriptionStatus falls back to free', () => {
  assert.equal(normalizeSubscriptionStatus('unknown'), 'free');
  assert.equal(normalizeSubscriptionStatus(undefined), 'free');
});

test('advanced plans are allowed for AI adaptation', () => {
  assert.equal(isPremiumOrPack('premium'), true);
  assert.equal(isPremiumOrPack('pack_candidature'), true);
  assert.equal(isPremiumOrPack('free'), false);
});

test('free plan daily limit is enforced', () => {
  assert.equal(isFreePlanLimitReached('free', 3), true);
  assert.equal(isFreePlanLimitReached('free', 2), false);
  assert.equal(isFreePlanLimitReached('premium', 100), false);
});

test('plan limits match the product rules', () => {
  assert.equal(getPlanLimits('free').maxAiGenerationsPerDay, 3);
  assert.equal(getPlanLimits('pack_candidature').pdfExportsIncluded, 5);
});
