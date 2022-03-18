"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenExtractor = void 0;
/******************************************************************************
 * Middleware to extract bearer token substring and attach to request.
 * @param {Request} req Express request
 * @param {Response} res Express response
 * @param {NextFunction} next Express callback function
 * @returns token that can be accessed as req.token
 *****************************************************************************/
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
