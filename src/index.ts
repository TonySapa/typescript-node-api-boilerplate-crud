import mongoose, { ConnectOptions } from 'mongoose'
import { MONGODB_URI } from './utils/config'
import { info, error as logError } from './utils/logger'
import app from './app'

mongoose.connect(
  `${MONGODB_URI}`,
  { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions
)
  .then(() => {
    info('connected to MongoDB')
  })
  .catch((error) => {
    logError('error connection to MongoDB:', `${error.message}`)
  })

const PORT = 3000

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`)
})

export default app
