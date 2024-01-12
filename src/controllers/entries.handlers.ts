import { NextFunction, Request, Response } from 'express'
import EntryModel from '../models/entry/Entry'
import { UserType } from '../models/user/User'
import { CallbackError } from 'mongoose'

/******************************************************************************
 * Stores document in to mongodb collection.
 * @returns a 201 with the new entry as a JSON object.
 *****************************************************************************/
export const saveEntry =
async (req: Request, res: Response, user: UserType | null, next: NextFunction) => {
  const userId = user && user._id?.toString()
  await new EntryModel({ ...req.body, user: userId }).save()
    .then(
      (savedEntry => res.status(201).json(savedEntry)),
      (error) => next(error)
    )
    .catch((error: CallbackError) => next(error))
}
