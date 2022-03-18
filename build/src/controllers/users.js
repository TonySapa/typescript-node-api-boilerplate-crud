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
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/user/User"));
const users_1 = require("../views/json/users");
const users_handlers_1 = require("./users_handlers");
const send_1 = require("../utils/emails/send");
const config_1 = require("../utils/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const domain_1 = require("../domain");
// import { typesOfAccountStatus } from '../business_logic/index';
const router = express_1.default.Router();
/** Route to monitor health of application */
router.get('/ping', (_req, res) => {
    res.send('Hello World');
});
/** User sign-up endpoint through Bearer token. Taking email and password as
 * parameters, stores it into mongodb and sends email of confirmation.
 * The response is a 201 informing the user that an email of confirmation
 * has been sent. */
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    const password = `${req.body.password}`;
    const email = `${req.body.email}`;
    const language = `${req.body.language}`;
    const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
    const account_status_token = yield bcrypt_1.default.hash(email, saltRounds);
    if (!domain_1.USER_LANGUAGES.includes(language)) {
        return res.status(422).json(users_1.languageUnspecified);
    }
    const user = new User_1.default({
        email: email,
        passwordHash: passwordHash,
        account_status_token: account_status_token
    });
    const template = `signup_confirmation_${language}.hbs`;
    if (!language) {
        return res.status(422).json(users_1.languageUnspecified);
    }
    else if (!(0, users_handlers_1.validatePassword)(password)) {
        return res.status(422).json(users_1.passwordTooShort);
    }
    else {
        // Successfully saved
        const emailConfig = {
            template: template,
            email_recipient: email,
            // name_recipient: '',
            subject: 'Welcome. Please confirm your sign up'
        };
        const emailVars = {
            signup_confirmation_url: `${config_1.API_URL}/users/signup/${account_status_token}`
        };
        return (0, send_1.sendEmail)(emailConfig, emailVars)
            .then(() => user.save()
            .then((savedUser) => res.status(201).json(Object.assign(Object.assign({}, users_1.userRegistered), { crud: {
                before: null,
                after: savedUser
            } })))
            .catch((error) => {
            throw new Error(`Couldn't store on mongo. ${error}`);
        }))
            .catch((error) => res.status(400).send(`${error}`));
    }
}));
/** User will request this url to confirm email on signup. */
router.get('/signup/:account_status_token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account_status_token = req.params.account_status_token;
    // Find user by signup_confirmation_url
    const user = yield User_1.default.findOne({ account_status_token: account_status_token });
    const crud = { account_status: 'active', account_status_token: null };
    if (user) {
        User_1.default.updateOne({ account_status_token: account_status_token }, { $set: crud })
            .then(() => res.status(200).json(Object.assign(Object.assign({}, users_1.userRegistered), { crud: {
                before: user,
                after: Object.assign(Object.assign({}, user), crud)
            } })))
            .catch((error) => res.status(400).send(`${error}`));
    }
    else {
        res.status(400).send(users_1.invalidConfirmationLink);
    }
}));
/** Login Endpoint */
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = `${req.body.password}`;
    const email = `${req.body.email}`;
    const user = yield User_1.default.findOne({ email: email });
    const passwordHash = `${user ? user.passwordHash : ''}`;
    const passwordCorrect = user === null
        ? false
        : yield bcrypt_1.default.compare(password, passwordHash);
    if (!(user && passwordCorrect)) {
        return res.status(401).send(users_1.loginFailed);
    }
    // If account_status !== 'active'. By default we will accept unconfirmed emails
    // so users can start using the app without any hassle.
    /* if (user.account_status !== typesOfAccountStatus[1]) {
      return res.status(401).send('Account is not validated');
    } */
    const userForToken = {
        email: user.email,
        password: user.passwordHash
    };
    const token = jsonwebtoken_1.default.sign(userForToken, `${process.env.SECRET}`);
    return res.status(200).send({ token, email: user.email });
}));
exports.default = router;
