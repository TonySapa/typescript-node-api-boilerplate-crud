"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveEntry = void 0;
const Entry_1 = __importDefault(require("../models/entry/Entry"));
/******************************************************************************
 * Stores document in to mongodb collection.
 * @param {Request} req the http request
 * @param {Response} res the http response of the API.
 * @param {UserType} user the authenticated user requesting the CRUD operation.
 * @param {NextFunction} next callback function.
 * @returns a 201 with the new entry
 *****************************************************************************/
const saveEntry = (req, res, user, next) => {
    var _a;
    const userId = user && ((_a = user._id) === null || _a === void 0 ? void 0 : _a.toString());
    new Entry_1.default(Object.assign(Object.assign({}, req.body), { user: userId }))
        .save((error, savedEntry) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(201).json(savedEntry);
        }
    });
};
exports.saveEntry = saveEntry;
