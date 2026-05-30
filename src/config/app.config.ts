export default () => ({
  port: parseInt(process.env.PORT || '3000', 10) || 3000,
  environment: process.env.NODE_ENV,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h',
  },
  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001,http://localhost:3002')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    successUrl: process.env.STRIPE_SUCCESS_URL,
    cancelUrl: process.env.STRIPE_CANCEL_URL,
  },
});
