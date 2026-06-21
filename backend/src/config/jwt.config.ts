export const jwtConfig = {
  secret: process.env.JWT_SECRET ?? 'dev-only-change-me',
  expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  issuer: 'ai-learning-platform',
  audience: 'ai-learning-users',
};
