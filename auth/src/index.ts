import { natsWrapper } from '@mickenhosrecipes/common';
import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }


  try {
    await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID!,
			process.env.NATS_CLIENT_ID!,
			`http://${process.env.NATS_SRV_SERVICE_HOST}:${process.env.NATS_SRV_SERVICE_PORT}`);
		natsWrapper.client.on('close', () => {
			console.log('NATS connection closed');
			process.exit();
		});
		process.on('SIGINT', () => natsWrapper.client.close());
		process.on('SIGTERM', () => natsWrapper.client.close());
    
    await mongoose.connect(
      `mongodb://${process.env.AUTH_MONGO_SRV_SERVICE_HOST}:${process.env.AUTH_MONGO_SRV_SERVICE_PORT}/auth`,
      {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true
    });
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
