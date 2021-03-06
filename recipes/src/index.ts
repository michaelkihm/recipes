import { natsWrapper } from '@mickenhosrecipes/common';
import mongoose from 'mongoose';
import { app } from './app';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { UserDeletedListener } from './events/listeners/user-deleted-listener';
import { UserUpdatedListener } from './events/listeners/user-updated-listener';


const setupNatsStreamingServer = async () => {

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

	new UserCreatedListener(natsWrapper.client).listen();
	new UserUpdatedListener(natsWrapper.client).listen();
	new UserDeletedListener(natsWrapper.client).listen();
};

const setupMongoDB = async () => {

	await mongoose.connect(
		`mongodb://${process.env.RECIPES_MONGO_SRV_SERVICE_HOST}:${process.env.RECIPES_MONGO_SRV_SERVICE_PORT}/recipes`,
		{
	
		});
	
	console.log('Connected to MongoDb');
};

const start = async () => {

  if(!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
  if(!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID must be defined');
  if(!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID must be defined');
  

  try {
		
		setupNatsStreamingServer();
		setupMongoDB();

  } catch (err) {
    console.error(err);
  }

  app.listen(3001, () => {
    console.log('Listening on port 3001');
  });
};

start();
