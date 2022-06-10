/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import express, { Request, Response } from 'express'
import { sendEmail } from '../utils/emails/send'

const router = express.Router()

/******************************************************************************
 * Health endpoint to monitor that the route is working
 *****************************************************************************/
router.get('/ping', (_req, res) => {
  res.send('Hello World')
})

/******************************************************************************
 * Health endpoint to monitor Mailjet API
 * @param {string} email where the mail will be delivered
 * @returns string "Hello World" and also sends html to that email
 *****************************************************************************/
router.get('/ping-mailjet/:email', (req: Request, res: Response) => {
  const emailConfig = {
    template: 'ping.hbs',
    email_recipient: req.params.email,
    name_recipient: 'Toni Sánchez',
    subject: 'Welcome. Please confirm your sign up'
  }

  const emailVars = {}
  sendEmail(emailConfig, emailVars)
    .then(() => res.send('Hello World'))
    .catch((error: Error) => res.status(400).send(`${error}`))
})

export default router
