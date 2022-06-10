/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
require('dotenv').config()

export const PORT = process.env.PORT || 3001
export const MAIL_USER = process.env.MAIL_USER
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD
export const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.NODE_ENV === 'development'
    ? process.env.DEV_MONGODB_URI
    : process.env.PRODUCTION_MONGODB_URI
export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://www.ticktax.io/api'
  : 'http:localhost:3000/api'
