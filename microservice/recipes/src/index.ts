import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }


  try {
    await mongoose.connect(
      `mongodb://${process.env.RECIPES_MONGO_SRV_SERVICE_HOST}:${process.env.RECIPES_MONGO_SRV_SERVICE_PORT}/recipes`,
      {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
    });
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3001, () => {
    console.log('Listening on port 3001');
  });
};

start();
