function isAdminUser(profile, email) {
  if (!profile) return false;

  if (typeof profile.is_admin === 'boolean') {
    return profile.is_admin;
  }

  const normalizedEmail = (email || profile.email || '').toLowerCase();
  return (
    normalizedEmail === 'admin@candidature-express.fr' ||
    normalizedEmail === 'admin@example.com' ||
    normalizedEmail.includes('admin')
  );
}

function shouldUseMockUserFallback(loadedUsers, options = {}) {
  const { allowDemoFallback = false, nodeEnv = process.env.NODE_ENV || 'development' } = options;

  if (nodeEnv === 'production') {
    return false;
  }

  return allowDemoFallback && loadedUsers.length <= 1;
}

module.exports = {
  isAdminUser,
  shouldUseMockUserFallback,
};
