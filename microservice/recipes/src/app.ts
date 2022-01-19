import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler, currentUser } from '@mickenhosrecipes/common';
import { newRecipeRouter } from './routes/new';
import { indexRecipeRouter } from './routes';
import { deleteRecipeRouter } from './routes/delete';
import { getRecipeRouter } from './routes/get';
import { updateRecipeRouter } from './routes/update';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use('/images', express.static('/images'));

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);
app.use(currentUser);
app.use(newRecipeRouter);
app.use(indexRecipeRouter);
app.use(deleteRecipeRouter);
app.use(getRecipeRouter);
app.use(updateRecipeRouter);

app.all('*', async (_req, _res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
