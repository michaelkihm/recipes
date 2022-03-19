import { currentUser } from '@mickenhosrecipes/common';
import express, { Response } from 'express';
import { UserDoc, UserModel } from '../models/user';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, async (req, res: Response<{ currentUser: UserDoc | null}>) => {

  const currentUser = await UserModel.findById(req.currentUser?.id);
  res.send({ currentUser });
});

export { router as currentUserRouter };
