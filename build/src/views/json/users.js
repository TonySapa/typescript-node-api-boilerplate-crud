"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownError = exports.duplicatedValue = exports.tokenFailed = exports.wrongDocumentId = exports.loginFailed = exports.invalidConfirmationLink = exports.languageUnspecified = exports.passwordTooShort = exports.emailMalformatted = exports.userAlreadyExists = exports.userRegistered = void 0;
const users_1 = require("../../labels/api_messages/users");
/** When request is fullfilled and user saved to database */
exports.userRegistered = {
    message_code: 2011,
    message_text: users_1.USER_REGISTERED
};
/** When there is already a user with the same email */
exports.userAlreadyExists = {
    message_code: 4091,
    message_text: users_1.USER_ALREADY_EXISTS
};
/** When the format of the email is wrong */
exports.emailMalformatted = {
    message_code: 4221,
    message_text: users_1.EMAIL_MALFORMATTED
};
/** When password is too short */
exports.passwordTooShort = {
    message_code: 4222,
    message_text: users_1.PASSWORD_SHORT
};
/* When signup doesn't specify a language. (Is needed for email communication) */
exports.languageUnspecified = {
    message_code: 4223,
    message_text: users_1.LANGUAGE_UNSPECIFIED
};
/* When signup confirmation link visited is broke */
exports.invalidConfirmationLink = {
    message_code: 4001,
    message_text: users_1.INVALID_CONFIRMATION_LINK
};
/* When login fails */
exports.loginFailed = {
    message_code: 4011,
    message_text: users_1.LOGGIN_FAILED
};
/******************************************************************************
 * Mongoose id of document is malformatted or doesn't exist
 * @returns 4224: "Mongoose document is malformatted and a document couldnt..."
 *****************************************************************************/
exports.wrongDocumentId = {
    message_code: 4224,
    message_text: users_1.WRONG_DOCUMENT_ID
};
/******************************************************************************
 * API Response when request fails because of token
 * @returns 4012: "Token is invalid or has expired"
 *****************************************************************************/
exports.tokenFailed = {
    message_code: 4012,
    message_text: users_1.INVALID_TOKEN
};
/******************************************************************************
 * Mongoose id of document is malformatted or doesn't exist
 * @returns 4092: "A value should be unique but is duplicated."
 *****************************************************************************/
const duplicatedValue = (message) => ({
    message_code: 4092,
    message_text: message || users_1.DUPLICATED_VALUE
});
exports.duplicatedValue = duplicatedValue;
/******************************************************************************
 * Unknown errors
 * @returns 400: "An unknown error has ocurred"
 *****************************************************************************/
exports.unknownError = {
    message_code: 4012,
    message_text: users_1.UNKNOWN_ERROR
};
