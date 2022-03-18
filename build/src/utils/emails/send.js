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
exports.sendEmail = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../logger");
require('dotenv').config();
const hb = require('express-handlebars').create();
const sendEmail = (config, vars) => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'https://api.mailjet.com/v3.1/send';
    const options = {
        headers: { 'Content-Type': 'application/json' },
        auth: {
            'username': `${process.env.MAILJET_APIKEY}`,
            'password': `${process.env.MAILJET_SECRET}`
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const html = yield hb.render(`./src/views/${config.template}`, {
        CONFIRMATION_URL: vars.signup_confirmation_url,
        WORKFLOW_EXIT_LINK_EN: 'https://ticktax.io/unsubscribe-demo',
        WORKFLOW_EXIT_UNSUB_LINK_EN: 'https://ticktax.io/unsubscribe-all',
        EMAIL_TO: config.email_recipient
    })
        .then((renderedHtml) => renderedHtml);
    (0, logger_1.log)(html);
    const data = {
        'Messages': [
            {
                From: {
                    Email: process.env.MAILJET_EMAIL_SENDER,
                    Name: 'Mailjet Pilot'
                },
                To: [
                    {
                        Email: config.email_recipient
                        // Name: 'Mailjet Pilot'
                    }
                ],
                TextPart: 'Dear passenger, welcome to Mailjet! May the delivery force be with you!',
                HTMLPart: html,
                TemplateLanguage: true,
                Subject: 'My custom subject'
                /* Variables: {
                  day: 'Tuesday',
                  personalMessage: 'Hello world'
                } */
            }
        ]
    };
    if (!config.email_recipient) {
        throw new Error('Request is missing recipient email address.');
    }
    else if (!config.subject) {
        throw new Error('Request is missing email subject.');
    }
    yield axios_1.default.post(url, data, options)
        .then(res => res)
        .catch((error) => {
        (0, logger_1.error)(`Mailjet API Error: ${error}`);
        throw new Error(`Mailjet API Error ${error}`);
    })
        .finally(() => (0, logger_1.log)(data));
});
exports.sendEmail = sendEmail;
