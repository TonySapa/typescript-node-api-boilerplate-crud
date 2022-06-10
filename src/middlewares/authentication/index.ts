import { NextFunction, Request, Response } from 'express'

declare module 'express-serve-static-core' {
  // eslint-disable-next-line no-unused-vars
  interface Request {
    token: string
  }
}

/******************************************************************************
 * Middleware to extract bearer token substring and attach to request.
 * @param {Request} req Express request
 * @param {Response} res Express response
 * @param {NextFunction} next Express callback function
 * @returns token that can be accessed as req.token
 *****************************************************************************/
export const tokenExtractor =
(req: Request, _res: Response, next: NextFunction) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    req.token = auth.substring(7)
    next()
  } else {
    next()
  }
}
