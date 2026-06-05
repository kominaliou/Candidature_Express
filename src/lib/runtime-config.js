const REQUIRED_ENV_KEYS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'OPENAI_API_KEY',
  'STRIPE_SECRET_KEY',
];

function isTruthy(value) {
  return typeof value === 'string' ? value.trim().length > 0 && !value.includes('dummy') : Boolean(value);
}

function getMissingEnvKeys(env = process.env) {
  return REQUIRED_ENV_KEYS.filter((key) => !isTruthy(env[key]));
}

function getRuntimeEnvStatus(env = process.env) {
  const missing = getMissingEnvKeys(env);
  const isProduction = (env.NODE_ENV || 'development') === 'production';
  const demoMode = !isProduction && missing.length > 0;
  const ready = missing.length === 0;

  return {
    ready,
    demoMode,
    missing,
    isProduction,
    hasSupabase: isTruthy(env.NEXT_PUBLIC_SUPABASE_URL) && isTruthy(env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasOpenAI: isTruthy(env.OPENAI_API_KEY),
    hasStripe: isTruthy(env.STRIPE_SECRET_KEY),
  };
}

module.exports = {
  REQUIRED_ENV_KEYS,
  getMissingEnvKeys,
  getRuntimeEnvStatus,
};
