import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { MONGODB_URI } from './utils/config';
import { info, error as logError } from './utils/logger';
import { tokenExtractor } from './utils/middleware';
import userRouter from './controllers/users';
import emailsRouter from './controllers/emails';
import entriesRouter from './controllers/entries';
import { engine } from 'express-handlebars';

const app = express();
app.use(express.json());
mongoose.connect(
  `${MONGODB_URI}`,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => {
    info('connected to MongoDB');
  })
  .catch((error) => {
    logError('error connection to MongoDB:', `${error.message}`);
  });

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

const PORT = 3000;

app.get('/ping', (_req, res) => {
  info('someone pinged here');
  res.send('pong');
});

app.use('/api/users', userRouter);
app.use('/api/emails', emailsRouter);
app.use('/api/entries', entriesRouter);

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`);
});

export default app;
