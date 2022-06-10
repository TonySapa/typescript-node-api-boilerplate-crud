import cors from 'cors'
import express from 'express'
import { info } from './utils/logger'
import { tokenExtractor } from './middlewares/authentication'
import userRouter from './controllers/users'
import emailsRouter from './controllers/emails'
import entriesRouter from './controllers/entries'
import { engine } from 'express-handlebars'
import { errorHandler } from './middlewares/error_handling'

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.json())
app.use(tokenExtractor)
app.use(errorHandler)
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.get('/ping', (_req, res) => {
  info('someone pinged here')
  res.send('pong')
})

app.use('/api/users', userRouter)
app.use('/api/emails', emailsRouter)
app.use('/api/entries', entriesRouter, errorHandler)

export default app
