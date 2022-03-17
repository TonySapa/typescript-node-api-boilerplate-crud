"use strict";
// Used to factorise console log
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.error = exports.info = void 0;
const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params);
    }
};
exports.info = info;
const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params);
    }
};
exports.error = error;
const log = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params);
    }
};
exports.log = log;
