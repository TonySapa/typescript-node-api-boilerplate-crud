"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/user/User"));
const Entry_1 = __importDefault(require("../models/entry/Entry"));
const users_1 = require("../views/json/users");
const router = express_1.default.Router();
/******************************************************************************
 * Health endpoint to monitor that  the route is working
 *****************************************************************************/
router.get('/ping', (_req, res) => {
    res.send('Hello World');
});
/******************************************************************************
 * Gets all entries without any filters
 * @access token is NOT needed
 * @returns a 200 with all entries.
 *****************************************************************************/
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entries = yield Entry_1.default
        .find({}).populate('user', { username: 1, name: 1 });
    res.json(entries);
}));
/******************************************************************************
 * Get a specific entry, found by id
 * @access a token is NOT needed
 * @param {string} id the id to match
 * @returns a 200 with the matched entry
 *****************************************************************************/
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = yield Entry_1.default.findById(req.params.id);
    entry
        ? res.status(200).json(entry)
        : res.status(404).json({ error: 'No blog found with that id' });
}));
/******************************************************************************
 * Deletes a specific entry, found by id
 * @access a token IS needed
 * @param {string} id the id to match
 * @returns a 204 with no content
 *****************************************************************************/
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = jsonwebtoken_1.default.verify(req.token, `${process.env.SECRET}`);
    const userId = decodedToken.id; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    if (!req.token || !userId) {
        return res.status(401).json({ error: 'token missing or invalid' });
    }
    else {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(401).json({ error: 'User invalid' });
        }
        else {
            const entry = yield Entry_1.default.findById(req.params.id);
            if (entry && (entry.user.toString() !== userId)) {
                return res
                    .status(401).json({ error: 'only the creator can delete it' });
            }
            else {
                entry && (yield entry.remove());
                return res.status(204).end();
            }
        }
    }
}));
/******************************************************************************
 * Updates a specific entry, found by id
 * @access a token IS needed
 * @param {string} id the id to match
 * @returns a 200 with the updated entry
 *****************************************************************************/
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = req.body; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const updatedEntry = yield Entry_1.default
        .findByIdAndUpdate(req.params.id, entry, { new: true });
    if (!updatedEntry) {
        return res.status(400).send({ error: 'No entry exists with that id' });
    }
    else {
        return res.json(updatedEntry.toJSON());
    }
}));
/******************************************************************************
 * Creates a new entry.
 * @access a token IS needed
 * @param {entryType} entry
 * @returns a 201 with the new entry
 *****************************************************************************/
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 1 - Get token and user data
    const decodedToken = jsonwebtoken_1.default.verify(req.token, `${process.env.SECRET}`);
    // 2 - Find if user exists and get id
    const user = yield User_1.default.findOne({ email: decodedToken.email });
    console.log(decodedToken.email);
    const userId = user && ((_a = user._id) === null || _a === void 0 ? void 0 : _a.toString()); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    // Reject requests where token or user are invalid
    if (!req.token || !user) {
        return res.status(401).json(users_1.tokenFailed);
        // Accept valid requests
    }
    else {
        const entry = new Entry_1.default(req.body); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        entry.user = `${userId}`;
        const savedEntry = yield entry.save();
        return res.status(201).json(savedEntry);
    }
}));
exports.default = router;
