import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user/User';
import { UserToSignup } from '../types';
import { userRegistered, passwordTooShort, languageUnspecified, invalidConfirmationLink, loginFailed } from '../views/json/users';
import { validatePassword } from './users_handlers';
import { sendEmail } from '../utils/emails/send';
import { API_URL } from '../utils/config';
import jwt from 'jsonwebtoken';
import { USER_LANGUAGES } from '../domain';
// import { typesOfAccountStatus } from '../business_logic/index';

const router = express.Router();

/** Route to monitor health of application */
router.get('/ping', (_req, res: Response) => {
  res.send('Hello World');
});

/** User sign-up endpoint through Bearer token. Taking email and password as
 * parameters, stores it into mongodb and sends email of confirmation.
 * The response is a 201 informing the user that an email of confirmation
 * has been sent. */
router.post('/signup', async (req: Request<UserToSignup>, res: Response) => {
  const saltRounds = 10;
  const password = `${req.body.password}`;
  const email = `${req.body.email}`;
  const language = `${req.body.language}`;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const account_status_token = await bcrypt.hash(email, saltRounds);

  if (!USER_LANGUAGES.includes(language)) {
    return res.status(422).json(languageUnspecified);
  }

  const user = new User({
    email: email,
    passwordHash: passwordHash,
    account_status_token: account_status_token
  });

  const template = `signup_confirmation_${language}.hbs`;
  if (!language) {
    return res.status(422).json(languageUnspecified);
  } else if (!validatePassword(password)) {
    return res.status(422).json(passwordTooShort);
  } else {
    // Successfully saved
    const emailConfig = {
      template: template,
      email_recipient: email,
      // name_recipient: '',
      subject: 'Welcome. Please confirm your sign up'
    };

    const emailVars = {
      signup_confirmation_url: `${API_URL}/users/signup/${account_status_token}`
    };

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
          throw new Error(`Couldn't store on mongo. ${error}`);
        }))
      .catch((error: Error) => res.status(400).send(`${error}`));
  }
});

/** User will request this url to confirm email on signup. */
router.get('/signup/:account_status_token', async (req: Request, res: Response) => {
  const account_status_token = req.params.account_status_token;
  // Find user by signup_confirmation_url
  const user = await User.findOne({ account_status_token: account_status_token });
  const crud = { account_status: 'active', account_status_token: null };

  if (user) {
    User.updateOne(
      { account_status_token: account_status_token },
      { $set: crud }
    )
      .then(() => res.status(200).json({
        ...userRegistered,
        crud: {
          before: user,
          after: { ...user, ...crud }
        }
      }))
      .catch((error: Error) => res.status(400).send(`${error}`));
  } else {
    res.status(400).send(invalidConfirmationLink);
  }
});

/** Login Endpoint */
router.post('/login', async (req: Request<UserToSignup>, res: Response) => {
  const password = `${req.body.password}`;
  const email = `${req.body.email}`;

  type NullableUser<UserToSignup> = UserToSignup | null;

  const user: NullableUser<UserToSignup> = await User.findOne({ email: email });
  const passwordHash = `${user ? user.passwordHash: ''}`;
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).send(loginFailed);
  }

  // If account_status !== 'active'. By default we will accept unconfirmed emails
  // so users can start using the app without any hassle.

  /* if (user.account_status !== typesOfAccountStatus[1]) {
    return res.status(401).send('Account is not validated');
  } */

  const userForToken = {
    email: user.email,
    password: user.passwordHash
  };

  const token = jwt.sign(userForToken, `${process.env.SECRET}`);

  return res.status(200).send({ token, email: user.email });
});

export default router;
