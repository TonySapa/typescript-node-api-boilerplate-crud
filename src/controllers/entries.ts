import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import EntryModel, { entryType } from '../models/Entry';

const router = express.Router();

declare module 'jsonwebtoken' {
  interface UserIDJwtPayload extends jwt.JwtPayload {
    userId: string
  }
}

/******************************************************************************
 * Health endpoint to monitor that  the route is working
 *****************************************************************************/
 router.get('/ping', (_req, res) => {
  res.send('Hello World');
});

/******************************************************************************
 * Gets all entries without any filters
 * @access token is NOT needed
 * @returns a 200 with all entries.
 *****************************************************************************/
router.get('/', async (_req, res) => {
  const entries = await EntryModel
    .find({}).populate('user', { username: 1, name: 1 });

  res.json(entries);
});

/******************************************************************************
 * Get a specific entry, found by id
 * @access a token is NOT needed
 * @param {string} id the id to match
 * @returns a 200 with the matched entry
 *****************************************************************************/
router.get('/:id', async (req, res) => {
  const entry = await EntryModel.findById(req.params.id);
  entry
    ? res.status(200).json(entry)
    : res.status(404).json({ error: 'No blog found with that id' });
});

/******************************************************************************
 * Deletes a specific entry, found by id
 * @access a token IS needed
 * @param {string} id the id to match
 * @returns a 204 with no content
 *****************************************************************************/
router.delete('/:id', async (req, res) => {
  const decodedToken = <jwt.UserIDJwtPayload><unknown>
    jwt.verify(req.token, `${process.env.SECRET}`);

  const userId = decodedToken.id; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
 
  if (!req.token || !userId) {
    return res.status(401).json({ error: 'token missing or invalid' });
  } else {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User invalid' });
    } else {
      const entry = await EntryModel.findById(req.params.id);
      if (entry && (entry.user.toString() !== userId)) {
        return res
          .status(401).json({ error: 'only the creator can delete it' });
      } else {
        entry && await entry.remove();
        return res.status(204).end();  
      }
    }
  }
});

/******************************************************************************
 * Updates a specific entry, found by id
 * @access a token IS needed
 * @param {string} id the id to match
 * @returns a 200 with the updated entry
 *****************************************************************************/
router.put('/:id', async (req, res) => {
  const entry: entryType = req.body; // eslint-disable-line @typescript-eslint/no-unsafe-assignment

  const updatedEntry = await EntryModel
    .findByIdAndUpdate(req.params.id, entry, { new: true });

  if (!updatedEntry) {
    return res.status(400).send({ error: 'No entry exists with that id' });
  } else {
    return res.json(updatedEntry.toJSON());
  }
});

/******************************************************************************
 * Creates a new entry.
 * @access a token IS needed
 * @param {entryType} entry 
 * @returns a 201 with the new entry
 *****************************************************************************/
router.post('/', async (req, res) => {
  const decodedToken = <jwt.UserIDJwtPayload><unknown>
    jwt.verify(req.token, `${process.env.SECRET}`);
  console.log(req);
  const userId = decodedToken.id; // eslint-disable-line @typescript-eslint/no-unsafe-assignment

  const entry = new EntryModel({ ...req.body, user: userId }); // eslint-disable-line @typescript-eslint/no-unsafe-assignment

  if (!req.token || !userId) {
    return res.status(401).json({ error: 'token missing or invalid' });
  } else {
    entry.user = `${userId}`;
    const savedEntry = await entry.save();
    return res.status(201).json(savedEntry);
  }
});

export default router;
