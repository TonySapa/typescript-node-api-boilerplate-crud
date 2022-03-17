"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenExtractor = exports.errorHandler = void 0;
/* Middleware to factorise error handling and token extraction */
const logger_1 = require("./logger");
const errorHandler = (error, _req, res, next) => {
    (0, logger_1.error)(error.message);
    if (error.name === 'CastError' /* && error.kind === 'ObjectId' */) {
        next(error);
        return res.status(400).send({ error: 'malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        next(error);
        return res.status(400).json({ error: error.message });
    }
    else if (error.name === 'JsonWebTokenError') {
        next(error);
        return res.status(401).json({ error: 'invalid token' });
    }
    else {
        next(error);
        return null;
    }
};
exports.errorHandler = errorHandler;
const tokenExtractor = (req, _res, next) => {
    const auth = req.get('authorization');
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
        req.token = auth.substring(7);
        next();
    }
    else {
        next();
    }
};
exports.tokenExtractor = tokenExtractor;
