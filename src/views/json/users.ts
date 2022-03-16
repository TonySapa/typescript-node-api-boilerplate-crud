import { ApiResponse } from '../../types';
import {
  USER_REGISTERED,
  USER_ALREADY_EXISTS,
  EMAIL_MALFORMATTED,
  PASSWORD_SHORT,
  LANGUAGE_UNSPECIFIED,
  INVALID_CONFIRMATION_LINK,
  LOGGIN_FAILED
} from '../../labels/api_messages/users';

/** When request is fullfilled and user saved to database */
export const userRegistered: ApiResponse = {
  message_code: 2011,
  message_text: USER_REGISTERED
};

/** When there is already a user with the same email */
export const userAlreadyExists: ApiResponse = {
  message_code: 4091,
  message_text: USER_ALREADY_EXISTS
};

/** When the format of the email is wrong */
export const emailMalformatted: ApiResponse = {
  message_code: 4221,
  message_text: EMAIL_MALFORMATTED
};

/** When password is too short */
export const passwordTooShort: ApiResponse = {
  message_code: 4222,
  message_text: PASSWORD_SHORT
};

/* When signup doesn't specify a language. (Is needed for email communication) */
export const languageUnspecified: ApiResponse = {
  message_code: 4223,
  message_text: LANGUAGE_UNSPECIFIED
};

/* When signup confirmation link visited is broke */
export const invalidConfirmationLink: ApiResponse = {
  message_code: 4001,
  message_text: INVALID_CONFIRMATION_LINK
};

/* When login fails */
export const loginFailed: ApiResponse = {
  message_code: 4011,
  message_text: LOGGIN_FAILED
};
