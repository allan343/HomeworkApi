module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://studentUser1:mypassword1@localhost/schoolapp1',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://studentUser1:mypassword1@localhost/schoolapptest1',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN
}