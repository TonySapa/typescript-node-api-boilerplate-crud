import mongoose from 'mongoose'
import { MONGODB_URI, PORT } from './utils/config'
import { info, error as logError } from './utils/logger'
import app from './app'

mongoose.connect(
  `${MONGODB_URI}`
)
  .then(() => {
    info('connected to MongoDB')
  })
  .catch((error) => {
    logError('error connection to MongoDB:', `${error.message}`)
  })

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`)
})

export default app
