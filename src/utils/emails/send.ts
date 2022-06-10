/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios'
import { error as logError, log } from '../logger'
require('dotenv').config()
const hb = require('express-handlebars').create()

interface EmailConfig {
  template: string
  email_recipient: string,
  name_recipient?: string,
  subject: string
}

interface EmailVars {
  signup_confirmation_url?: string
}

export const sendEmail = async (config: EmailConfig, vars: EmailVars) => {
  const url = 'https://api.mailjet.com/v3.1/send'
  const options = {
    headers: { 'Content-Type': 'application/json' },
    auth: {
      'username': `${process.env.MAILJET_APIKEY}`,
      'password': `${process.env.MAILJET_SECRET}`
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const html = await hb.render(
    `./src/views/${config.template}`,
    {
      CONFIRMATION_URL: vars.signup_confirmation_url,
      WORKFLOW_EXIT_LINK_EN: 'https://ticktax.io/unsubscribe-demo',
      WORKFLOW_EXIT_UNSUB_LINK_EN: 'https://ticktax.io/unsubscribe-all',
      EMAIL_TO: config.email_recipient
    }
  )
    .then((renderedHtml: HTMLScriptElement) => renderedHtml)

  log(html)

  const data = {          
    'Messages': [
      {
        From: {
          Email: process.env.MAILJET_EMAIL_SENDER,
          Name: 'Mailjet Pilot'
        },
        To: [
          {
            Email: config.email_recipient
            // Name: 'Mailjet Pilot'
          }
        ],
        TextPart: 'Dear passenger, welcome to Mailjet! May the delivery force be with you!',
        HTMLPart: html,
        TemplateLanguage: true,
        Subject: 'My custom subject'
        /* Variables: {
          day: 'Tuesday',
          personalMessage: 'Hello world'
        } */
      }
    ]
	}

  if (!config.email_recipient) {
    throw new Error('Request is missing recipient email address.')
  } else if (!config.subject) {
    throw new Error('Request is missing email subject.')
  }

  await axios.post(url, data, options)
    .then(res => res)
    .catch((error: Error) => {
      logError(`Mailjet API Error: ${error}`)
      throw new Error(`Mailjet API Error ${error}`)
    })
    .finally(() => log(data))
}
