export const PLAN_VALUES = ['free', 'premium', 'pack_candidature'] as const;

export type SubscriptionPlan = (typeof PLAN_VALUES)[number];

export const PLAN_LIMITS: Record<SubscriptionPlan, { maxAiGenerationsPerDay: number; pdfExportsIncluded: number; canAdaptCv: boolean; }> = {
  free: {
    maxAiGenerationsPerDay: 3,
    pdfExportsIncluded: 1,
    canAdaptCv: false,
  },
  premium: {
    maxAiGenerationsPerDay: Number.POSITIVE_INFINITY,
    pdfExportsIncluded: Number.POSITIVE_INFINITY,
    canAdaptCv: true,
  },
  pack_candidature: {
    maxAiGenerationsPerDay: 20,
    pdfExportsIncluded: 5,
    canAdaptCv: true,
  },
};

export function normalizeSubscriptionStatus(value?: string | null): SubscriptionPlan {
  const normalized = (value || 'free').trim().toLowerCase();
  return PLAN_VALUES.includes(normalized as SubscriptionPlan)
    ? (normalized as SubscriptionPlan)
    : 'free';
}

export function isPremiumOrPack(value?: string | null): boolean {
  const plan = normalizeSubscriptionStatus(value);
  return plan === 'premium' || plan === 'pack_candidature';
}

export function canUseAdvancedAi(value?: string | null): boolean {
  return isPremiumOrPack(value);
}

export function getPlanLimits(value?: string | null) {
  return PLAN_LIMITS[normalizeSubscriptionStatus(value)];
}

export function isFreePlanLimitReached(value?: string | null, usageCount = 0): boolean {
  const plan = normalizeSubscriptionStatus(value);
  if (plan !== 'free') return false;
  return usageCount >= PLAN_LIMITS.free.maxAiGenerationsPerDay;
}

export function getUserPlanStatus(profile?: { subscription_status?: string | null } | null): SubscriptionPlan {
  return normalizeSubscriptionStatus(profile?.subscription_status);
}
