/* Middleware to factorise error handling and token extraction */
import { error as logError } from './logger';
import { NextFunction, Request, Response } from 'express';

export const errorHandler = (error: Error, _req: Request, res: Response, next: NextFunction) => {
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
    next(error);
    return null;
  }
};

declare module 'express-serve-static-core' {
  interface Request {
    token: string
  }
}

export const tokenExtractor = (req: Request, _res: Response, next: NextFunction) => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    req.token = auth.substring(7);
    next();
  } else {
    next();
  }
};
