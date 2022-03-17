"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
const express_1 = __importDefault(require("express"));
const send_1 = require("../utils/emails/send");
const router = express_1.default.Router();
/******************************************************************************
 * Health endpoint to monitor that the route is working
 *****************************************************************************/
router.get('/ping', (_req, res) => {
    res.send('Hello World');
});
/******************************************************************************
 * Health endpoint to monitor Mailjet API
 * @param {string} email where the mail will be delivered
 * @returns string "Hello World" and also sends html to that email
 *****************************************************************************/
router.get('/ping-mailjet/:email', (req, res) => {
    const emailConfig = {
        template: 'ping.hbs',
        email_recipient: req.params.email,
        name_recipient: 'Toni Sánchez',
        subject: 'Welcome. Please confirm your sign up',
    };
    const emailVars = {};
    (0, send_1.sendEmail)(emailConfig, emailVars)
        .then(() => res.send('Hello World'))
        .catch((error) => res.status(400).send(`${error}`));
});
exports.default = router;
