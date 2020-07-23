module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  //DB_URL: process.env.DB_URL || 'postgresql://dundermifflin:mypassword@localhost/noteful',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://studentUser:mypassword@localhost/school-app',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://dundermifflin:mypassword@localhost/notefultest'
  
}