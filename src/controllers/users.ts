import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user/User'
import { UserToSignup } from '../types'
import {
  userRegistered,
  passwordTooShort,
  languageUnspecified,
  invalidConfirmationLink,
  loginFailed
} from '../views/json/users'
import { validatePassword } from './users_handlers'
import { sendEmail } from '../utils/emails/send'
import { API_URL } from '../utils/config'
import jwt from 'jsonwebtoken'
import { USER_LANGUAGES } from '../domain'

const router = express.Router()

/******************************************************************************
 * Route to monitor health of application
 *****************************************************************************/
router.get('/ping', (_req, res: Response) => {
  res.send('Hello World')
})

/******************************************************************************
 * User sign-up endpoint through Bearer token. Taking email and password as
 * parameters, stores it into mongodb and sends email of confirmation.
 * The response is a 201 informing the user that an email of confirmation has
 * been sent.
 * @param {string} email user email to register.
 * @param {string} password user literal password.
 *****************************************************************************/
router.post('/signup', async (req: Request<UserToSignup>, res: Response) => {
  const saltRounds = 10
  const { email, password, language } = req.body as UserToSignup
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const accountStatusToken = await bcrypt.hash(email, saltRounds)

  if (!USER_LANGUAGES.includes(language || 'enUS')) {
    return res.status(422).json(languageUnspecified)
  }

  const user = new User({
    email,
    passwordHash,
    accountStatusToken
  })

  const template = `signup_confirmation_${language}.hbs`
  if (!language) {
    return res.status(422).json(languageUnspecified)
  } else if (!validatePassword(password)) {
    return res.status(422).json(passwordTooShort)
  } else {
    // Successfully saved
    const emailConfig = {
      template,
      email_recipient: email,
      // name_recipient: '',
      subject: 'Welcome. Please confirm your sign up'
    }

    const emailVars = {
      signup_confirmation_url: `${API_URL}/users/signup/${accountStatusToken}`
    }

    return sendEmail(emailConfig, emailVars)
      .then(() => user.save()
        .then((savedUser) => res.status(201).json({
          ...userRegistered,
          crud: {
            before: null,
            after: savedUser
          }
        }))
        .catch((error: Error) => {
          throw new Error(`Couldn't store on mongo. ${error}`)
        }))
      .catch((error: Error) => res.status(400).send(`${error}`))
  }
})

/******************************************************************************
 * User will request this url to confirm email on signup. Is the link that
 * appears on confirmation email.
 * @return void. On visit, user record on database will be registered as
 * confirmed.
 *****************************************************************************/
router.get('/signup/:accountStatusToken', async (req: Request, res: Response) => {
  const accountStatusToken = req.params.accountStatusToken
  // Find user by signup_confirmation_url
  const user = await User.findOne({ accountStatusToken })
  const crud = { account_status: 'active', accountStatusToken: null }

  if (user) {
    User.updateOne(
      { accountStatusToken },
      { $set: crud }
    )
      .then(() => res.status(200).json({
        ...userRegistered,
        crud: {
          before: user,
          after: { ...user, ...crud }
        }
      }))
      .catch((error: Error) => res.status(400).send(`${error}`))
  } else {
    res.status(400).send(invalidConfirmationLink)
  }
})

/******************************************************************************
 * User will post email and password to log in to the application.
 * @returns {object} token and email fields.
 *****************************************************************************/
router.post('/login', async (req: Request<UserToSignup>, res: Response) => {
  const password = `${req.body.password}`
  const email = `${req.body.email}`

  type NullableUser<UserToSignup> = UserToSignup | null

  const user: NullableUser<UserToSignup> = await User.findOne({ email })
  const passwordHash = `${user ? user.passwordHash: ''}`
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).send(loginFailed)
  }

  // If account_status !== 'active'. By default we will accept unconfirmed emails
  // so users can start using the app without any hassle.

  /* if (user.account_status !== typesOfAccountStatus[1]) {
    return res.status(401).send('Account is not validated')
  } */

  const userForToken = {
    email: user.email,
    password: user.passwordHash
  }

  const token = jwt.sign(userForToken, `${process.env.SECRET}`)

  return res.status(200).send({ token, email: user.email })
})

export default router
