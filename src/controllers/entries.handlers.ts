import { NextFunction, Request, Response } from 'express'
import EntryModel from '../models/entry/Entry'
import { entryType } from '../models/entry/entry.types'
import { UserType } from '../models/user/User'

/******************************************************************************
 * Stores document in to mongodb collection.
 * @param {Request} req the http request
 * @param {Response} res the http response of the API.
 * @param {UserType} user the authenticated user requesting the CRUD operation.
 * @param {NextFunction} next callback function.
 * @returns a 201 with the new entry
 *****************************************************************************/
export const saveEntry =
(req: Request, res: Response, user: UserType | null, next: NextFunction) => {
  const userId = user && user._id?.toString()
  new EntryModel({ ...req.body, user: userId })
    .save((error, savedEntry: entryType) => {
      if (error) {
        return next(error)
      } else {
        return res.status(201).json(savedEntry)
      }
    })
}
