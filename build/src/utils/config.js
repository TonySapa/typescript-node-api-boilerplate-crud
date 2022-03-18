"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_URL = exports.MONGODB_URI = exports.MAIL_PASSWORD = exports.MAIL_USER = exports.PORT = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
require('dotenv').config();
exports.PORT = process.env.PORT || 3001;
exports.MAIL_USER = process.env.MAIL_USER;
exports.MAIL_PASSWORD = process.env.MAIL_PASSWORD;
exports.MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.NODE_ENV === 'development'
        ? process.env.DEV_MONGODB_URI
        : process.env.PRODUCTION_MONGODB_URI;
exports.API_URL = process.env.NODE_ENV === 'production'
    ? 'https://www.ticktax.io/api'
    : 'http:localhost:3000/api';
