export default () => ({
  port: parseInt(process.env.PORT || '3000', 10) || 3000,
  environment: process.env.NODE_ENV,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
});
