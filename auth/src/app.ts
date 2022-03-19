import { currentUser, errorHandler, NotFoundError } from '@mickenhosrecipes/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { currentUserRouter } from './routes/current-user';
import { deleteUserRouter } from './routes/delete';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { updateUserRouter } from './routes/update';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use('/api/users/images', express.static('images'));
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);

app.use(currentUser);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(deleteUserRouter);
app.use(updateUserRouter)

app.all('*', async (_req, _res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
