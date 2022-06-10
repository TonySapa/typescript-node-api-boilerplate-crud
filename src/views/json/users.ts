import { ApiResponse } from '../../types'
import {
  USER_REGISTERED,
  USER_ALREADY_EXISTS,
  EMAIL_MALFORMATTED,
  PASSWORD_SHORT,
  LANGUAGE_UNSPECIFIED,
  INVALID_CONFIRMATION_LINK,
  LOGGIN_FAILED,
  INVALID_TOKEN,
  WRONG_DOCUMENT_ID,
  DUPLICATED_VALUE,
  UNKNOWN_ERROR
} from '../../labels/api_messages/users'

/** When request is fullfilled and user saved to database */
export const userRegistered: ApiResponse = {
  message_code: 2011,
  message_text: USER_REGISTERED
}

/** When there is already a user with the same email */
export const userAlreadyExists: ApiResponse = {
  message_code: 4091,
  message_text: USER_ALREADY_EXISTS
}

/** When the format of the email is wrong */
export const emailMalformatted: ApiResponse = {
  message_code: 4221,
  message_text: EMAIL_MALFORMATTED
}

/** When password is too short */
export const passwordTooShort: ApiResponse = {
  message_code: 4222,
  message_text: PASSWORD_SHORT
}

/* When signup doesn't specify a language. (Is needed for email communication) */
export const languageUnspecified: ApiResponse = {
  message_code: 4223,
  message_text: LANGUAGE_UNSPECIFIED
}

/* When signup confirmation link visited is broke */
export const invalidConfirmationLink: ApiResponse = {
  message_code: 4001,
  message_text: INVALID_CONFIRMATION_LINK
}

/* When login fails */
export const loginFailed: ApiResponse = {
  message_code: 4011,
  message_text: LOGGIN_FAILED
}

/******************************************************************************
 * Mongoose id of document is malformatted or doesn't exist
 * @returns 4224: "Mongoose document is malformatted and a document couldnt..."
 *****************************************************************************/
 export const wrongDocumentId: ApiResponse = {
  message_code: 4224,
  message_text: WRONG_DOCUMENT_ID
}

/******************************************************************************
 * API Response when request fails because of token
 * @returns 4012: "Token is invalid or has expired"
 *****************************************************************************/
 export const tokenFailed: ApiResponse = {
  message_code: 4012,
  message_text: INVALID_TOKEN
}

/******************************************************************************
 * Mongoose id of document is malformatted or doesn't exist
 * @returns 4092: "A value should be unique but is duplicated."
 *****************************************************************************/
 export const duplicatedValue = (message: string): ApiResponse => ({
  message_code: 4092,
  message_text: message || DUPLICATED_VALUE
})

/******************************************************************************
 * Unknown errors
 * @returns 400: "An unknown error has ocurred"
 *****************************************************************************/
 export const unknownError: ApiResponse = {
  message_code: 4012,
  message_text: UNKNOWN_ERROR
}
