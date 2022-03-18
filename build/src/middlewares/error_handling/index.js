"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
/* Middleware to factorise error handling and token extraction */
const logger_1 = require("../../utils/logger");
const users_1 = require("../../views/json/users");
/******************************************************************************
 * Error parser to convert into standard API response with expected fields.
 * @param {error} inheritedError The error that is originated from 1st callback
 * @param {function} apiMessage The standarized response to serve on request.
 * @returns A standarized response that will depend on both parameters.
 *****************************************************************************/
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const parseApiError = (inheritedError, apiMessage) => (Object.assign({ verboose: inheritedError }, apiMessage));
/******************************************************************************
 * Middleware to handle errors on routers.
 * @param {Request} req Express request
 * @param {Response} res Express response
 * @param {NextFunction} next Express callback function
 *****************************************************************************/
const errorHandler = (error, _req, res, next) => {
    (0, logger_1.error)(error.message);
    if (error.name === 'CastError && error.kind === "ObjectId"') {
        next(error);
        return res.status(422).send(parseApiError(error, users_1.wrongDocumentId));
    }
    else if (error.name === 'ValidationError') {
        next(error);
        if (error.message.includes('to be unique')) {
            return res.status(409).json(Object.assign({ verboose: error }, (0, users_1.duplicatedValue)(error.message)));
        }
        else {
            return res.status(400).json(parseApiError(error, users_1.unknownError));
        }
    }
    else if (error.name === 'JsonWebTokenError') {
        next(error);
        return res.status(401).json(parseApiError(error, users_1.tokenFailed));
    }
    else {
        next(error);
        return res.status(500).json(error);
    }
};
exports.errorHandler = errorHandler;
