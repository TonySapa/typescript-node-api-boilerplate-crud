/* Middleware to factorise error handling and token extraction */
import { error as logError } from '../../utils/logger';
import { NextFunction, Request, Response } from 'express';

/******************************************************************************
 * Middleware to handle errors on routers.
 * @param {Request} req Express request
 * @param {Response} res Express response
 * @param {NextFunction} next Express callback function
 *****************************************************************************/
export const errorHandler =
  (error: Error, _req: Request, res: Response, next: NextFunction) => {
  
  logError(error.message);

  if (error.name === 'CastError' /* && error.kind === 'ObjectId' */) {
    next(error);
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    next(error);
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    next(error);
    return res.status(401).json({ error: 'invalid token' });
  } else {
    // next(error);
    return res.status(500).json(error);
  }
};
