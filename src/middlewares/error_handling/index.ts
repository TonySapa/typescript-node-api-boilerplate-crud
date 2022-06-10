/* Middleware to factorise error handling and token extraction */
import { error as logError } from '../../utils/logger'
import { NextFunction, Request, Response } from 'express'
import { duplicatedValue, tokenFailed, unknownError, wrongDocumentId } from '../../views/json/users'
import { ApiResponse } from '../../types'

/******************************************************************************
 * Error parser to convert into standard API response with expected fields.
 * @param {error} inheritedError The error that is originated from 1st callback
 * @param {function} apiMessage The standarized response to serve on request.
 * @returns A standarized response that will depend on both parameters.
 *****************************************************************************/
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const parseApiError =
(inheritedError: Error, apiMessage: ApiResponse): ApiResponse => ({
  verboose: inheritedError,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  ...apiMessage
})

/******************************************************************************
 * Middleware to handle errors on routers.
 * @param {Request} req Express request
 * @param {Response} res Express response
 * @param {NextFunction} next Express callback function
 *****************************************************************************/
export const errorHandler =
(error: Error, _req: Request, res: Response, next: NextFunction) => {
  logError(error.message)

  if (error.name === 'CastError && error.kind === "ObjectId"') {
    next(error)
    return res.status(422).send(parseApiError(error, wrongDocumentId))
  } else if (error.name === 'ValidationError') {
    next(error)
    if (error.message.includes('to be unique')) {
      return res.status(409).json({
        verboose: error,
        ...duplicatedValue(error.message)
      })
    } else {
      return res.status(400).json(parseApiError(error, unknownError))
    }
  } else if (error.name === 'JsonWebTokenError') {
    next(error)
    return res.status(401).json(parseApiError(error, tokenFailed))
  } else {
    next(error)
    return res.status(500).json(error)
  }
}
