import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user/User'
import EntryModel from '../models/entry/Entry'
import { entryType } from '../models/entry/entry.types'
import { saveEntry } from './entries.handlers'
// import { tokenFailed } from '../views/json/users'

const router = express.Router()

declare module 'jsonwebtoken' {
  // eslint-disable-next-line no-unused-vars
  interface UserIDJwtPayload extends jwt.JwtPayload {
    email: string
  }
}

/******************************************************************************
 * Health endpoint to monitor that  the route is working
 *****************************************************************************/
router.get('/ping', (_req, res) => {
  res.send('Hello World')
})

/******************************************************************************
 * Gets all entries without any filters
 * @access token is NOT needed
 * @returns a 200 with all entries.
 *****************************************************************************/
router.get('/', async (_req, res) => {
  const entries = await EntryModel
    .find({}).populate('user', { username: 1, name: 1 })

  res.json(entries)
})

/******************************************************************************
 * Get a specific entry, found by id
 * @access a token is NOT needed
 * @param {string} id the id to match
 * @returns a 200 with the matched entry
 *****************************************************************************/
router.get('/:id', async (req, res) => {
  const entry = await EntryModel.findById(req.params.id)
  entry
    ? res.status(200).json(entry)
    : res.status(404).json({ error: 'No blog found with that id' })
})

/******************************************************************************
 * Deletes a specific entry, found by id
 * @access a token IS needed
 * @param {string} id the id to match
 * @returns a 204 with no content
 *****************************************************************************/
router.delete('/:id', async (req, res) => {
  const decodedToken = <jwt.UserIDJwtPayload><unknown>
    jwt.verify(req.token, `${process.env.SECRET}`)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const userId = decodedToken.id

  if (!req.token || !userId) {
    return res.status(401).json({ error: 'token missing or invalid' })
  } else {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(401).json({ error: 'User invalid' })
    } else {
      const entry = await EntryModel.findById(req.params.id)
      if (entry && (entry.user.toString() !== userId)) {
        return res
          .status(401).json({ error: 'only the creator can delete it' })
      } else {
        entry && await entry.remove()
        return res.status(204).end()
      }
    }
  }
})

/******************************************************************************
 * Updates a specific entry, found by id
 * @access a token IS needed
 * @param {string} id the id to match
 * @returns a 200 with the updated entry
 *****************************************************************************/
router.put('/:id', async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const entry: entryType = req.body

  const updatedEntry = await EntryModel
    .findByIdAndUpdate(req.params.id, entry, { new: true })

  if (!updatedEntry) {
    return res.status(400).send({ error: 'No entry exists with that id' })
  } else {
    return res.json(updatedEntry.toJSON())
  }
})

/******************************************************************************
 * Creates a new entry.
 * @access a token IS needed
 * @param {entryType} entry
 * @returns a 201 with the new entry
 *****************************************************************************/
router.post('/', (req, res, next) => {
  // Verify authentication by decoding bearer token.
  return jwt.verify(
    req.token,
    `${process.env.SECRET}`,
    (error, decodedToken) => {
      if (error) {
        return next(error)
      } else {
        // Find and assign the logged in user to the entry and save it.
        User
          .findOne({
            email: (<jwt.UserIDJwtPayload><unknown>decodedToken).email
          })
          .exec((error, user) => error
            ? next(error)
            : saveEntry(req, res, user, next)
          )
      }
    })
})

export default router
